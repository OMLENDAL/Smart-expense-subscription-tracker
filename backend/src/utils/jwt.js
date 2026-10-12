// This utility centralizes JWT token creation and verification.
// It keeps the authentication logic in one small place and makes the app easier to maintain.
const jwt = require('jsonwebtoken');

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret-key', {
    expiresIn: '7d',
  });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');
}

module.exports = {
  signToken,
  verifyToken,
};
