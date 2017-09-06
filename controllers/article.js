const { check, validationResult } = require('express-validator/check');
const path = require('path');
const wkhtmltopdf = require('wkhtmltopdf');
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

const render = function(type = 'html') {
  return function(req, res, next) {
    Article.findById(req.params.id, (err, article) => {
      if(err) {
        req.flash('error', ['Unable to get the article, please try again']);
        return res.redirect('/dashboard');
      }
      if(!Boolean(article)) {
        req.flash('error', ['Article do not or no longer exits']);
        return res.redirect('/dashboard');
      }
      switch(type) {
        case 'pdf':
          const options = {
            encoding: "utf-8",
            minimumFontSize: 16,
            disableSmartShrinking: true,
          }
          res.setHeader('Content-type', 'application/pdf');
          wkhtmltopdf(article.content, options).pipe(res);
        break;
        default:
          res.locals.article = article;
          res.render('article');
      }
    });
  }
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

module.exports = { validate, render, remove }