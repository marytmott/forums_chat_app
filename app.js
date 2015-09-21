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
app.register


// express
// body parser
// cookie session
// bcrypt
// ejs
// method override
// mongoose
// request?
// favicon?

//middlewares

// npm install --save