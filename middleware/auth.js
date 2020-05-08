const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const tokenDecoded = jwt.verify(token, config.get('jwt.privateKey'));
    req.user = tokenDecoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};