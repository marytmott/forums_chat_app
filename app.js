var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('cookie-session');

app = express();

app.set('view-engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(session({
  //no maxAge and activeDuraction so user can stay logged in for chat and real-time updates
  name: 'forums',
  secret: 'nkj234n@%U(4/y3gtbwr'  //random keyboard mashing
}));

app.listen('3000', function() {
  console.log('forums online on port 3000');
});