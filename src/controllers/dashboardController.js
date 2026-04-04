const Record = require('../models/Record');

// @desc    Get dashboard summary statistics
// @route   GET /api/dashboard/summary
// @access  Private (Analyst, Admin)
exports.getSummary = async (req, res, next) => {
  try {
    const totalIncomeResult = await Record.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalExpenseResult = await Record.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalIncome = totalIncomeResult[0] ? totalIncomeResult[0].total : 0;
    const totalExpense = totalExpenseResult[0] ? totalExpenseResult[0].total : 0;
    const netBalance = totalIncome - totalExpense;

    const categoryTotals = await Record.aggregate([
      { $group: { _id: { category: '$category', type: '$type' }, total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    const recentActivity = await Record.find()
      .sort('-createdAt')
      .limit(5)
      .populate('createdBy', 'name');

    // Monthly trends (group by Year and Month)
    const monthlyTrends = await Record.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalIncome,
        totalExpenses: totalExpense,
        netBalance,
        categoryTotals,
        monthlyTrends,
        recentActivity
      }
    });

  } catch (error) {
    next(error);
  }
};
