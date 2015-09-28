var express = require('express');
app = express(); //universal variable
var ejs = require('ejs');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('cookie-session');
var loginMiddleware = require('./middleware/loginHelpers');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(session({
  //no maxAge and activeDuration so user can stay logged in for chat and real-time updates
  name: 'forums',
  secret: 'nkj234n@%U(4/y3gtbwr'  //random keyboard mashing
}));
app.use(loginMiddleware);

require('./controllers/index');

var chatUsers = [];

io.on('connection', function(socket) {
  var usernameStorage;
  console.log("CONNECTED!");

  socket.on('username', function(username) {
    usernameStorage = username;
    io.emit('username', username);
    io.emit('chatUsers', chatUsers);
    console.log(usernameStorage);
  });

  socket.on('message', function(msg) {
    console.log();
    io.emit('message', msg);
   });

  socket.on('disconnect', function() {
    var disconnected = chatUsers.indexOf(usernameStorage);
    chatUsers.splice(disconnected, 1);
    io.emit('user left', usernameStorage);
    io.emit('disconnected', chatUsers);
  });
});

server.listen('3000', function() {
  console.log('forums online on port 3000');
});

