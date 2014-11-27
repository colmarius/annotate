var express = require('express');
var app = module.exports = express();
var configure = require('./config/env');
var mongoose = require('mongoose');
var Comment = require('./models/comment');

configure(app);

var server = require('http').createServer(app);

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/it', function(req, res) {
  res.send('Ciao Mondo');
});

app.get('/db', function(req, res) {
  res.status((mongoose.connection.readyState === 1) ? 200 : 503).send();
});

app.get('/:domain/:reference/comments', function(req, res) {
  Comment.find(
    {
      domain: req.param('domain'),
      reference: req.param('reference')
    },
    function(err, comments) {
      if (err)
        res.status(500).send();
      else
        res.status(200).json(comments);
    }
  );
});

app.use(express.static(__dirname +
  (process.env.NODE_ENV === 'dist' ? '/../client-dist' : '/../client')
));


if (require.main === module) {
  mongoose.connect(app.get('db'), function() {
    server.listen(app.get('port'), function() {
      console.log('Listening on port %d', app.get('port'));
    });
  });
}
