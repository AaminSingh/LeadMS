import User from '../models/User.js';
import Lead from '../models/Lead.js';
import Product from '../models/Product.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().populate('assignedTo vendorId createdBy', 'firstName lastName email role');
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    // 1. User counts by role
    const users = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    const userStats = users.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

    // 2. Lead stats
    const totalLeads = await Lead.countDocuments();
    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const leadStats = leadsByStatus.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});

    // 3. Product stats
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });

    // 4. Revenue / Quoted Analytics directly from database records
    const quotedLeads = await Lead.find({
      $or: [
        { status: { $in: ['quoted', 'accepted'] } },
        { 'quote.finalTotal': { $gt: 0 } }
      ]
    });

    let totalQuotedRevenue = 0;
    let totalExpectedMargin = 0;
    let totalInvoicedAmount = 0;
    let totalInvoicesCount = 0;
    let outstandingAmount = 0;
    let outstandingCount = 0;
    let paidAmount = 0;
    let paidCount = 0;

    quotedLeads.forEach((lead) => {
      if (lead.quote && (lead.quote.finalTotal || 0) > 0) {
        const amt = Number(lead.quote.finalTotal || 0);
        totalInvoicedAmount += amt;
        totalInvoicesCount += 1;
        totalQuotedRevenue += amt;
        totalExpectedMargin += Number(lead.quote.marginApplied || 0);

        if (lead.status === 'accepted') {
          paidAmount += amt;
          paidCount += 1;
        } else {
          outstandingAmount += amt;
          outstandingCount += 1;
        }
      }
    });

    res.status(200).json({
      users: userStats,
      leads: {
        total: totalLeads,
        byStatus: leadStats
      },
      products: {
        total: totalProducts,
        active: activeProducts
      },
      revenue: {
        totalQuoted: totalQuotedRevenue,
        totalExpectedMargin,
        totalInvoicedAmount,
        totalInvoicesCount,
        outstandingAmount,
        outstandingCount,
        paidAmount,
        paidCount
      }
    });
  } catch (error) {
    next(error);
  }
};
