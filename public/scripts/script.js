$(function() {

  function openChat(e) {
    e.preventDefault();
    var windowObjectReference = window.open('/chat', 'Forum Chat', 'width=500, height=600, resizable=yes');
  }

  $('a[href="/chat"').on('click', openChat);
});