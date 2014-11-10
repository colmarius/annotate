var express = require('express');
var app = module.exports = express();
var mongoose = require('mongoose');
var environment = require('./config/env')();
var Comment = require('./models/comment');

app.set('port', environment.port);
app.set('db', environment.db);

app.get('/', function(req, res) {
  res.send('Hello World');
});

app.get('/db', function(req, res) {
  res.send((mongoose.connection.readyState === 1) ? 200 : 503);
});

app.get('/:domain/:reference/comments', function(req, res) {
  Comment.find(
    {domain: req.param('domain'), reference: req.param('reference')},
    function(err, comments) {
      if (err) {
        return res.status(500);
      }
      res.status(200).json(comments);
    }
  );
});

app.post(
  '/:domain/:reference/comments',
  require('body-parser').json(),
  function(req, res) {
    Comment.create(
      { domain: req.param('domain'),
        reference: req.param('reference'),
        email: req.body.email,
        text: req.body.text,
      },
      function(err, comment) {
        if (err) {
          return res.status(500);
        }
        res
          .status(201)
          .location(comment.location())
          .json(comment);
      }
    );
  }
);

app.use(express.static(__dirname +
  (process.env.NODE_ENV === 'dist' ? '/../client-dist' : '/../client')
));


if (require.main === module) {
  mongoose.connect(app.get('db'), function() {
    var server = app.listen(3000, function() {
      console.log('Listening on port %d', server.address().port);
    });
  });
}
