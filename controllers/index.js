var routeMiddleware = require('../middleware/routeHelpers');

app.get('/', routeMiddleware.ensureLoggedIn, function(req, res) {
  //if logged in, redirect, otherwise, display login page

  // res.render('index')
});

require('./users');

app.get('*', function(req, res) {
  res.send('page not found');
});