var db = require('../models');

var routeHelpers = {
  //this is take care of on res.locals
  ensureLoggedIn: function(req, res, next) {
    //if user is logged in
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    } else {
      res.redirect('/login');
    }
  },
  ensureCorrectUser: function(req, res, next) {
    db.User.findOne({username: req.params.username}, function(err, user) {
      // console.log('++++', typeof user._id);
      if (err) {
        console.log(err);
      } else if (user._id == req.session.id) {
        return next();
      } else {
        res.redirect('/users/' + req.params.username);
      }
    });
  },
  preventSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/');
    } else {
      return next();
    }
  },
  //function to see if user actually edited anything
  emptyBody: function(reqSpec) {
    console.log('HERE', reqSpec);
    for (var property in reqSpec) {
      if (reqSpec[property]) {
        return true;
      } else {
        return false;
      }
    }
  }
};

module.exports = routeHelpers;