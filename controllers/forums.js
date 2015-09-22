var db = require('../models');
var routeMiddleware = require('../middleware/routeHelpers');

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

app.get('/forums/:forum_name', function(req, res) {
  db.Forum.findOne({name: req.params.forum_name}).populate('posts').exec(function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      res.render('forums/forum', {docTitle: forum.name, forum: forum});
    }
   });
});