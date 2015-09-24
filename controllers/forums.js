var db = require('../models');
var routeMiddleware = require('../middleware/routeHelpers');

//routeMiddleware.ensureLoggedIn everywhere!

//get all forums
app.get('/forums', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Forum.find({}, function(err, forums) {
    if (err) {
      console.log(err);
      // res.redirect('/');
    } else {
      res.render('forums/forums', {docTitle: 'Forums Listing', forums: forums});
    }
  })
});

//create a new forum
app.post('/forums', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Forum.create(req.body.forum, function(err, forum) {
    if (err) {
      console.log(err);
      // res.redirect('/forums/new');
    } else {
      console.log(forum);
      res.redirect('/forums/' + forum.name);
    }
  });
});

//form for new forum
app.get('/forums/new', routeMiddleware.ensureLoggedIn, function(req, res) {
  res.render('forums/new_forum', {docTitle: 'Create New Forum'});
});

app.get('/forums/:forum_name', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Forum.findOne({name: req.params.forum_name}).populate('posts').exec(function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      // console.log(forum);
      res.render('forums/forum', {docTitle: forum.name, forum: forum});
    }
   });
});

//rename a forum
app.put('/forums/:forum_name', routeMiddleware.ensureLoggedIn, function(req, res) {
  var edited = routeMiddleware.emptyBody(req.body.forum);
  if (edited) {
    db.Forum.findOne({name: req.params.forum_name}, function(err, forum) {
      if (err) {
        console.log(err);
      } else {
        forum.name = req.body.forum.name;
        forum.save(function(err, updatedForum) {
          if (err) {
            console.log(err);
          } else {
            res.redirect('/forums/' + updatedForum.name);
          }
        });
      }
    });
  } else {
    res.redirect('/forums/' + req.params.forum_name);
  }
});

//delete a forum
app.delete('/forums/:forum_name', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Forum.findOne({name: req.params.forum_name}, function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      forum.remove();
      res.redirect('/forums');
    }
  });
});

//form to rename a forum
app.get('/forums/:forum_name/edit', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Forum.findOne({name: req.params.forum_name}, function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      res.render('forums/edit_forum', {docTitle: 'Edit ' + forum.name, forum: forum});
    }
  });
});

// //form to make a new post
// app.get('/forums/:forum_name/posts/new', routeMiddleware.ensureLoggedIn, function(req, res) {
//   res.render('posts/new_post', {docTitle: 'Create a New Post', forumName: req.params.forum_name});
// });

// //alternate form to make a new post
// app.get('/posts/new', routeMiddleware.ensureLoggedIn, function(req, res) {
//   db.Forum.find({}, function(err, forums) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render('posts/new_post_select_forum', {docTitle: 'Create a New Post', forums: forums});
//     }
//   });
// });