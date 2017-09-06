const router   = require('express').Router();
const passport = require('passport');

const pdf = require('html-pdf');
const Article = require('../models/Article'); 

const notify       = require('../middlewares/notifiy');
const errorHandler = require('../middlewares/errorHandler');
const authGuard    = require('../middlewares/authGuard');

const home      = require('../controllers');
const signup    = require('../controllers/signup');
const login     = require('../controllers/login');
const logout    = require('../controllers/logout');
const dashboard = require('../controllers/dashboard');
const article   = require('../controllers/article');
const notFound  = require('../controllers/notFound');

router.route('/')
  .get(home.render)

router.route('/signup')
  .get(signup.form)
  .post( 
    signup.validate, 
    notify('error', '/signup'), 
    signup.register,
    passport.authenticate('local', {
      failureRedirect: '/login',
      successRedirect: '/dashboard',
      failureFlash: 'Invalid email or password',
    })
  )

router.route('/login')
  .get(login.form)
  .post(
    login.validate,
    notify('error', '/login'),
    passport.authenticate('local', {
      failureRedirect: '/login',
      successRedirect: '/dashboard',
      failureFlash: 'Invalid username or password'
    })
  )

router.route('/dashboard')
  .get(
    authGuard,
    dashboard.render
  )
  .post(
    authGuard,
    dashboard.validate,
    notify('error', '/dashboard'),
    dashboard.post
  )

router.route('/articles/:id?')
  .get(
    authGuard,
    article.validate,
    notify('error', '/dashboard'),
    article.render('html')
  )

router.route('/articles/delete/:id?')
  .get(
    authGuard,
    article.validate,
    notify('error', '/dashboard'),
    article.remove
  )

router.route('/articles/pdf/:id')
  .get(
    authGuard,
    article.validate,
    notify('error', '/dashboard'),
    article.render('pdf')
  )

router.get('/logout', logout);

router.use(notFound);

router.use(errorHandler);

module.exports = router;