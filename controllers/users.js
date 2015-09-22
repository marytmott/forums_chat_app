var db = require('../models/index');
var routeMiddleware = require('../middleware/routeHelpers');

//new user form
app.get('/signup', routeMiddleware.preventSignup, function(req, res) {
  res.render('users/signup', {docTitle: 'Sign Up'});
});

//create new user
app.post('/signup', function(req, res) {
  db.User.create(req.body.user, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      req.login(user);
      res.redirect('/');
    }
  });
});

//user login page
app.get('/login', function(req, res) {
  res.render('users/login');
});

//log user in
app.post('/login', function(req, res) {
  db.User.authenticate(req.body.user, function(err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect('/');
    } else {
      console.log(err);
      res.redirect('/login');
    }
  });
});

//log user out
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});