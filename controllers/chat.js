var routeMiddleware = require('../middleware/routeHelpers');

app.get('/chat', routeMiddleware.ensureLoggedIn, function(req, res) {
  res.render('chat/chat');
});
