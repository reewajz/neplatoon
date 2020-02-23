var crypto = require('crypto');
var config = require('./config.json');

var securityKey = config.SecretKey;

module.exports = {
    encrypt: function (t) { return encrypt(t); },
    decrypt: function (t) { return decrypt(t); },
    generateToken: function (t) { return generateToken(t); },
    checkToken: function (t) { return checkToken(t); },
    encryptPassword:function(t){return encryptPassword(t);}
};

function encrypt(txt) {
    var e = "AES-256-CBC";
    var s = securityKey;
    var iv = s.substr(0, 16);
    var encryptor = crypto.createCipheriv(e, s, iv);
    return encryptor.update(txt, 'utf8', 'base64') + encryptor.final('base64');
}

function encryptPassword(txt){
  return  crypto.createHash('md5').update(encrypt(txt)).digest('hex');
}

function decrypt(txt) {
    try {
        var e = "AES-256-CBC";
        var s = securityKey;
        var iv = s.substr(0, 16);
        var encryptor = crypto.createDecipheriv(e, s, iv);
        return encryptor.update(txt, 'base64', 'utf8') + encryptor.final('utf8');
    }
    catch (e) {
        return '';
    }
}

function generateToken(txt) {
    var date = new Date();
    var randomNumber = parseInt(Math.random() * 10000000000, 10);
    var plaintext = `${txt}||[]${date.setFullYear(new Date().getFullYear() + 2)}||[]${randomNumber}`;
    return encrypt(plaintext);
}

function checkToken(t) {
    try {
        var str = decrypt(t);
        if (str.length > 10) {
            var arr = str.split('||[]');
            if (arr.length === 3) {
                return {
                    result: true
                };
            }
        } else {
            return {
                result: false,
                message: "Invalid Token"
            };
        }
    }
    catch (e) {
        return {
            result: false
        };
    }
}