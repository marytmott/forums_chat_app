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
//need to dry this up or try some redirect thing
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
                  forum.save(function(err, forum) {
                    if (err) {
                      console.log(err);
                    } else {
                      res.redirect('/forums/' + forum.name + '/' + post._id);
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
  db.Forum.findOne(req.params.forum_name, function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      res.render('posts/new_post', {docTitle: 'Create a New Post', forum: forum});
    }
  });
});

//create new post
// app.post('/forums/:forum_name/posts', routeMiddleware.ensureLoggedIn, function(req, res) {
//   ///this is where we start getting fancy
//   db.Post.create(req.body.post, function(err, post) {
//     if (err) {
//       console.log(err);
//     } else {
//       db.User.findById(req.body.post.user, function(err, user) {
//         if (err) {
//           console.log(err);
//         } else {
//           user.posts.push(post);
//           user.save(function(err, user) {
//             if (err) {
//               console.log(err);
//             } else {
//               db.Forum.findById(req.body.post.forum, function(err, forum) {
//                 if (err) {
//                   console.log(err);
//                 } else {
//                   forum.posts.push(post);
//                   forum.save(function(err, forum) {
//                     if (err) {
//                       console.log(err);
//                     } else {
//                       res.redirect('/forums/' + forum.name + '/' + post._id);
//                     }
//                   });
//                 }
//               });
//             }
//           });
//         }
//       });
//     }
//   });
// });

//get a post (and its comments)
app.get('/forums/:forum_name/:post_id', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Post.find({}).populate('user comments').exec(function(err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render('posts/post', {docTitle: post.title, post: post});
    }
  });
});