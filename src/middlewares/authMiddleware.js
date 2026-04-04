const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here');

    // Attach user to request
    const user = await User.findById(decoded.id);

    if (!user) {
       return res.status(401).json({ success: false, error: 'User no longer exists' });
    }

    if (user.status === 'Inactive') {
       return res.status(403).json({ success: false, error: 'Your account is inactive. Please contact admin.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

module.exports = { protect };
