$(function() {
  var socket = io();
  $('form').submit(function(){
    var userMsg = $('#username').val() + ': ' + $('#m').val()
    socket.emit('chat message', userMsg);
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
});
