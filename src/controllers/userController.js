const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or status
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role, status } = req.body;
    
    // Validate role and status if provided
    const validRoles = ['Viewer', 'Analyst', 'Admin'];
    const validStatuses = ['Active', 'Inactive'];

    if (role && !validRoles.includes(role)) {
       return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    if (status && !validStatuses.includes(status)) {
       return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        ...(role && { role }), 
        ...(status && { status }) 
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
