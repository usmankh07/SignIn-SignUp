const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport');
const app = express()
require('dotenv').config()
const port = process.env.PORT
const cors = require('cors')
require('./oauth')
const router = require('./Routes/route')

app.use(cors())
const database_link = process.env.MONGODB
mongoose.connect(database_link, () => {
    console.log(`Database is connected successfully`);
})

app.use(express.json())
app.use('/', router)
app.listen(port, () => {
    console.log(`The port is successfully running at ${port}`);
})

function isLoggedIn(req, res, next) {
    // The next just tell us to move forward.
    req.user ? next() : res.sendStatus(401);
  }
  app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }
));
app.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: '/protected',
    failureRedirect: '/google/failure'
  })
);

app.get('/protected', isLoggedIn, (req, res) => {
  res.redirect("http://localhost:3000/home");
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

app.get('/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});


// Facebook Authentication
app.get('/auth/facebook', passport.authenticate('facebook')); 

app.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/protected/fb',
    failureRedirect: '/google/failure'
  })
)

app.get('/protected/fb', isLoggedIn, (req, res) => {  
  res.send(`Hello ${req.user.name}`);
})


// Github Authentication
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/github/callback', 
  passport.authenticate('github', { 
    successRedirect: '/protected/github',
    failureRedirect: '/login' }),

);
app.get('/protected/github', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.body.username}`)
})