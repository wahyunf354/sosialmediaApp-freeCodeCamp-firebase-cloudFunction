const { 
  getAllScreams, 
  postScreams, 
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream 
} = require('./handlers/screams.js')
const { 
  signUp, 
  login, 
  uploadImage, 
  addUserDetail, 
  getAuthenticationUser 
} = require('./handlers/users')
const functions = require('firebase-functions')
const FBAuth = require('./util/fbAuth')
const app = require('express')()

// Screams Route
app.post('/screams', FBAuth, postScreams)
app.get('/screams', getAllScreams)
app.get('/scream/:screamId', getScream)
app.delete('/scream/:screamId', FBAuth, deleteScream)
app.get('/scream/:screamId/like', FBAuth, likeScream)
app.get('/scream/:screamId/unlike', FBAuth, unlikeScream)
app.post('/scream/:screamId/comment',FBAuth ,commentOnScream)


// Users Route
app.post('/signup', signUp)
app.post('/login', login)
app.post('/user/image', FBAuth, uploadImage)
app.post('/user', FBAuth, addUserDetail)
app.get('/user', FBAuth, getAuthenticationUser)

exports.api = functions.region('europe-west1').https.onRequest(app)
