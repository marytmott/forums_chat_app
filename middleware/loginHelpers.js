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
        res.locals.user = user.username;
        console.log('****LOCAL', res.locals.user);
      }
    });
  } else {
    res.locals.user = null;
    console.log('****LOCAL', res.locals.user);
  }

  next();
};

module.exports = loginHelpers;