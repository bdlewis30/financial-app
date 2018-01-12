require('dotenv').config();
const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , massive = require('massive');

const {
    AUTH_DOMAIN,
    AUTH_CLIENT_ID,
    AUTH_CLIENT_SECRET,
    AUTH_CALLBACK_URL,
    CONNECTION_STRING
} = process.env

const app = express();
app.use(bodyParser.json());

//** Must be in order **
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

massive(CONNECTION_STRING).then((db) => {
    app.set('db', db) // Add a key of 'db' and set the value to db.
})

//Creating a new Auth0 Object
passport.use(new Auth0Strategy({
    domain: AUTH_DOMAIN,
    clientID: AUTH_CLIENT_ID,
    clientSecret: AUTH_CLIENT_SECRET,
    callbackURL: AUTH_CALLBACK_URL,  //In Auth0.com turn off OIDC Conformant under Advanced settings > OAuth
    scope: 'openid profile'
}, function (accessToken, refreshToken, extraParams, profile, done) {  // This function goes to serializedUser with data. Profile data is passed directly into profile in the serializedUser function.
    // Must have this callback function.
    // The accessToken, refreshToken, etc. are just parameters that you can call whatever you want.
    // console.log(profile); // Delete after setting up database. This was used to check what user data we needed.
    // done(null, profile); // Whever is in profile is passed into "done" and then into the session store (an object) with a session id. A cookie is sent to the frontend with the session id (this remembers user data).
    let { displayName, user_id, picture } = profile;
    const db = app.get('db'); // Retrieveing the database connection.
    // Massive converts database info into functions.
    db.find_user([user_id]).then(function (user) {
        if (!user[0]) { //If no user exist with that id, then create user in database.
            db.create_user([
                displayName,
                'test@test.com',
                picture,
                user_id
            ]).then(user => {
                return done(null, user[0].id)
            })
        } else {
            return done(null, user[0].id) // If user exist then pass user id. If the user does not exist, then run code above to create user.
        }
    })

}))

// Authentication Middleware. Works with sessions to identify users. Stored on Req.user.
passport.serializeUser((id, done) => {   // Get invoked the first time the user logs in.
    done(null, id);
})
passport.deserializeUser((id, done) => {  // deserialzed finds the key value pair in the session store to match the user with the user id in the session store. Req.user is sent with every request for the life of the request.
    app.get('db').find_session_user([id]) // app.get('db') calls the database and specifically find_session_user and the id. 
    .then(function(user){
        return done(null, user[0])
    })
})

//Getting the endpoint from a library instead of req and res.
app.get('/auth', passport.authenticate('auth0')) // Kicks off the authentication process when the frontend login button is clicked. Redirects to Auth0 to authenticate with Google, Facebook , whoever. Then sends user info to Auth0.
app.get('/auth/callback', passport.authenticate('auth0', {  //The user data from Auth0 is sent to the callback.
    successRedirect: 'http://localhost:3000/#/private',  //Specify where you want the user to be sent to with a successful login (frontend). You choose.
    failureRedirect: 'http://localhost:3000/' //Optional. Specify where you want the user to be sent to with a unsuccessful login (frontend). You choose.
}))
// This will return the users data  of users that are logged in.
app.get('/auth/me', (req, res) => {  
    if(!req.user){
        res.status(404).send('User no found.');
    }
    else {
        res.status(200).send(req.user);
    }
})

app.get('/auth/logout', function(req,res){
    req.logOut();
    res.redirect('http://localhost:3000/')
})

const { SERVER_PORT } = process.env
app.listen(SERVER_PORT, () => {
    console.log(`Listening on port: ${SERVER_PORT}`)
});