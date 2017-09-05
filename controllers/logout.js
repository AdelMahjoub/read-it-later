module.exports = function(req, res, next) {
  req.logout();
  res.redirect('/');
}