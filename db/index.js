const sqlite3 = require('sqlite3');
const path = require('path');

const db = new sqlite3.Database(
  path.resolve(__dirname, '../', process.env.DB_FOLDER, process.env.DB_FILE)
);

db.serialize(function() {
  const usersTable = `CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  )`;
  const articlesTable = `CREATE TABLE IF NOT EXISTS Articles (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    posted_by INTEGER,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    url TEXT NOT NULL
  )`;
  db.run(usersTable);
  db.run(articlesTable);
});

module.exports = db;
