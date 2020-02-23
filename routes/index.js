var express = require('express');
var router = express.Router();
var cartoon= require('../model/cartoon');

var config = require('../config.json');
var perpage=config.perPage;
/* GET home page. */
router.get('/:page?', function(req, res, next) {
  var p= req.params.page||1;
  cartoon
    .find({ IsFeatured: 1, InsertedDate: { $lt: new Date() } })
    .sort({ InsertedDate: -1 })
    .skip((perpage*p)-perpage)
    .limit(perpage)
    .then(data => {
      cartoon.countDocuments({}).then(count=>{
      res.render('index', { title: 'homepage',data:data,pages:Math.ceil(count/perpage),current:p });
      });
    })
    .catch(err => {
      res.json({ result: false, message: err.message });
    });
});
router.post('/', function(req, res, next) {
  var p= req.params.page||1;
  cartoon
    .find({ IsFeatured: 1, InsertedDate: { $lt: new Date() } })
    .sort({ InsertedDate: -1 })
    .skip((perpage*p)-perpage)
    .limit(perpage)
    .then(data => {
      cartoon.countDocuments({}).then(count=>{
      res.json({ data:data,pages:Math.ceil(count/perpage),current:p });
      });
    })
    .catch(err => {
      res.json({ result: false, message: err.message });
    });
});
router.post('/search/',(req,res)=>{
  var author= req.body.author;
  var publication=req.body.publication;
  var caption=req.body.caption;
  var tags= req.body.tags;
  if(author!=''&& publication!='' && caption!='' && tags!=''){
    cartoon.find({$and:[{Author:new RegExp(author)},{Publication:new RegExp(publication)},{Caption:new RegExp(caption)},{Tags:new RegExp(tags)}]})
    .sort({$natural:-1})
    .limit(perpage)
    .then(data=>{
        res.json({result:true,data:data,pages:'' });
    }).catch(err=>{
      res.json({result:false,data:err.message});
    });    
  }else if(tags==""&& author=='' && publication==''){
      cartoon.find({Caption:new RegExp(caption)})
      .sort({$natural:-1})
      .limit(perpage)
      .then(data=>{
          res.json({result:true,data:data,pages:'' });
      }).catch(err=>{
        res.json({result:false,data:err.message});
      });
    }else if(author==''&& publication==''){
      cartoon.find({$and:[{Caption:new RegExp(caption)},{Tags:new RegExp(tags)}]})
      .sort({$natural:-1})
      .limit(perpage)
      .then(data=>{
          res.json({result:true,data:data,pages:'' });
      }).catch(err=>{
        res.json({result:false,data:err.message});
      });
    }

});
router.post('/update/',(req,res)=>{

});

module.exports = router;
