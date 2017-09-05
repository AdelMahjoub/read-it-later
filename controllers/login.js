const { check, validationResult } = require('express-validator/check');

const form = function(req, res, next) {
  res.render('login');
}

const validate = [
  check('email')
    .exists()
    .withMessage('The email field is required')
    .not()
    .isEmpty()
    .withMessage('The email is required')
    .isEmail()
    .withMessage('The email address is not valid'),
  check('password')
    .exists()
    .withMessage('The password field is required')
    .not()
    .isEmpty()
    .withMessage('The password is required')
];

module.exports = { form, validate }