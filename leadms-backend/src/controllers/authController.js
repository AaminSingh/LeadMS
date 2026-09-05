import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Token from '../models/Token.js';
import { sendConfirmationEmail, sendPasswordResetEmail, sendInvitationEmail } from '../services/emailService.js';

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = crypto.randomBytes(40).toString('hex');
  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    let { email, password, role, firstName, lastName, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedRole = (role || '').trim().toLowerCase();

    // Only allow trader and vendor self-signup
    if (!['trader', 'vendor'].includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role for public signup. Allowed roles are Trader or Vendor.' });
    }

    // Support single 'name' field if firstName / lastName not explicitly separated
    if (name && (!firstName || !lastName)) {
      const nameParts = name.trim().split(/\s+/);
      firstName = firstName || nameParts[0] || '';
      lastName = lastName || nameParts.slice(1).join(' ') || '';
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email address already exists.' });
    }

    const user = await User.create({
      email: normalizedEmail,
      password,
      role: normalizedRole,
      firstName: firstName || '',
      lastName: lastName || ''
    });

    // Create confirmation token and attempt email dispatch in dedicated try/catch
    let emailSent = false;
    let emailErrorDetail = null;

    try {
      const tokenStr = crypto.randomBytes(32).toString('hex');
      await Token.create({ userId: user._id, token: tokenStr, type: 'email-confirmation' });

      // Send email (points to live backend server where confirmEmail route handles verification)
      const domain = (process.env.SERVER_URL || process.env.BACKEND_URL || 'https://leadms-backend-theta.vercel.app').replace(/\/+$/, '');
      await sendConfirmationEmail(user.email, tokenStr, domain);
      emailSent = true;
    } catch (mailErr) {
      console.error('[authController] Confirmation email could not be sent:', {
        message: mailErr.message,
        code: mailErr.code,
        command: mailErr.command,
        response: mailErr.response,
        smtpDetails: mailErr.fullErrorDetails || mailErr.smtpDetails
      });
      emailErrorDetail = mailErr.message || 'Email delivery service unavailable';
    }

    if (!emailSent) {
      // Graceful fallback: user stays created in database, surface resend option on login
      return res.status(201).json({
        success: true,
        emailSent: false,
        message: 'Account created successfully! We had trouble delivering your confirmation email right now. You can request a new confirmation email from the login page.',
        emailWarning: emailErrorDetail
      });
    }

    return res.status(201).json({
      success: true,
      emailSent: true,
      message: 'Account created successfully! Please check your email inbox to confirm your account before logging in.'
    });
  } catch (error) {
    console.error('[authController] Registration error:', error);
    return res.status(error.statusCode || 400).json({
      message: error.message || 'Registration failed. Please check your information and try again.'
    });
  }
};

