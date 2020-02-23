var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var db = require('./db');
var path = require('path');
var cartoon = require('./model/cartoon');
var setting = require('./model/setting');
var app = express();
var config = require('./config.json');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup

var config = require('./config.json');
var siteport = config.APIPort;
var pagesize = config.Pagesize;


app.get('/', (req, res) => {
  res.render('index');
})

app.post('/uploads/', (req, res) => {

});

app.get('/latest/:page', (req, res) => {
  var page = req.params.page || 1;
  cartoon
    .find({ IsFeatured: 1, InsertedDate: { $lt: new Date() } })
    .sort({ InsertedDate: -1 })
    .skip(pagesize * page - pagesize)
    .limit(pagesize)
    .then(result => {
      cartoon.countDocuments({}).then(count => {
        var tp = Math.ceil(count / pagesize);
        if (page > tp) {
          res.json({ result: false, message: 'It is the end of the page!' });
        } else {
          res.json({ result: true, data: result });
        }
      });

    })
    .catch(err => {
      res.json({ result: false, message: err.message });
    });
});

app.get('/cartoon/:id', (req, res) => {
  id = req.params.id;
  var d = new Date();
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  var d = d.getDate();
  var date = y + '/' + m + '/' + d;
  cartoon
    .findOne({ IsFeatured: 1, _id: id })
    .then(result => {
      res.json({ result: true, data: result });
    })
    .catch(err => {
      res.json({ result: false, message: err.message });
    });
  cartoon
    .updateOne({ IsFeatured: 1, _id: id }, { $inc: { Hits: 1 } })
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      res.json({ result: false });
    });
});

app.get('/trending/', (req, res) => {
  threeMonths = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  cartoon
    .aggregate([
      {
        $match: { InsertedDate: { $gte: threeMonths }, IsFeatured: 1 }
      },
      {
        $project: {
          InsertedDate: 1,
          Caption: 1,
          Hits: 1,
          hits: {
            $divide: ['$Hits', { $subtract: [new Date(), '$InsertedDate'] }]
          }
        }
      },
      {
        $sort: {
          hits: -1
        }
      },
      {
        $limit: 6
      }
    ])
    .then(result => {
      res.json({ result: true, data: result });
    })
    .catch(err => {
      res.json({ result: false, data: err.message });
    });
});

app.get('/getByDates/:date', (req, res) => {
  let date = req.params.date;
  cartoon.find({ InsertedDate: date }).sort({ $natural: -1 })
    .limit(10)
    .then(result => {
      res.json({ result: true, data: result });
    }).catch(err => {
      res.json({ result: false, data: err.message });
    });

});

app.get('/getByAuthor/:author', (req, res) => {
  let author = req.params.author;
  cartoon.find({ Author: author }).sort({ $natural: -1 })
    .limit(10)
    .then(result => {
      res.json({ result: true, data: result });
    }).catch(err => {
      res.json({ result: false, data: err.message });
    });

});

app.listen(siteport, () => {
  console.log('listening at port ' + siteport);
});

