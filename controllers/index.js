var routeMiddleware = require('../middleware/routeHelpers');

app.get('/', routeMiddleware.ensureLoggedIn, function(req, res) {
  //if logged in, redirect to main site, otherwise, middleware will direct to login page
  console.log(res.locals.user);
  res.render('index', {docTitle: 'Enter'});
});

require('./users');
require('./forums');
//load posts after forums because of /forums/:forum_name/edit vs. forums/:forum_name/:post_name
require('./posts');


app.get('*', function(req, res) {
  res.send('page not found');
});