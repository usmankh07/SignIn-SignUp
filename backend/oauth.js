const passport = require('passport');
const model = require('./Model/model')

// Google Authentication
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GOOGLE_CLIENT_ID = "438467814712-qbjcdo43bavo3blbaeudnk2i31jj95if.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/google/callback",
  passReqToCallback: true,
  profileFields: ['id', 'displayName', 'name', 'gender', 'picture', 'email']

},
  function (request, accessToken, refreshToken, profile, done) {
   // asynchronous
   process.nextTick(function() {
    // find the user in the database based on their facebook id
    model.findOne({ 'uid' : profile.id }, function(err, user) {
  
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
            return done(err);
  
        // if the user is found, then log them in
        if (user) {
            console.log("user found")
            console.log(user)
            return done(null, user); // user found, return that user
        } else {
            // if there is no user found with that facebook id, create them
            var newUser = new model();
  
            // set all of the facebook information in our user model
            newUser.uid    = profile.id; // set the users facebook id                   
            newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
            newUser.pic = profile.photos[0].value;
            newUser.gender = profile.gender;
            newUser.email = profile.email;
            // save our user to the database
            newUser.save(function(err) {
                if (err)
                    throw err;
  
                // if successful, return the new user
                return done(null, newUser);
            });
        }
  
    });
  
  })
  
  }));



// Facebook Authentication
const FacebookStrategy = require('passport-facebook').Strategy;
const FACEBOOK_APP_ID = "643751070061691";
const FACEBOOK_APP_SECRET = "222949b6501ba13b80f9e72fbedcbd58";

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:8000/facebook/callback",
  profileFields: ['id', 'displayName', 'name', 'gender', 'picture']
},
  function (request, accessToken, refreshToken, profile, done) {
   // asynchronous
process.nextTick(function() {

  // find the user in the database based on their facebook id
  model.findOne({ 'uid' : profile.id }, function(err, user) {

      // if there is an error, stop everything and return that
      // ie an error connecting to the database
      if (err)
          return done(err);

      // if the user is found, then log them in
      if (user) {
          console.log("user found")
          console.log(user)
          return done(null, user); // user found, return that user
      } else {
          // if there is no user found with that facebook id, create them
          var newUser = new model();

          // set all of the facebook information in our user model
          newUser.uid    = profile.id; // set the users facebook id                   
          newUser.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
          newUser.pic = profile.photos[0].value
          newUser.gender = profile.gender;
          // save our user to the database
          newUser.save(function(err) {
              if (err)
                  throw err;

              // if successful, return the new user
              return done(null, newUser);
          });
      }

  });

})

}));
 


  // Github Authentication
  const GitHubStrategy = require('passport-github2').Strategy
  const GITHUB_CLIENT_ID = "2ca0f08a6e460c5de7c3";
  const GITHUB_CLIENT_SECRET = "e059fc7522ff9807c0eaae348b88b301fffaee47"
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/github/callback",
  },


  
  function(accessToken, refreshToken, profile, done) {
   process.nextTick(function() {
    model.findOne({ 'uid' : profile.id }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
            console.log("user found")
            console.log(user)
            return done(null, user); // user found, return that user
        } else {
            var newUser = new model();
            newUser.uid    = profile.id; // set the users facebook id                   
            newUser.name  = profile.username // look at the passport user profile to see how names are returned
            newUser.pic = profile.photos[0].value
            newUser.gender = profile.gender;
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }
  
    });
  
  })
  
  }));


  passport.serializeUser(function (user, done) {
    done(null, user.id);
    }
  );
  
  passport.deserializeUser(function (user, done) {
  done(null, user)
    }
  );
  