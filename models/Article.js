const db = require('../db');

class Article {

  /**
   * 
   * @param {{ title: string, content: string, posted_by: number, url: string }} obj 
   */
  constructor(obj) {
    Object.keys(obj).forEach(key => {
      this[key] = obj[key];
    });
  }

  /**
   * 
   * @param {number} userId 
   * @param {function(Error, [])} cb 
   */
  static find(userId, cb) {
    const query = 'SELECT * FROM Articles WHERE posted_by = ?';
    db.all(query, userId, cb);
  }

  /**
   * 
   * @param {number} id 
   * @param {function(Error, Article)} cb 
   */
  static findById(id, cb) {
    db.get('SELECT * FROM Articles WHERE id = ?', id, cb);
  }

  /**
   * 
   * @param {Article} article 
   * @param {number} userId 
   * @param {function(Error, { lastID: number, changes: number })} cb 
   */
  static insert(article, userId, cb) {
    const query = `INSERT INTO 
      Articles (title, content, posted_by, url)
      VALUES ( ?, ?, ?, ?)`;
    db.run(query, article.title, article.content, userId, article.url, function(err) {
      if(err) {
        return cb(err)
      }
      cb(null, this);
    });
  }

  /**
   * 
   * @param {number} articleId 
   * @param {function(Error, { lastID: number, changes: number })} cb 
   */
  static remove(articleId, cb) {
    const query = 'DELETE FROM Articles WHERE id = ?';
    db.run(query, articleId, function(err) {
      if(err) {
        return cb(err);
      }
      cb(null, this);
    });
  }
}

module.exports = Article;