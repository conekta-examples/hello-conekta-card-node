var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// body parser setup
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Routes
app.get('/', function(req, res) {
  res.render('index');
});

app.post('/checkouts/charge', function(req, res) {
  var keys = require('./keys.json'),
    conekta = require('conekta');
  conekta.api_key = keys.private_key;
  conekta.Charge.create(req.body, function(charge) {
    res.render('charge', {
      charge: charge.toObject()
    });
  }, function(err) {
    res.render('charge', {
      charge: err
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(7000);

module.exports = app;
