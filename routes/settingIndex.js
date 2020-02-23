var express = require('express');
var router = express.Router();
var Setting= require('../model/setting');

var config = require('../config.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  Setting
    .find({  })
    .sort({ Name: 1 })
    .then(data => {
      Setting.countDocuments({}).then(count=>{
      res.render('settingIndex', { title: 'homepage',data:data,count:count });
      });
    })
    .catch(err => {
      res.json({ result: false, message: err.message });
    });
});


module.exports = router;
