const express = require('express');
const router = express.Router();
const Setting = require('../model/setting');

router.get('/:id?', function(req, res, next) {
  if(req.params.id){
    Setting.findOne({_id:req.params.id})
    .then(data=>{
      res.render('setting',{data:data});
    }).catch(err=>{
      res.json({result:false, message:err.message});
    })
   }else{
  res.render('setting', { title: 'setting' });
   }
});

router.post('/', (req, res, next) => {
  if(req.body.id!=""){
    Setting.updateOne({_id:req.body.id},
      {$set:{
        Type:req.body.Type,
        Name:req.body.Name,
        Email:req.body.Email,
        Address:req.body.Address,
        Phone:req.body.Phone
      }},(err,result)=>{
        if(result!=null){
          res.redirect('/settingIndex');
        }
      }
      );
  }else{
    Setting.create(req.body)
  .then(result=>{
    res.redirect('/settingIndex');
  })
  .catch(err=>{
    res.render('setting',{msg:'error! failed to insert data'});

  });
  }

  
});

module.exports = router;
