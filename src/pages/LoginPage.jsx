import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, Mail, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import authService from '../services/authService'

function LoginPage() {
  const navigate = useNavigate()
  const setCredentials = useAuthStore((state) => state.setCredentials)
  const [apiError, setApiError] = useState(null)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState(null)
  const [resendStatus, setResendStatus] = useState(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [resendCooldown])

  const handleResendConfirmation = async (targetEmail) => {
    const emailToUse = (targetEmail || unconfirmedEmail || getValues('email') || '').trim()
    if (!emailToUse) {
      toast.error('Please enter your email address to resend confirmation.')
      return
    }

    try {
      setResendStatus({ loading: true, message: null, error: null })
      const res = await authService.resendConfirmation(emailToUse)
      const successMsg = res.data?.message || 'Confirmation email sent! Please check your inbox and spam folder.'
      setResendStatus({ loading: false, message: successMsg, error: null })
      toast.success('Confirmation email dispatched!')
      setResendCooldown(60)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resend confirmation email. Please check back later.'
      setResendStatus({ loading: false, message: null, error: msg })
      toast.error(msg)
    }
  }

  const onSubmit = async (data) => {
    try {
      setApiError(null)
      setUnconfirmedEmail(null)
      setResendStatus(null)
      const response = await authService.login(data)

      setCredentials({
        user: response.data.user,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      })

      navigate('/app/dashboard')
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.'
      setApiError(message)

      if (error.response?.data?.needsEmailConfirmation || message.toLowerCase().includes('confirm your email')) {
        setUnconfirmedEmail(error.response?.data?.email || data.email)
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <img
            src="/leadms_logo.jpg"
            alt="LeadMS"
            className="mx-auto h-14 w-14 rounded-2xl object-cover shadow-md border border-gray-200 mb-3"
          />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Lead<span className="text-cyan-600">MS</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to your account
          </p>
        </div>

        {apiError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{apiError}</p>

                {(unconfirmedEmail || apiError.toLowerCase().includes('confirm your email')) && (
                  <div className="mt-3 pt-3 border-t border-red-200/80">
                    <p className="text-xs text-red-600 mb-2">
                      Didn't receive the verification email or link expired?
                    </p>
                    <button
                      type="button"
                      disabled={resendStatus?.loading || resendCooldown > 0}
                      onClick={() => handleResendConfirmation(unconfirmedEmail)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      {resendStatus?.loading ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" /> Sending link...
                        </>
                      ) : resendCooldown > 0 ? (
                        `Resend link in ${resendCooldown}s`
                      ) : (
                        <>
                          <Mail size={13} /> Resend Confirmation Email
                        </>
                      )}
                    </button>
                    {resendStatus?.message && (
                      <p className="mt-2 text-xs font-semibold text-emerald-700">
                        ✓ {resendStatus.message}
                      </p>
                    )}
                    {resendStatus?.error && (
                      <p className="mt-2 text-xs text-red-700">
                        ✗ {resendStatus.error}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                errors.email ? 'border-red-400' : 'border-gray-300'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                errors.password ? 'border-red-400' : 'border-gray-300'
              }`}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-600/20 transition-all hover:from-cyan-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-cyan-600 hover:text-cyan-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
