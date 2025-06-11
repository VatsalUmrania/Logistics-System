// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(' ')[1];
        
//         if (!token) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Authentication token missing'
//             });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             message: 'Invalid or expired token'
//         });
//     }
// };

// const adminMiddleware = (req, res, next) => {
//     if (!req.user?.is_admin) {
//         return res.status(403).json({
//             success: false,
//             message: 'Admin access required'
//         });
//     }
//     next();
// };

// module.exports = { authMiddleware, adminMiddleware };

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    console.log('Authorization header:', req.headers.authorization);
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user?.is_admin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };