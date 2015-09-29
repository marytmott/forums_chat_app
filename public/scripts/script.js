$(function() {

  function openChat(e) {
    e.preventDefault();
    var windowObjectReference = window.open('/chat', 'Forum Chat', 'width=550, height=550, resizable=yes');
  }

  $('a[href="/chat"').on('click', openChat);
});