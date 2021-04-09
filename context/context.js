const jwt = require('jsonwebtoken');
const error = require('../errors/errorMessages');

module.exports.context = function ({ req }) {
  var authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return {
      userLoggedIn: decoded.username
    };

  }
};