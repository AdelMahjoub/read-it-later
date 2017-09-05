const { check, validationResult } = require('express-validator/check');
const validator = require('validator');

const User = require('../models/User');

const form = function(req, res, next) {
  res.render('signup');
}

const validate = [
  check('username')
    .exists()
    .withMessage('The username field is required')
    .not()
    .isEmpty()
    .withMessage('The username is required')
    .isLength({min: 4, max: 12})
    .withMessage('The username length should be between 4 and 12 caracters')
    .isAlphanumeric()
    .withMessage('The username should not contain special caracters')
    .custom(value => {
      return new Promise((resolve, reject) => {
        User.findByUsername(value, (err, user) => {
          if(err) {
            reject(new Error('Unexpected error, please try again'));
          }
          if(Boolean(user)) {
            reject(new Error('This username is already in use'));
          }
          resolve(true);
        });
      });
    }),

  check('email')
    .exists()
    .withMessage('The email field is required')
    .not()
    .isEmpty()
    .withMessage('The email is required')
    .isEmail()
    .withMessage('The email address is not valid')
    .custom(value => {
        return new Promise((resolve, reject) => {
        User.findByEmail(value, (err, user) => {
          if(err) {
            reject(new Error('Unexpected error, please try again'));
          }
          if(Boolean(user)) {
            reject(new Error('This email is already in use'));
          }
          resolve(true);
        });
      });
    }),

  check('password')
    .exists()
    .withMessage('The password field is required')
    .not()
    .isEmpty()
    .withMessage('The password is required')
    .isLength({min: 4, max: 12})
    .withMessage('The password length should be between 4 and 12 caracters'),

  check('confirmPassword')
    .exists()
    .withMessage('The confirm password field is required')
    .not()
    .isEmpty()
    .withMessage('The confirm password is required')
    .custom((value, {req}) => {
      return new Promise((resolve, reject) => {
        const password = Buffer.from(req.body['password']);
        const confirmPassword = Buffer.from(value);
        if(password.compare(confirmPassword) !== 0) {
          reject(new Error('The passwords do not matches'))
        } else {
          resolve(true);
        }
      });
    })
];

const register = function(req, res, next) {
  const candidate = new User({
    username: validator.escape(req.body.username),
    email: validator.escape(req.body.email),
    password: req.body.password
  });
  User.insert(candidate, (err, result) => {
    if(err) {
      req.flash('Unexpected error while registering, please try again');
      return res.redirect(req.url);
    }
    next();
  });
}

module.exports = {
  form,
  validate,
  register
}