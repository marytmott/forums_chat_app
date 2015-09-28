var db = require('../models');

var loginHelpers = function(req, res, next) {
  req.login = function(user) {
    req.session.id = user._id;
  };

  req.logout = function() {
    req.session.id = null;
  };

  if (req.session.id) {
    db.User.findById(req.session.id, function(err, user) {
      if (err) {
        console.log(err);
      } else {
        res.locals.thisUser = user;
        // console.log('****LOCAL', res.locals.thisUser.username);
        next();
      }
    });
  } else {
    res.locals.thisUser = null;
    console.log('****LOCAL', res.locals.thisUser);
    next();
  }
};

module.exports = loginHelpers;