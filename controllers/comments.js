var db = require('../models');
var routeMiddleware = require('../middleware/routeHelpers');

//routeMiddleware.ensureLoggedIn everywhere!

//post a new comment
app.post('forums/:forum_name/:post_name/comments', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Comment.create(req.body.comment, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/forums/' + req.params.forum_name + '/' + req.params.post_name);
    }
  }
});