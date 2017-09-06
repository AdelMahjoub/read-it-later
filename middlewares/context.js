module.exports = function(app) {
  return function(req, res, next) {
    app.locals.title = "Read it later";
    app.locals.errors = req.flash('error');
    app.locals.infos = req.flash('info');
    app.locals.formUsername = req.flash('username');
    app.locals.formEmail = req.flash('email');
    app.locals.user = req.user;
    next();
  }
}