var mongoose= require('mongoose');
var Schema=mongoose.Schema;

var SettingSchema= new Schema({
    Name:String,
    Type:{
        type:String,
        // required:true
    },
    Email:String,
    Address:String,
    Phone:String
});

var Setting= mongoose.model('Setting',SettingSchema,'Setting');
module.exports= Setting;
