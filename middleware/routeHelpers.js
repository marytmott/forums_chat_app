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

  },
  preventSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/');
    } else {
      return next();
    }
  }
};

module.exports = routeHelpers;