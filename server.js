// server.js

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.set('debug', true);
mongoose.connect('mongodb://nodesample:qweQWE123@ds053194.mongolab.com:53194/nodesample');
mongoose.connection.on('error', function(err){ console.log(err); });

var Bear = require('./app/model/bear');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
  console.log("Stuck in the middle with you!");
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'Welcome to our API'});
});

router.route('/bears')

  .post(function(req, res) {

    var bear = new Bear();      // create a new instance of the Bear model
    bear.name = req.body.name;  // set the bears name (comes from the request)

    // save the bear and check for errors
    bear.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Bear created!' });
    });
  })

  .get(function(req, res) {
    Bear.find(function(err, bears) {
      if(err)
        res.send(err);

      res.json(bears);
    });
  });

router.route('/bears/:bear_id')

  .get(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if(err)
        res.send(err);

      res.json(bear);
    });
  })

  .put(function(req, res) {
    Bear.findById(req.params.bear_id, function(err, bear) {
      if(err)
        res.send(err);

      bear.name = req.body.name;

      bear.save(function(err) {
        if(err)
          res.send(err);

        res.json({message: "Bear Updated"});
      });
    });
  })

  .delete(function(req, res) {
    Bear.remove({
      _id: req.params.bear_id
    }, function(err, bear) {
      if(err)
        res.send(err);

      res.json({message: 'Bear Deleted'});
    });
  });

app.use('/api', router);

app.listen(port);
console.log("The Magic is happening on port " + port);
