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
  lastActivity: Date, //last comment on post
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
  post.lastUpdate = now;
  post.lastActivity = now;
  //link up all the records
  db.Forum.findById(post.forum, function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      db.User.findById(post.user, function(err, user) {
        if (err) {
          console.log(err);
        } else {
          // post.lastActivityUser = user.username; // don't do this or it will override comment post/put
          forum.lastActivity = now;
          // forum.lastActivityUser = user.username; // don't do this or it will override comment post/put
          forum.save(function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  });
  next();
});

postSchema.pre('remove', function(next) {
  var post = this;
  //delete reference to this post in forum
  db.Forum.findByIdAndUpdate(post.forum, {$pull: {posts: post._id}}).exec(function(err, forum) {
    if (err) {
      console.log(err);
    } else {
      console.log(forum);
      console.log('DELETED ' + post.title + ' REFERENCE FROM ' + forum.name);
    }
  });
  //delete reference to this post in user
  db.User.findByIdAndUpdate(post.user, {$pull: {posts: post._id}}).exec(function(err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log(user);
      console.log('DELETED ' + post.title + ' REFERENCE FROM ' + user.username);
    }
  });
  //delete all comments
  db.Comment.remove({post: this._id}, function(err, comments) {
    if (err) {
      console.log(err);
    } else {
      console.log(comments);
      console.log('DELETED POST COMMENTS');
    }
  });
  next();
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post;