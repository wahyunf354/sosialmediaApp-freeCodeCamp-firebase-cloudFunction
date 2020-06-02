const serviceAccount = require("../mejengapp-4d31f-firebase-adminsdk-c7i1c-4697be777e.json");
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebase = require('firebase')
const app = require('express')()

const firebaseConfig = {
  apiKey: "AIzaSyC7ucwMc5gcbXSVpFLnaqiKZ9PwNKYnuOg",
  authDomain: "mejengapp-4d31f.firebaseapp.com",
  databaseURL: "https://mejengapp-4d31f.firebaseio.com",
  projectId: "mejengapp-4d31f",
  storageBucket: "mejengapp-4d31f.appspot.com",
  messagingSenderId: "922944708055",
  appId: "1:922944708055:web:5938c238ca51af38bd3f92",
  measurementId: "G-BKWYLQQ6L3"
};

firebase.initializeApp(firebaseConfig)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mejengapp-4d31f.firebaseio.com"
})

const db = admin.firestore()

app.get('/screams', (req, res) => {
  db.collection('scereams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHendle: doc.data().userHendle,
          createdAt: doc.data().createdAt,
          likeCount: doc.data().likeCount,
          commendCount: doc.data().commendCount
        })
      });
      return res.json(screams);
    })
    .catch(err => console.error(err))
})

app.post('/screams',(req, res) => {

  const newScream = {
    body: req.body.body,
    userHendle: req.body.userHendle,
    createdAt: new Date().toISOString()
  }

  db.collection('scereams')
    .add(newScream)
    .then(doc => {
      return res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch(err => {
      res.json({ error: 'somethings went wrong' })
      console.error(err)
    })
})

// route Sign up
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  }

  // TODO: validate data
  let token 
  let userId
  db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: `this handle is already taken` })
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid
      return data.user.getIdToken()
    })
    .then(idToken => {
      token = idToken 
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      }
      return db.doc(`/users/${ newUser.handle }`).set(userCredentials)
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch(err => {
      console.log(err)
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ error: 'Email is already is use' })
      } else {
        return res.status(500).json({ error: err.code })
      }
    })
})

exports.api = functions.region('europe-west1').https.onRequest(app)
