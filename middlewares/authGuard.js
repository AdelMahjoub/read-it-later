module.exports = function(req, res, next) {
  if(req.isUnauthenticated()) {
    req.flash('error', ['Login to access your dashboard']);
    return res.redirect('/login');
  }
  next();
}