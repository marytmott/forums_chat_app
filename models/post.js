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
  lastActivity: Date,
  lastActivityUser: String,
  forum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum'
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

postSchema.pre('save', function(next) {
  //update lastUpdate and lastActivity
  var now = new Date();
  var post = this;
  this.lastUpdate = now;
  this.lastActivity = now;
  //update forum's lastActivity
  db.Forum.findByIdAndUpdate(post.forum, {lastActivity: now, lastActivityUser: this.user}, function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      console.log('UPDATED POST LAST ACTIVITY REFERENCE IN FORUM');
    }
  });
  next();
});

postSchema.pre('remove', function(next) {
  var post = this;
  //delete reference to this post in forum
  db.Forum.findByIdAndUpdate(post.user, {$pull: {posts: post._id}}, function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      console.log('DELETED POST REFERENCE FROM FORUM');
    }
  });
  //delete reference to this post in user
  db.User.findByIdAndUpdate(post.user, {$pull: {posts: post._id}}, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log('DELETED POST REFERENCE FROM USER');
    }
  });
  //delete all comments
  db.Comment.remove({post: this._id}, function(err, comment) {
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