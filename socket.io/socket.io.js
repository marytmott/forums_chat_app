var http = require('http').Server(app);
var io = require('socket.io')(http);

//handle socket.io in a separate middleware file?
io.on('connection', function(socket) {
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

//io.emit('some event', { for: 'everyone' });