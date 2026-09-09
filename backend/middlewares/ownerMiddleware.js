const jwt = require('jsonwebtoken');

const ownerAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Owner token not found'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Owner token not found'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded.ownerId) {
      return res.status(403).json({
        message: 'Owner access required'
      });
    }
    req.owner = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired owner token'
    });
  }
};

module.exports = ownerAuthMiddleware;
