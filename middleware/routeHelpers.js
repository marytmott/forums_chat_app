var db = require('.../models');

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    //if user is logged in
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    } else {
      res.redirect('/login');
    }
  }
};

module.exports = routeHelpers;