const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Newdb = require('nedb');

// Auth requirements
const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;

// Upload requirements
const multer = require('multer');
const cors = require('cors');
const utils = require('./utils');

// Upload Config
const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, 'data');
const UPLOAD_PATH = path.join(DATA_PATH, 'images');

// Configure multer storage, lol
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function(req, file, cb) {
    var ext = require('path').extname(file.originalname);
    ext = ext.length > 1 ? ext : '.' + require('mime').extension(file.mimetype);
    require('crypto').pseudoRandomBytes(16, function(err, raw) {
      cb(null, (err ? undefined : raw.toString('hex')) + ext);
    });
  }
});

const upload = multer({ storage: storage, fileFilter: utils.imageFilter });

// DB
const DB_NAME = 'images.db';
const db = new Newdb({
  filename: `${DATA_PATH}/${DB_NAME}`,
  timestampData: true,
  autoload: true
});

const index = require('./routes/index');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

passport.use(
  new Strategy(function(token, cb) {
    if (token === process.env.BEARER_TOKEN && process.env.BEARER_TOKEN) {
      return cb(null, true);
    } else {
      return cb(null, false);
    }
  })
);

app.use('/', index);
app.post('/upload', passport.authenticate('bearer', { session: false }), upload.single('image'), async (req, res) => {
  try {
    req.file.expires = new Date(req.body.expires) || null;
    db.insert(req.file, (err, newDoc) => {
      if (err) {
        throw err;
      }

      res.status(201).json({
        id: newDoc._id,
        fileName: newDoc.filename,
        originalName: newDoc.originalname,
        mimetype: newDoc.mimetype,
        expires: newDoc.expires,
        self: `/images/${newDoc.filename}`
      });
    });
  } catch (err) {
    res.sendStatus(400);
  }
});

app.use('/images', express.static(UPLOAD_PATH));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  if (req.path.indexOf('/images') === 0) {
    res.sendFile(path.join(__dirname, '/public/assets/404.png'));
  } else {
    res.render('error');
  }
});

module.exports = app;
