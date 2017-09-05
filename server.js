require('dotenv').config();
require('./configs/passport')();
const express      = require('express');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const SQLiteStore  = require('connect-sqlite3')(session); 
const cookieParser = require('cookie-parser');
const flash        = require('connect-flash');
const helmet       = require('helmet');
const compression  = require('compression');
const path         = require('path');
const passport     = require('passport');
  
const app     = express();
const context = require('./middlewares/context');
const routes  = require('./routes');

const db = require('./db');
const sessStore = new SQLiteStore({
  table: 'sessions',
  db: process.env.DB_FILE,
  dir: path.join(__dirname, process.env.DB_FOLDER)
})

app
  .set('port', process.env.PORT || 3000)
  .set('json spaces', 2)
  .set('view engine', 'ejs')
  .set('views', path.join(__dirname, 'views'))
  .enable('trust proxy')

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

  const User = require('./models/User');