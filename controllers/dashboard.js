const read = require('node-readability');
const { check, validationResult } = require('express-validator/check');
const validator = require('validator');

const Article = require('../models/Article');

const render = function(req, res, next) {
  Article.find(req.user.id, (err, articles) => {
    if(err) {
      return next(err);
    }
    res.locals.articles = articles;
    res.render('dashboard');
  });
}

const validate = [
  check('articleUrl')
    .exists()
    .withMessage('The article url field is required')
    .not()
    .isEmpty()
    .withMessage('The article url is required')
    .isURL()
    .withMessage('The article url is not valid')
];

const post = function(req, res, next) {
  const articleUrl = req.body.articleUrl;
  read(articleUrl, (err, article, meta) => {
    if(err || !Boolean(article)) {
      req.flash('error', ['Unable to get article content']);
      return res.redirect(req.url);
    }
    const newArticle = new Article({
      title: article.title,
      content: article.content,
      url: articleUrl,
      posted_by: req.user.id
    });
    Article.insert(newArticle, req.user.id, (err, result) => {
      if(err) {
        req.flash('error', ['Unable to add the article']);
        return res.redirect(req.url);
      }
      article.close();
      req.flash('info', [`Added a new article, id: ${result.lastID}`]);
      return res.redirect(req.url);
    });
  });
}


module.exports = { render, validate, post }