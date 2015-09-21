var routeMiddleware = require('../middleware/routeHelpers');

app.get('/', routeMiddleware.ensureLoggedIn, function(req, res) {
  // res.render('index')
});

require('./users');

app.get('*', function(req, res) {
  res.send('page not found');
});