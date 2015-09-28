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

var clients = [];

io.sockets.on('connect', function(client) {
    clients.push(client);
    console.log(clients);
    client.on('disconnect', function() {
        clients.splice(clients.indexOf(client), 1);
    });
});

io.on('connection', function(socket) {
  console.log("CONNECTED!")

  socket.on('chat message', function(msg){
    console.log();
    // var completeMsg = res.locals.thisUser.username + ': ' + 'chat message';
    io.emit('chat message', msg);
   });
});


server.listen('3000', function() {
  console.log('forums online on port 3000');
});

