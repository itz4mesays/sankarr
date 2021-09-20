const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2').Strategy
const User = require('../app/models/user')

// let CALLBACK_URL = process.env.PORT ? 'https://sankarapp.herokuapp.com//google/callback' : process.env.CALLBACK_URL
// callbackURL: 'http://localhost:5000/google/callback',

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://sankarapp.herokuapp.com/google/callback',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    
    User.findOne({email: profile.email}).lean().then(user => {
      if (!user){
        new User({
          name: profile.displayName,
          email: profile.email,
          last_login: new Date()
        }).save().then((createdUser)=> {
          
          console.log(`User created successfully for ${profile.displayName}`)
          return done(null, profile)
        }).catch(err => console.log(err))
      }else{

        const filter = { email: profile.email}
        const update = {last_login: new Date()}
        const options = { new: true } //this is set to true for the saved response to be return if needed

        User.findOneAndUpdate(filter, update, options, (err, otp) => {
            if (err) {
                console.log(err)
                return done(err, profile)
            }

            console.log(`${profile.displayName} last login was updated successfully`)
            return done(null, profile)
        })
      }
    }).catch(err => console.log(err))
  }
));

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    // User.findById(id, (err, user) => {
        done(null, user)
    // })
})