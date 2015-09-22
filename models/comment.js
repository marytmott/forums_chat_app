var mongoose = require('mongoose');
var User = require('./user');
var Post = require('./post');
var db = require('./index');

var commentSchema = mongoose.Schema({
  content: {
    type: String,
    maxlength: 275,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastUpdate: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }
});

commentSchema.pre('save', function(next) {
  //update lastUpdate
  var now = new Date();
  var comment = this;
  this.lastUpdate = now;
  //update forum's lastActivity
  db.Post.findById(this.post).populate('post').exec(function(err, post) {
    if (err) {
      console.log(err);
    } else {
      db.Forum.findByIdAndUpdate(post.forum, {lastActivity: now}, function(err, forum) {
        if (err) {
          console.log(err);
        } else {
          console.log('UPDATED POST LAST ACTIVITY REFERENCE IN FORUM');
        }
      });
    }
  });
  next();
});

commentSchema.pre('remove', function(next) {
  //delete reference to this comment in user
  var comment = this;
  db.User.findByIdAndUpdate(comment.user, {$pull: {comments: comment._id}}, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      console.log('DELETED COMMENT REFERENCE FROM USER');
    }
  });
  //delete reference to this comment in post
  db.Post.findByIdAndUpdate(comment.user, {$pull: {comments: comment._id}}, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      console.log('DELETED COMMENT REFERENCE FROM POST');
    }
  });
  next();
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;