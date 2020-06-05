const { validateSignupData, validateLoginData, reduceUserDetail } = require('../util/validators')
const { admin, db } = require('../util/admin')
const config = require('../util/config')
const firebase = require('firebase')
firebase.initializeApp(config);


// Sign up user
exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  }

  const { valid, errors } = validateSignupData(newUser)

  if (!valid) return res.status(400).json(errors)

  const noImage = 'no-image.png'

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
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImage}?alt=media`,
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
    return null;
}

// Login users
exports.login = (req, res) => {
  const user = {
    email : req.body.email,
    password : req.body.password
  }
  const { valid, errors } =   validateLoginData(user)

  if(!valid) return res.status(400).json(errors)

  // sign in firebase user
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(data => data.user.getIdToken())
  .then(token => res.json({ token }))
  .catch(err => {
    console.log(err)
    if( err.code === 'auth/wrong-password') {
      return res.status(406).json({ ganeral: 'Wrong Credential, Please try again'  })
    } else {
      return res.status(500).json({erroer: err.code})
    }
  })
  return null;
}

// Add User Detail
exports.addUserDetail = (req, res) => {
  let userDetail = reduceUserDetail(req.body)

  db.doc(`/users/${ req.user.handle }`).update(userDetail)
    .then(() => {
      return res.json({ message: 'Details added successfully' })
    })
    .catch(err => {
      return res.status(500).json({ error: err.code })
    })
  }
  
// Get User Details
exports.getAuthenticationUser = (req, res) => {
  let userData = {}
  db.doc(`/users/${req.user.handle}`).get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data()
        return db.collection('likes').where('userHandle', '==', req.user.handle).get()
      }
      return null
    })
    .then(data => {
      userData.likes = []
      data.forEach(doc => {
        userData.likes.push(doc.data())
      })
      return res.json(userData)
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code })
    })
}

// Upload image profile user
exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy')
  const path = require('path')
  const os = require('os')
  const fs = require('fs')

  const busboy = new BusBoy({ headers: req.headers })

  let imageFileName
  let imageToBeUploaded = {}
  busboy.on('file', (fieldname, file, filename, encoding, mimetype ) => {
    if(mimetype !== 'image/jpeg' && mimetype !== 'image/png') {
      return res.status(400).json({ error: 'Wrong file type submitted' })
    }
    // my.image.png -> ['my', 'image', 'png']
    const imageExtension = filename.split('.')[filename.split('.').length - 1]
    // 8364138951.png
    imageFileName = `${Math.round( Math.random() * 1000000000000 )}.${imageExtension}`;
    console.log(imageExtension)
    const filepath = path.join(os.tmpdir(), imageFileName)
    imageToBeUploaded = { filepath, mimetype }
    file.pipe(fs.createWriteStream(filepath))
    return null
  })
  busboy.on('finish', () => {
    admin
    .storage()
    .bucket()
    .upload(imageToBeUploaded.filepath, {
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype,
        },
      },
    })
    .then(() => {
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
      return db.doc(`/users/${req.user.handle}`).update({ imageUrl })
    })
    .then(() => {
      return res.json({ message: 'Image Upload Successfully' })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
  })
  busboy.end(req.rawBody)
}