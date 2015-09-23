var db = require('../models');
var routeMiddleware = require('../middleware/routeHelpers');

//ensure logged in everywhere!

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

app.put('/forums/:forum_name', routeMiddleware.ensureLoggedIn, function(req, res) {

  console.log(req.body.forum);
  if (req.body.forum) {
    db.Forum.update({name: req.params.forum_name}, req.body.forum, function(err, forum) {
      // console.log(forum);
      if (err) {
        console.log(err);
      } else {
        res.redirect('/forums/' + forum.name);
      }
    });
  } else {
    res.redirect('/forums/' + req.params.forum_name);
  }
});

// app.delete();

app.get('/forums/:forum_name/modify', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Forum.findOne({name: req.params.forum_name}, function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      res.render('forums/modify_forum', {docTitle: 'Modify' + forum.name, forum: forum});
    }
  });
});