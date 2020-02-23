var mongoose = require('mongoose');
var common = require('../common')

const { Schema } = mongoose;
const UserSchema = new Schema({
    Email: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        unique: true
    },
    Password: {
        type: String,
        require: true
    },
    IsActive: Number
});

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
    var user = this;

    user.Password = common.encryptPassword(user.Password);
    next();

});

UserSchema.statics.authenticate = function (req, res, callback) {
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({ UserName: username })
        .exec(function (err, user) {
            if (err) {
                return callback(err);
            } else if (!user) {
                err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            } else if (user.Password === common.encryptPassword(password)) {
                    return callback(null, user);
                } else {
                    return callback();
                }
        });
}
var User = mongoose.model('User', UserSchema, 'User');
module.exports = User;