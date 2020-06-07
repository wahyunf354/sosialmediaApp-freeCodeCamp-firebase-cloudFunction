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

exports.createNotificationOnLike = functions
  .region('europe-west1')
  .firestore.document('likes/{id}')
  .onCreate(snapshot => {
    return db
      .doc(`/scereams/${snapshot.data().screamId}`)
      .get()
      .then(() => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`)
            .set({
              createdAt: new Date().toISOString(),
              recipient: doc.data().userHandle,
              sender: snapshot.data().userHendle,
              type: 'like',
              read: false,
              screamId: doc.id
            })
        }
      })
      .then(() => {
        return;
      })
      .cacth(err => {
        console.error(err)
        return;
      })
  })

exports.deleteNotificationOnUnLike = functions
  .region('europe-west1')
  .firestore.document('comments/{id}')
  .onDelete(snapshot => {
    db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .then(() => {
        return
      })
      .cacth(err => {
        console.error(err)
        return
      })
  })

exports.createNotificationOnComment = functions
  .region('europe-west1')
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/scereams/${snapshot.data().screamId}`)
      .get()
      .then(() => {
        if (doc.exists && doc.data().userHendle !== snapshot.data().userHendle) {
          return db.doc(`/notifications/${snapshot.id}`)
            .set({
              createdAt: new Date().toISOString(),
              recipient: doc.data().userHandle,
              sender: snapshot.data().userHandle,
              type: 'comment',
              read: false,
              screamId: doc.id
            })
        }
      })
      .then(() => {
        return
      })
      .cacth(err => {
        console.error(err)
        return
      })
  })