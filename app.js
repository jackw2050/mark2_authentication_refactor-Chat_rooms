var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var configDB = require('./config/database.js');
var flash = require('connect-flash');
var routes = require('./routes/index');
var app = express();

//------ Chat ---------
var http = require('http').Server(app);// Set http as an express server
var io = require('socket.io')(http);// Set io as a http socket

app.use(express.static(__dirname + '/public'));
//------ Chat ---------



var app = express();

mongoose.connect(configDB.url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//other config
app.use(flash());
app.use(session({secret: 'thepurpleelephantridesatmidnight'}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//routes
require('./routes/index.js')(app, passport);

//Socket.io


io.on('connection', function (socket) {
  console.log('User connected via socket.io!');



// Execute when a new user joins a room ==> Need other function to limit rooms etc.
  socket.on('joinRoom', function (req) {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    socket.broadcast.to(req.room).emit('message', {
      name: 'System',
      text: req.name + ' has joined!',
      timestamp: moment().valueOf()
    });
  });





// Execute then a message is sent
  socket.on('message', function (message) {
    console.log('Message received: ' + message.text);   // remove for prodution

    message.timestamp = moment().valueOf();
    io.to(clientInfo[socket.id].room).emit('message', message);
  });

  // timestamp property - JavaScript timestamp (milliseconds)

  socket.emit('message', {
    name: 'System',
    text: 'Welcome to the chat application!',
    timestamp: moment().valueOf()
  });
});

//end Socket.io


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

console.log('App running on port 3000');


module.exports = app;
