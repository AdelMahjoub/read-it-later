require('./configs/passport')();
const express      = require('express');                  // http://expressjs.com/en/4x/api.html
const bodyParser   = require('body-parser');              // https://github.com/expressjs/body-parser
const session      = require('express-session');          // https://github.com/expressjs/session
const SQLiteStore  = require('connect-sqlite3')(session); // https://github.com/rawberg/connect-sqlite3
const cookieParser = require('cookie-parser');            // https://github.com/expressjs/cookie-parser
const flash        = require('connect-flash');            // https://github.com/jaredhanson/connect-flash
const helmet       = require('helmet');                   // https://github.com/helmetjs/helmet
const compression  = require('compression');              // https://github.com/expressjs/compression
const path         = require('path');                     // https://nodejs.org/dist/latest-v6.x/docs/api/path.html
const passport     = require('passport');                 // http://passportjs.org/docs
  
const app     = express();
const context = require('./middlewares/context'); // Middleware that adds more variables to the views context 
const routes  = require('./routes');

// Require the connection to the database
const db = require('./db');

// Instanciate the sessions store
const sessStore = new SQLiteStore({
  table: 'sessions',
  db: process.env.DB_FILE,
  dir: path.join(__dirname, process.env.DB_FOLDER)
})

app
  /**
   * App settings
   * 
   * // http://expressjs.com/en/4x/api.html#app.settings.table
   */
  .set('port', process.env.PORT || 3000)
  .set('json spaces', 2)
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))
  .enable('trust proxy')

  /**
   * App middlewares chain
   * Usage of each middleware is described on the links on top of this file 
   */
  .use(helmet())
  .use(cookieParser(process.env.SESS_SECRET))
  .use(session({
    secret: process.env.SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    proxy: true,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: app.get('env') === 'production' ? true : false,
      maxAge: 24 * 3600 * 1000
    },
    store: sessStore
  }))
  .use(flash())
  .use(passport.initialize())
  .use(passport.session())
  .use(compression())
  .use(express.static(path.join(__dirname, 'public')))
  .use(context(app))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(routes)
  .listen(app.get('port'), () => {
    console.log("Server running:\nPORT = %d\nMODE = %s\n", app.get('port'), app.get('env'));
  });