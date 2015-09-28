var express = require('express');
app = express(); //universal variable
var ejs = require('ejs');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('cookie-session');
var loginMiddleware = require('./middleware/loginHelpers');
var server = app.listen(3034);
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

io.on('connection', function(socket) {
  socket.on('chat', function(){
   console.log('what are you doing to my code?');
   });
   io.emit('chat message', msg);
});

app.listen('3000', function() {
  console.log('forums online on port 3000');
});

