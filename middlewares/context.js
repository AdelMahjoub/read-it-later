module.exports = function(app) {
  return function(req, res, next) {
    app.locals.title = "Read it later";
    app.locals.errors = req.flash('error');
    app.locals.infos = req.flash('info');
    app.locals.invalidUsername = req.flash('invalidUsername');
    app.locals.invalidEmail = req.flash('invalidEmail');
    app.locals.user = req.user;
    next();
  }
}