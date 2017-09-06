const { check, validationResult } = require('express-validator/check');

module.exports = function(type, path) {
  return function(req, res, next) {
    const errors = validationResult(req);
    type = type || 'error';
    path = path || req.url;
    let errorMessages = [];
    if(!errors.isEmpty()) {
      Object.keys(errors.mapped()).forEach(field => {
        errorMessages.push(errors.mapped()[field]['msg']);
      });
      req.flash(type, errorMessages);
      req.flash('username', req.body['username']);
      req.flash('email', req.body['email']);
      return res.redirect(path);
    }
    next();
  }
}