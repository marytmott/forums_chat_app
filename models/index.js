var mongoose = require('mongoose');
var db = mongoose.connection;

mongoose.connect(process.env.MONGOLAB_URI ||'mongodb://localhost/forums_chat_app');
mongoose.set('debug', true);
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('connected to forums db');
});

module.exports.Forum = require('./forum');
module.exports.User = require('./user');
module.exports.Post = require('./post');
module.exports.Comment = require('./comment');