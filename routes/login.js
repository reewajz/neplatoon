var express = require('express');
var router = express.Router();

var User = require('../model/User');

router.get('/', function (req, res, next) {
  res.render('login', { title: '', layout: 'unauthorized' });
});

router.post('/', (req, res, next) => {
  User.authenticate(req, res, function (error, user) {
    if (error || !user) {
      var err = 'Wrong email or password.';
      res.render('login', { errMessage: err, layout: 'unauthorized' });
    } else {
      req.session.userId = user._id;
      res.redirect('/notification/sendnotification');
    }
  });
});

router.get('/logout', function (req, res, next) {
  if (req.session) {
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/notification');
      }
    });
  }
});

module.exports = router;
