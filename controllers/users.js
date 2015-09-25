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

//ensure logged in for all routes below

//get all users
app.get('/users', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.User.find({}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('users/users', {docTitle: 'All Users', users: users});
    }
  });
});

//get specific user
app.get('/users/:username', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.User.findOne({username: req.params.username}).populate('posts').exec(function(err, user) {
    if (err) {
      console.log(err);
    } else {
      db.Post.find({user: user._id}).populate('forum').exec(function(err, posts) {
        if (err) {
          console.log(err);
        } else {
          res.render('users/user', {docTitle: user.username + '\'s Profile', user: user, posts: posts});
        }
      });
    }
  });
});


//edit user's profile
app.put('/users/:username', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectUser, function(req, res) {
  var edited = routeMiddleware.emptyBody(req.body.user);
  //if user filled out form, update their record
  if (edited) {
    db.User.findOne({username: req.params.username}, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        //dry this up in separate function to use across controllers
        //if input, change it; if not, user default
        console.log('LOGGIN', req.body.user.email || user.email);
        user.username = req.body.user.username || user.username;
        user.email = req.body.user.email || user.email;
        //change pw on separate page?
        user.password = req.body.user.password || user.password;
        user.avatar = req.body.user.avatar || user.avatar;
        user.persComment = req.body.user.persComment || user.persComment;
        user.save(function(err, updatedUser) {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/users/' + updatedUser.username);
          }
        });
      }
    });
  } else {
    res.redirect('/users/' + req.params.username);
  }
});

//logout and delete user
app.delete('/users/:username', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectUser, function(req, res) {
  db.User.findOne({username: req.params.username}, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      //delete all user's posts
      db.Post.find({user: user._id}).remove(function(err, posts) {
        if (err) {
          console.log(err);
        } else {
          console.log('DELETED USER POSTS');
          req.logout();
          user.remove();
          res.redirect('/');
        }
      });
    }
  });
});

//form to edit logged-in user
app.get('/users/:username/edit', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureCorrectUser, function(req, res) {
  db.User.findOne({username: req.params.username}, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render('users/edit_user', {docTitle: 'Edit My Profile', user: user});
    }
  });
});