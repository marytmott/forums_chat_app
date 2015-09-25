var mongoose = require('mongoose');
var User = require('./user');
var Post = require('./post');
var db = require('./index');

var forumSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 100,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastActivity: Date,
  lastActivityUser: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

forumSchema.pre('remove', function(next) {
  //delete all posts
  db.Post.remove({forum: this._id}, function(err, posts) {
    if (err) {
      console.log(err);
    } else {
      console.log(posts);
      console.log('DELETED POSTS FROM FORUM');
    }
  });
  //need to delete all comments too
  next();
});

var Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;