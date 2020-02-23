var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('../config.json');
/* GET users listing. */ 
router.get('/', function (req, res, next) {
    res.render('notification');
});



router.post('/', (req, res) => {
    var serverKey = config.ServerKey;
    var t= req.body.title;
    var m=req.body.message;
    var topics=req.body.topics;
    var n=req.body.notificationId;
    // Token.distinct('DeviceID').then(did=>{
            request({
                url: 'https://fcm.googleapis.com/fcm/send',
                method: 'POST',
                headers: {
                    'Content-Type': ' application/json',
                    'Authorization': 'key=AAAADB-v5hM:APA91bEhYa6ZZnYoQKU06BIK35t0dQEjydssf6fNiml90aO8UJLwdJs7tExVMq04dnhES4uHfUaOqzIZeitDnh_aBIzFWpKNrGwHyU6LCjUOyKkvOe73MmM2KlezcRFiuATwu38xeHWR'
                },
                body: JSON.stringify(
        
                    {
                        "to": "/topics/"+topics,
        
                        "data": {
                            "title":t,
                            "message": m,
                            "soundname": "default",
                            "notId": n,
                            "ledColor": [0, 230, 230, 250],
                            "vibrationPattern": [0, 1000, 500, 0]
        
                        }
                    }
                )
            }, function (error, response, body) {
                if (error) {
                    console.error(error, response, body);
                }
                else if (response.statusCode >= 400) {
                    console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage + '\n' + body);
                }
                else {
                    res.render('notification',{msg:'notificaton has been send!'});
                }
            });

    // }).catch(err=>{
        
    // });
    
    

});
module.exports = router;
