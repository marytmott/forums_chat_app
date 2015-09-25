var db = require('../models');
var routeMiddleware = require('../middleware/routeHelpers');

//routeMiddleware.ensureLoggedIn everywhere!

//post a new comment
app.post('/forums/:forum_name/:post_name/comments', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Comment.create(req.body.comment, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      db.User.findById(comment.user, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          user.comments.push(comment);
          user.save(function(err, user) {
            if (err) {
              console.log(err);
            } else {
              db.Post.findById(comment.post, function(err, post) {
                if (err) {
                  console.log(err);
                } else {
                  post.comments.push(comment);
                  post.lastActivityUser = user.username;
                  post.save(function(err, post) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect('/forums/' + req.params.forum_name + '/' + req.params.post_name);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

//form to edit comment
app.get('/forums/:forum_name/:post_name/comments/:comment_id/edit', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureUserComment, function(req, res) {
  db.Comment.findById(req.params.comment_id).populate('user post').exec(function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/edit_comment', {docTitle: 'Edit your comment', comment: comment, forumName: req.params.forum_name});
    }
  });
});

//edit comment
app.put('/forums/:forum_name/:post_name/comments/:comment_id', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureUserComment, function(req, res) {
  db.Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      comment.save();
      res.redirect('/forums/' + req.params.forum_name + '/' + req.params.post_name);
    }
  });
});

//delete
app.delete('/forums/:forum_name/:post_name/comments/:comment_id', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureUserComment, function(req, res) {
  db.Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      comment.remove();
      res.redirect('/forums/' + req.params.forum_name + '/' + req.params.post_name);
    }
  });
});