const { getAllScreams, postScreams } = require('./handlers/screams.js')
const { signUp, login, uploadImage } = require('./handlers/users')
const functions = require('firebase-functions')
const FBAuth = require('./util/fbAuth')
const app = require('express')()

// Screams Route
app.post('/screams', FBAuth, postScreams)
app.get('/screams', getAllScreams)


// Users Route
app.post('/signup', signUp)
app.post('/login', login)
app.post('/user/image' ,FBAuth ,uploadImage)

exports.api = functions.region('europe-west1').https.onRequest(app)
