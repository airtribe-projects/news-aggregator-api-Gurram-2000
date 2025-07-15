const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY

function authentication(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No Token Provided: This resource requires authentication' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Unauthorized: Token is invalid or expired.' });
  }
}

module.exports = authentication;