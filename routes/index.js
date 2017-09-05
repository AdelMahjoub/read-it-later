const router   = require('express').Router();
const passport = require('passport');

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

router.get('/', home);

router.route('/signup')
  .get(signup.form)
  .post( 
    signup.validate, 
    notify('error'), 
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
    notify('error'),
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
    notify('error'),
    dashboard.post
  )

router.route('/articles/:id?')
  .get(
    authGuard,
    article.validate,
    article.notify,
    article.render
  )

router.route('/articles/delete/:id?')
  .get(
    authGuard,
    article.validate,
    article.notify,
    article.remove
  )

router.get('/logout', logout);

router.use(notFound);

router.use(errorHandler);

module.exports = router;