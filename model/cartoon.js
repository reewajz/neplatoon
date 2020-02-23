var mongoose= require('mongoose');
var Schema= mongoose.Schema;

var cartoonSchema = new Schema({
Image:{type:String},
Caption:{type:String},
Tags:[String],
Author:{type:String},
Publication:{type:String},
InsertedDate:{type:Date},
InsertedDT:{type:String},
IsFeatured:{type:Number},
Details:{type:String},
InsertedTime:{type:String},
Hits:{ type: Number,
    default: 0},
PublishedDate:{type:String}
});

var Cartoon = mongoose.model('Cartoon',cartoonSchema,'Cartoon');
module.exports= Cartoon;