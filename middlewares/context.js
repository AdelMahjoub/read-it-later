module.exports = function(app) {
  return function(req, res, next) {
    app.locals.title = "Read it later";
    app.locals.errors = req.flash('error');
    app.locals.infos = req.flash('info');
    app.locals.user = req.user;
    next();
  }
}