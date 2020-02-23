var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var indexRouter = require('./routes/index');
var settingIndexRouter = require('./routes/settingIndex');

var cartoonRouter = require('./routes/cartoon');
var settingRouter = require('./routes/setting');
var bodyParser = require('body-parser');

var commonConfig = require('./config.json');
var loginRouter = require('./routes/login');
var notificationRouter = require('./routes/notification');

var app = express();

var db = require('./db.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: commonConfig.SessionSecret,
  resave: true,
  saveUninitialized: false,
}));

var checkSession = (req, res, next) => {
  if (req._parsedUrl.pathname === '/notification' || req._parsedUrl.pathname === '/notification/sendnotification') {
    if (req._parsedUrl.pathname === '/notification' || req.session && req.session.userId) {
      return next();
    } else {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      res.redirect('/notification');
    }
  } else {
    return next();
  }

};
app.use(checkSession);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/insertcartoon', cartoonRouter);
app.use('/index/insertcartoon', cartoonRouter);
app.use('/index/insertcartoon', cartoonRouter);
app.use('/settingIndex', settingIndexRouter)
app.use('/insertsetting', settingRouter);
app.use('/index/insertsetting', settingRouter);

app.use('/notification', loginRouter);
app.use('/notification/sendnotification', notificationRouter);

// app.use('/uploadSetting',settingRouter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
