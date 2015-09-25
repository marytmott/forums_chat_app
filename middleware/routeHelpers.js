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
  ensureUserPost: function(req, res, next) {
    db.Post.findOne({title: req.params.post_title}, function(err, post) {
      // console.log('++++', typeof user._id);
      if (err) {
        console.log(err);
      } else if (post.user == req.session.id) {
        return next();
      } else {
        res.redirect('/forums/' + req.params.forum_name + '/' + req.params.post_title);
      }
    });
  },
  ensureUserComment: function(req, res, next) {
    db.Comment.findById(req.params.comment_id, function(err, comment) {
      // console.log('++++', typeof user._id);
      console.log(comment);
      if (err) {
        console.log(err);
      } else if (comment.user == req.session.id) {
        return next();
      } else {
        res.redirect('/forums/' + req.params.forum_name + '/' + req.params.post_title);
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
  //need this b/c i'm using placeholders to show values in some places (for style)
  emptyBody: function(reqSpec) {
    console.log('HERE', reqSpec);
    for (var property in reqSpec) {
      if (reqSpec[property]) {
        //as soon as a value is found, will break out of function and return true
        return true;
      } else {
        continue;
      }
    }
    //returns false if all values are empty
    return false;
  }
};

module.exports = routeHelpers;