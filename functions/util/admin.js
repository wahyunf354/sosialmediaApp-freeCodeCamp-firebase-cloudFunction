const serviceAccount = require("../../mejengapp-4d31f-firebase-adminsdk-c7i1c-4697be777e.json");
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mejengapp-4d31f.firebaseio.com",
  storageBucket: "mejengapp-4d31f.appspot.com"
})

const db = admin.firestore()

module.exports = { db, admin }