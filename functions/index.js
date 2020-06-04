const functions = require('firebase-functions')
const app = require('express')()
const FBAuth = require('./util/fbAuth')
const {
  getAllScreams,
  postScreams
} = require('./handlers/screams.js')
const {
  signUp,
  login
} = require('./handlers/users')

// Screams Route
app.get('/screams', getAllScreams)
app.post('/screams', FBAuth, postScreams)


// Users Route
app.post('/signup', signUp)
app.post('/login', login)

exports.api = functions.region('europe-west1').https.onRequest(app)
