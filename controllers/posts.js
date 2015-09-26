var db = require('../models');
var routeMiddleware = require('../middleware/routeHelpers');

//routeMiddleware.ensureLoggedIn everywhere!

//alternate form to make a new post
app.get('/posts/new', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Forum.find({}, function(err, forums) {
    if (err) {
      console.log(err);
    } else {
      res.render('posts/new_post_select_forum', {docTitle: 'Create a New Post', forums: forums});
    }
  });
});

//create new post from general
app.post('/posts', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Post.create(req.body.post, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      db.User.findById(req.body.post.user, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          user.posts.push(post);
          user.save(function(err, user) {
            if (err) {
              console.log(err);
            } else {
              db.Forum.findById(req.body.post.forum, function(err, forum) {
                if (err) {
                  console.log(err);
                } else {
                  forum.posts.push(post);
                  forum.lastActivityUser = res.locals.thisUser.username;
                  forum.save(function(err, forum) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect('/forums/' + forum.name + '/' + post.title);
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

//form to make a new post
app.get('/forums/:forum_name/posts/new', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Forum.findOne({name: req.params.forum_name}, function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      res.render('posts/new_post', {docTitle: 'Create a New Post', forum: forum});
    }
  });
});


//get a post (and its comments)
app.get('/forums/:forum_name/:post_title', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Post.findOne({title: req.params.post_title}).populate('forum user comments').exec(function(err, post) {
    // console.log(post);
    if (err) {
      console.log(err);
    } else {
      db.Comment.find({post: post._id}).populate('user').exec(function(err, comments) {
        if (err) {
          console.log(err);
        } else {
          res.render('posts/post', {docTitle: post.title, post: post, comments: comments});
        }
      });
    }
  });
});

//edit post
app.put('/forums/:forum_name/:post_title', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureUserPost, function(req, res) {
  db.Post.findOneAndUpdate({title: req.params.post_title}, req.body.post, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      post.save(function(err, post) {
        if (err) {
          console.log(err);
        } else {
          //update Forum activity
          db.Forum.findById(post.forum, function(err, forum) {
            if (err) {
              console.log(err);
            } else {
              forum.lastActivityUser = res.locals.thisUser.username;
              forum.save(function(err) {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect('/forums/:forum_name/:post_title');
                }
              });
            }
          });
        }
      });
    }
  });
});

//delete post
app.delete('/forums/:forum_name/:post_title', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureUserPost, function(req, res) {
  db.Post.findOne({title: req.params.post_title}, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      post.remove();
      res.redirect('/forums/' + req.params.forum_name);
    }
  });
});

//get post to edit
app.get('/forums/:forum_name/:post_title/edit', routeMiddleware.ensureLoggedIn, routeMiddleware.ensureUserPost, function(req, res) {
  db.Post.findOne({title: req.params.post_title}).populate('forum user').exec(function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render('posts/edit_post', {docTitle: post.title, post: post});
    }
  });
});



