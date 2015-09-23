var db = require('../models');
var routeMiddleware = require('../middleware/routeHelpers');

//routeMiddleware.ensureLoggedIn everywhere!

//get all posts
app.get('/forums/:forum_name/:post_id', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Post.find({}).populate('user').exec(function(req, res) {
    if (err) {
      console.log(err);
    } else {
      res.render('posts/posts', {docTitle: req.params.})
    }
  });
});