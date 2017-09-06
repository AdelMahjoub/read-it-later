const bcrypt = require('bcrypt');
const db = require('../db');

class User {
  /**
   * Instanciate a new user to insert
   * @param {{ username: string, email:string, password:string }} obj 
   */
  constructor(obj) {
    Object.keys(obj).forEach(key => {
      this[key] = obj[key];
    });
  }

  static saltRounds() {
    return 10;
  }

  /**
   * Find all users
   * @param {function(Error, [])} cb 
   */
  static find(cb) {
    db.all('SELECT * FROM Users', cb)
  }

  /**
   * Find a user by id
   * @param {number} id 
   * @param {function(Error, User)} cb 
   */
  static findById(id, cb) {
    db.get('SELECT * FROM Users WHERE id = ?', id, cb);
  }

  /**
   * Find a user by email
   * @param {string} email 
   * @param {function(Error, User)} cb 
   */
  static findByEmail(email, cb) {
    db.get('SELECT * FROM Users WHERE email = ?', email, cb);
  }

  /**
   * Find user by username
   * @param {string} username 
   * @param {function(Error, User)} cb 
   */
  static findByUsername(username, cb) {
    db.get('SELECT * FROM Users WHERE username = ?', username, cb);
  }
  /**
   * Hash a password
   * @param {string} password 
   * @param {function(Error, string)} cb 
   */
  static hashPassword(password, cb) {
    bcrypt.genSalt(User.saltRounds(), function(err, salt) {
      bcrypt.hash(password, salt, cb);
    });
  }

  /**
   * Compare a string and a hashed password
   * @param {string} guess 
   * @param {string} password 
   * @param {function(Error, boolean)} cb 
   */
  static validPassword(guess, password, cb) {
    bcrypt.compare(guess, password, cb);
  }

  /**
   * Insert a new user 
   * @param {User} user 
   * @param {function(Error, {lastID: number, changes: number})} cb 
   */
  static insert(user, cb) {
    const query = `INSERT INTO 
      Users(username, email, password)
      VALUES(?, ?, ?)`;
    User.hashPassword(user.password, function(err, hash) {
      if(err) {
        return cb(err);
      }
      user.password = hash;
      db.run(query, user.username, user.email, user.password, function(err) {
        if(err) {
          return cb(err);
        }
        cb(null, this);
      });
    });
  }

}

module.exports = User;