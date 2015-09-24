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

//form to make a new post
app.get('/forums/:forum_name/posts/new', routeMiddleware.ensureLoggedIn, function(req, res) {
  res.render('posts/new_post', {docTitle: 'Create a New Post', forumName: req.params.forum_name});
});

//create new post
app.post('/forums/:forum_name/posts', routeMiddleware.ensureLoggedIn, function(req, res) {
  ///this is where we start getting fancy
  db.Post.create(req.body.post, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      db.User.findOne({username: res.locals.thisUser.username}, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          //if posting from '/posts/new'
          if (req.body.post.forum) {
            post.forum = req.body.post.forum;
          } else {
            post.forum = req.params.forum_name;
          }
          post.user = user;
          post.save(function(err, updatedPost) {
            if (err) {
              console.log(err);
            } else {
              user.posts.push(post);
              user.save(function(err, updatedUser) {
                if (err) {
                  console.log(err);
                } else {
                  res.redirect('/forums/' + req.params.forum_name + '/' + updatedPost._id);
                }
              });
            }
          });
        }
      });
    }
  });
});

//get a post (and its comments)
app.get('/forums/:forum_name/:post_id', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Post.find({}).populate('user comments').exec(function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render('posts/posts', {docTitle: post.title, post: post});
    }
  });
});