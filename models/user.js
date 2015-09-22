var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var Post = require('./post');
var Comment = require('./comment');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 5,
    maxlength: 20,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  avatar: {
    type: String
    //default pic
    //avatars.io integration
  },
  persComment: {
    type: String,
    maxlength: 50
  },
  created: {
    type: Date,
    default: Date.now
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

userSchema.pre('save', function(next) {
  var user = this; //'this' refers to this instance

  //skip bcrypt if pw is not modified or new
  if (!user.isModified('password')) {
    return next();
  } else {
    //make new salt
    return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) {
        return next(err);
      } else {
        //hash the pw w/ the salt
        return bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) {
            return next(err);
          } else {
            //override the pw w/ the hashed one
            user.password = hash;
            console.log(hash);
            return next();
          }
        });
      }
    });
  }
});

//authenticate user on login (see login middleware)
userSchema.statics.authenticate = function(formData, callback) {
  //'this' refers to the model (User)
  this.findOne({username: formData.username}, function(err, user) {
    if (user === null) {
      callback('Invalid username or password', null);
    } else {
      user.checkPassword(formData.password, callback);
    }
  });
};
//on all instances of user
userSchema.methods.checkPassword = function(password, callback) {
  var user = this;  //result fetched from database
  bcrypt.compare(password, user.password, function(err, isMatch) {
    if (isMatch) {
      callback(null, user);
    } else {
      callback(err, null);
    }
  });
}

///middleware to delete all user's posts when account is deleted
userSchema.pre('remove', function(callback) {
  //delete all user's posts
  Post.remove({user: this._id}, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      console.log('DELETED: ', post);
    }
  });
  //delete all user's comments
  Comment.remove({user: this._id}, function(err, comment) {
    if (err) {
      console.log(err);
    } else {
      console.log('DELETED: ', comment)
    }
  });
  callback();
});

var User = mongoose.model('User', userSchema);

module.exports = User;

