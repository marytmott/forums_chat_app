var routeMiddleware = require('../middleware/routeHelpers');

app.get('/', routeMiddleware.ensureLoggedIn, function(req, res) {
  //if logged in, redirect to main site, otherwise, middleware will direct to login page
  res.render('index', {docTitle: 'Enter'});
});

require('./users');

app.get('*', function(req, res) {
  res.send('page not found');
});