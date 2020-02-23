var express = require('express');
var router = express.Router();
const path = require('path');
var fse = require('fs-extra');

const Cartoon = require('../model/cartoon');
const Setting = require('../model/setting');

const config = require('../config.json');
var multer = require('multer');

router.get('/:id?', function(req, res, next) {
  if(req.params.id){
    Cartoon.findOne({_id:req.params.id})
    .then(data=>{
     
      Setting.find({},{"Name":1,"Type":1}).then(sdata=>{
      
        res.render('cartoon',{title:'cartoon uploads',data:data,sdata:sdata});
  
      });
    }).catch(err=>{
      res.json({result:false,message:err.message});
    });
  }else{
    Setting.find({},{"Name":1,"Type":1}).then(sdata=>{
      
      res.render('cartoon',{title:'cartoon uploads',sdata:sdata});

    });
  }
});



  const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var d1 = new Date();
    var y = d1.getFullYear();
    var m = d1.getMonth() + 1;
    var d = d1.getDate();
    // var des= './public/uploads/'+y+'/'+m+'/'+d;
    var des = `./public/uploads/${y}/${m}/${d}/`;
    fse.ensureDirSync(des);
    cb(null, des);
},
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  }
});



const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('cimage');

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error! Images Only');
  }
}

router.post('/', (req, res) => {
  upload(req, res, err => {

    if (err) {
      Setting.find({},{"Name":1,"Type":1}).then(sdata=>{
        res.render('cartoon',{msg:err,sdata:sdata});
      });
    } else {
      if(req.body.id!=""){
        var data = req.body;
        var d1 = new Date();
        var y = d1.getFullYear();
        var m = d1.getMonth() + 1;
        var d = d1.getDate();
        var hr = d1.getHours();
        var mi = d1.getMinutes();
        var se = d1.getSeconds();

        var date = y + '/' + m + '/' + d;
        var time= hr+':'+mi+':'+se;
        if(req.file==undefined){
          Cartoon.updateOne({_id:req.body.id},
            {$set:{
              Caption: req.body.Caption,
              Tags: req.body.Tags,
              Author:req.body.Author,
              Publication:req.body.Publication,
              InsertedDate: d1,
              InsertedDT: date,
              InsertedTime:time,
              PublishedDate:req.body.PublishedDate,
              Details: req.body.Details}},
              (err,result)=>{
                if(result!=null){
              res.redirect('/index');
                }
              });
        }else{
        var fi= '/uploads/'+y+'/'+m+'/'+d+'/'+req.file.filename;
          Cartoon.updateOne({_id:req.body.id},
            {$set:{Image: fi,
              Caption: req.body.Caption,
              Tags: req.body.Tags,
              Author:req.body.Author,
              Publication:req.body.Publication,
              InsertedDate: d1,
              InsertedDT: date,
              InsertedTime:time,
              PublishedDate:req.body.PublishedDate,
              Details: req.body.Details}},
              (err,result)=>{
                if(result!=null){
              res.redirect('/index');
                }
              });
        }
      
      }else{
        if (req.file == undefined) {
          Setting.find({},{"Name":1,"Type":1}).then(sdata=>{
            res.render('cartoon',{msg:'error! no image selected',sdata:sdata});
          });
        }else{
            var data = req.body;
            var d1 = new Date();
            var y = d1.getFullYear();
            var m = d1.getMonth() + 1;
            var d = d1.getDate();
            var date = y + '/' + m + '/' + d;
            var fi= '/uploads/'+y+'/'+m+'/'+d+'/'+req.file.filename;
            var cartoon = new Cartoon({
              Image: fi,
              Caption: req.body.Caption,
              Tags: req.body.Tags,
              Author:req.body.Author,
              Publication:req.body.Publication,
              InsertedDate: d1,
              InsertedDT: date,
              InsertedTime:time,
              PublishedDate:req.body.PublishedDate,
              Details: req.body.Details,
              IsFeatured: 1
            });
            cartoon
              .save()
              .then(result => {
                res.redirect('/index');
              })
              .catch(err => {
                res.render('cartoon',{msg:'error! failed to insert data'});
    
               });
          }
      }
  
        
      }
    
  });
});

module.exports = router;
