
var express=require("express");
var app=express();
var favicon = require('serve-favicon');
var path = require('path');
var logger = require('morgan');
const expressSanitizer=require("express-sanitizer");
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var flash=require("connect-flash");
var passport=require("passport");
var LocalStratergy=require("passport-local");
var methodOverride = require("method-override");
var Campground= require("./models/campground");
var Comment = require("./models/comment");
var User=require("./models/user.js");
var seedDB = require("./views/seeds");
var googleStrategy = require('passport-google-oauth2').Strategy;


var commentRoutes      =  require("./routes/comments"),
	campgroundRoutes   =  require("./routes/campgrounds"),
	indexRoutes        =  require("./routes/index"),
	profileRoutes      =  require("./routes/profile"),
	campRoutes		   =  require("./routes/bucket"),
	essentialRoutes    =  require("./routes/essential")

	

// seedDB();
// mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true});
mongoose.connect("mongodb+srv://Dhruv:HMzzca9MRKlvPDjq@cluster0.w3xzj.mongodb.net/yelp_camp?retryWrites=true&w=majority",{useNewUrlParser:true, useCreateIndex:true})
app.use(expressSanitizer());
app.set("view engine","ejs");
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));`
// app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(require("express-session")({
	secret: "Camp Secret is out!",
	resave:false,
	saveUninitialized:false
}));
app.locals.moment=require("moment");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.use(new googleStrategy({
//     clientID: '360436302244-mqpj7ermtftqm7qlbai5kptupdm7fm3f.apps.googleusercontent.com',
//     clientSecret: 'B7tyPsvr6RPUUmIw36JLfPWj',
// 	callbackURL: "http://locahost:8080/auth/google/callback",
// 	passReqToCallback   : true
// },
// function (request, accessToken, refreshToken, profile, done) {
// 	User.findOrCreate({ googleId: profile.id }, function (err, user) {
// 		return done(err, user);
// 	  });
// }
// ));

// passport.serializeUser(function(user, callback){
// 	console.log('serializing user.');
// 	callback(null, user.id);
// });

// passport.deserializeUser(function(user, callback){
//    console.log('deserialize user.');
//    User.findById(id, function(err, user) {
//    callback(null, user);
//    })
// });

app.use(function(req,res,next){
	res.locals.currentUser =req.user;
	res.locals.error= req.flash("error");
	res.locals.success= req.flash("success");
	next();
});

app.get('/auth/google',
  passport.authenticate('google', { scope: 
      [ 'https://www.googleapis.com/auth/plus.login',
      , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
));

app.get( '/auth/google/callback', 
    passport.authenticate( 'google', { 
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}));

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(profileRoutes);
app.use(campRoutes);
app.use(essentialRoutes);



app.listen(8000, () => console.log('Server running on port 8000!'));








