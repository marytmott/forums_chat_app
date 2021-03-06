$(function() {
  //this needs to get DRYed up and refactored!!!

  var socket = io();
  var username = $('#username').val();

  function autoScrollBottom() {
    //have to scroll something that is scrollable; form fixed to bottom is not scrollable
    var $body = $('body');
    $body.scrollTop($body[0].scrollHeight);
  }


  socket.emit('username', username);

  //user joins chat
  socket.on('chatUsers', function(chatUsers) {
    // console.log(chatUsers);
    var chatters = chatUsers[0];
    chatUsers.forEach(function(username) {
      if (username !== chatUsers[0]){
        chatters += ', ' + username;
      }
    });
    $('#chatters').html(chatters);
  });
  socket.on('username', function(username) {
    var userJoined = username + ' joined chat.';
    $('#chat').append($('<li>').text(userJoined));
    autoScrollBottom();
  });

  //user sends message
  $('form').submit(function() {
    var userMsg = username + ': ' + $('#m').val()
    socket.emit('message', userMsg);
    $('#m').val('');
    return false;
  });
  socket.on('message', function(msg) {
    $('#chat').append($('<li>').text(msg));
    autoScrollBottom();
  });

  //user leaves chat
  socket.on('user left', function(username) {
    var userLeft = username + ' left chat.';
    $('#chat').append($('<li>').text(userLeft));
    autoScrollBottom();
  });
  socket.on('disconnected', function(chatUsers) {
    console.log(chatUsers);
    var chatters = chatUsers[0];
    chatUsers.forEach(function(username) {
      if (username !== chatUsers[0]){
        chatters += ',' + username;
      }
    });
    $('#chatters').html(chatters);
    autoScrollBottom();
  });
});
