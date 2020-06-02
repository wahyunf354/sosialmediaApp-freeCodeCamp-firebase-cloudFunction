const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

const express = require('express')
const app = express()

app.get('/screams', (req, res) => {
  admin
    .firestore()
    .collection('scereams')
    .orderBy('createdAt', 'desc')
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHendle: doc.data().userHendle,
          createdAt: doc.data().createdAt
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

  admin
    .firestore()
    .collection('scereams')
    .add(newScream)
    .then(doc => {
      return res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch(err => {
      res.json({ error: 'somethings went wrong' })
      console.error(err)
    })
})

// https://baseurl.com/api/

exports.api = functions.region('europe-west1').https.onRequest(app)
