var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var expressLayouts = require('express-ejs-layouts');

var db = require('./db.js');

var commonConfig = require('./config.json');
var loginRouter = require('./routes/login');
var notificationRouter= require('./routes/notification');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(session({
  secret: commonConfig.SessionSecret,
  resave: true,
  saveUninitialized: false,
}));

var checkSession = (req, res, next) => {
  if (req._parsedUrl.pathname === '/notification' || req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You must be logged in to view this page.');
    err.status = 401;
    res.redirect('/notification');
  }
};
app.use(checkSession);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/notification/sendnotification', notificationRouter);
app.use('/notification', loginRouter);


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

app.listen(5005, () => {
  console.log('listening at port 5005');
});