const renderVerificationPage = (success, message) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; max-width: 400px; width: 100%; }
        .icon { font-size: 48px; margin-bottom: 20px; }
        .success .icon { color: #28a745; }
        .error .icon { color: #dc3545; }
        h1 { margin: 0 0 10px; font-size: 24px; color: #333; }
        p { color: #666; margin-bottom: 30px; line-height: 1.5; }
        .btn { background: #007bff; color: white; border: none; padding: 12px 24px; border-radius: 4px; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; transition: background 0.3s; }
        .btn:hover { background: #0056b3; }
        .timer { font-size: 14px; color: #999; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card ${success ? 'success' : 'error'}">
        <div class="icon">${success ? '✓' : '✗'}</div>
        <h1>${success ? 'Verification Successful' : 'Verification Failed'}</h1>
        <p>${message}</p>
        ${success ? `<a class="btn" style="margin-bottom: 10px; display: inline-block;" href="${process.env.CLIENT_URL || 'https://leadms-eta.vercel.app'}/login">Log In to LeadMS</a><br/>` : ''}
        <button class="btn" style="${success ? 'background: #6c757d;' : ''}" onclick="window.close()">Close Window</button>
        <div class="timer">Closing automatically in <span id="countdown">10</span> seconds...</div>
    </div>
    <script>
        let timeLeft = 10;
        const countdownEl = document.getElementById('countdown');
        const timer = setInterval(() => {
            timeLeft--;
            countdownEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                window.close();
            }
        }, 1000);
    </script>
</body>
</html>
`;

export const confirmEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const tokenDoc = await Token.findOne({ token, type: 'email-confirmation' });

    if (!tokenDoc) {
      return res.status(400).send(renderVerificationPage(false, 'The verification link is invalid or has expired.'));
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).send(renderVerificationPage(false, 'The user associated with this verification link could not be found.'));
    }

    user.isEmailConfirmed = true;
    await user.save();

    await tokenDoc.deleteOne();

    res.status(200).send(renderVerificationPage(true, 'Your email has been successfully confirmed. You can now login to your account.'));
  } catch (error) {
    res.status(500).send(renderVerificationPage(false, 'An internal server error occurred during verification.'));
  }
};

// Rate limiting cache for resend confirmation: email -> timestamp
const resendRateLimitMap = new Map();

export const resendConfirmation = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Rate limiting check: 60-second cooldown per email
    const lastSent = resendRateLimitMap.get(normalizedEmail);
    const now = Date.now();
    const cooldownMs = 60 * 1000;

    if (lastSent && (now - lastSent < cooldownMs)) {
      const remainingSec = Math.ceil((cooldownMs - (now - lastSent)) / 1000);
      return res.status(429).json({
        message: `Please wait ${remainingSec} seconds before requesting another confirmation email.`
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Standard message to avoid email enumeration
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a confirmation link has been sent.'
      });
    }

    if (user.isEmailConfirmed) {
      return res.status(400).json({
        message: 'This email is already verified. You can log in directly.'
      });
    }

    // Delete any stale tokens for this user
    await Token.deleteMany({ userId: user._id, type: 'email-confirmation' });

    // Generate fresh token
    const tokenStr = crypto.randomBytes(32).toString('hex');
    await Token.create({ userId: user._id, token: tokenStr, type: 'email-confirmation' });

    const domain = (process.env.SERVER_URL || process.env.BACKEND_URL || 'https://leadms-backend-theta.vercel.app').replace(/\/+$/, '');
    await sendConfirmationEmail(user.email, tokenStr, domain);

    // Record rate limit timestamp
    resendRateLimitMap.set(normalizedEmail, now);

    return res.status(200).json({
      success: true,
      message: 'A new confirmation email has been sent! Please check your inbox and spam folder.'
    });
  } catch (error) {
    console.error('[authController:resendConfirmation] Error:', error);
    return res.status(500).json({
      message: error.message || 'Failed to resend confirmation email. Please try again later.'
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isEmailConfirmed) {
      return res.status(401).json({
        message: 'Please confirm your email first',
        needsEmailConfirmation: true,
        email: user.email
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    // Single device login logic: invalidate any old refresh token
    user.activeRefreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = req.user;
    user.activeRefreshToken = null;
    await user.save();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' });

    const user = await User.findOne({ activeRefreshToken: refreshToken });

    if (!user) {
      // Possible token reuse attack or simply logged out/invalidated
      return res.status(403).json({ message: 'Refresh token is invalid or expired' });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);
    user.activeRefreshToken = tokens.refreshToken;
    await user.save();

    res.status(200).json(tokens);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tokenStr = crypto.randomBytes(32).toString('hex');
    await Token.create({ userId: user._id, token: tokenStr, type: 'password-reset' });

    const domain = process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`;
    await sendPasswordResetEmail(user.email, tokenStr, domain);

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const tokenDoc = await Token.findOne({ token, type: 'password-reset' });

    if (!tokenDoc) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(tokenDoc.userId);
    user.password = newPassword;
    user.activeRefreshToken = null; // Log out everywhere
    await user.save();

    await tokenDoc.deleteOne();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

// Vendor invites a team-member
export const inviteTeamMember = async (req, res, next) => {
  try {
    const { email, designation } = req.body;
    const vendorId = req.user._id;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const tokenStr = crypto.randomBytes(32).toString('hex');

    // We can pre-create a shell user
    const user = await User.create({
      email,
      password: crypto.randomBytes(16).toString('hex'), // random password
      role: 'team-member',
      vendorId,
      designation
    });

    await Token.create({ userId: user._id, token: tokenStr, type: 'invitation' });

    const domain = process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 5000}`;
    await sendInvitationEmail(user.email, tokenStr, domain, designation);

    res.status(200).json({ message: 'Invitation sent' });
  } catch (error) {
    next(error);
  }
};

// Team member accepts invitation and sets password
export const acceptInvitation = async (req, res, next) => {
  try {
    const { token, firstName, lastName, password } = req.body;
    const tokenDoc = await Token.findOne({ token, type: 'invitation' });

    if (!tokenDoc) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(tokenDoc.userId);
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = password;
    user.isEmailConfirmed = true; // Implicitly confirmed
    await user.save();

    await tokenDoc.deleteOne();

    res.status(200).json({ message: 'Account registered successfully. You can now login.' });
  } catch (error) {
    next(error);
  }
};
