const { check, validationResult } = require('express-validator/check');
const Article = require('../models/Article');

const validate = [
  check('id')
    .exists()
    .withMessage('Article not found')
    .not()
    .isEmpty()
    .withMessage('Article not found')
    .isNumeric()
    .withMessage('Article not found')
];

const notify = function(req, res, next) {
  const errors = validationResult(req);
  let errorMessages = [];
  if(!errors.isEmpty()) {
    Object.keys(errors.mapped()).forEach(field => {
      errorMessages.push(errors.mapped()[field]['msg']);
    });
    req.flash('error', errorMessages);
    return res.redirect('/dashboard');
  }
  next();
}

const render = function(req, res, next) {
  Article.findById(req.params.id, (err, article) => {
    if(err) {
      req.flash('error', ['Unable to get the article, please try again']);
      return res.redirect('/dashboard');
    }
    if(!Boolean(article)) {
      req.flash('error', ['Article do not or no longer exits']);
      return res.redirect('/dashboard');
    }
    res.locals.article = article;
    res.render('article');
  });
}

const remove = function(req, res, next) {
  Article.remove(req.params.id, (err, result) => {
    if(err) {
      req.flash('error', ['Unable to delete the article, please try again']);
      return res.redirect('/dashboard');
    }
    req.flash('info', [`Deleted article, id: ${result.lastID}`]);
    return res.redirect('/dashboard');
  });
}

module.exports = { validate, notify, render, remove }