var mongoose = require('mongoose');
var Forum = require('./forum');
var User = require('./user');
var Comment = require('./comment');
var db = require('./index');

var postSchema = mongoose.Schema({
  title: {
    type: String,
    maxlength: 50,
    required: true,
    unique: true
  },
  content: {
    type: String,
    maxlength: 500,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastUpdate: Date,
  forum: {

  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

//update 'lastUpdate' date every time the post is updated
postSchema.pre('save', function(next) {
  now = new Date();
  this.lastUpdate = now;
  next();
});

postSchema.pre('remove', function(next) {
  //delete reference to this post in user
  var post = this;
  db.User.findByIdAndUpdate(post.user, {$pull: {posts: post._id}}, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log('DELETED POST REFERENCE FROM USER');
    }
  });
  //delete all comments
  Comment.remove({post: this._id}, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      console.log('DELETED POST COMMENT');
    }
  });
  next();
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;