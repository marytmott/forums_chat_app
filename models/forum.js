var mongoose = require('mongoose');
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
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

forumSchema.pre('remove', function(next) {
  //delete all posts
  Post.remove({forum: this._id}, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      console.log('DELETED POST FROM FORUM');
    }
  });
  next();
});

var Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;