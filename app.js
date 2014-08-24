(function() {
  var app, bodyParser, express, handle, port, server;

  express = require('express');

  handle = require('./handle.js');

  bodyParser = require('body-parser');

  app = express();

  port = process.env.PORT || 8000;

  app.set('port', port);

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(express["static"](__dirname + '/public'));

  app.post('/search', function(req, res) {
    console.log('POST /search');
    return handle.processQuery(req, res);
  });

  app.post('/post', function(req, res) {
    console.log('POST /post');
    return handle.postTweet(req, res);
  });

  server = app.listen(port, function() {
    return console.log("Listening on port " + server.address().port);
  });

}).call(this);
