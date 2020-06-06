const { db } = require('../util/admin')

exports.getAllScreams =  (req, res) => {
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
}

exports.postScreams = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Body mush not be empty' })
  }

  const newScream = {
    body: req.body.body,
    userHendle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  }

  db.collection('scereams')
    .add(newScream)
    .then(doc => {
      const resScream = newScream
      resScream.screamId = doc.id
      return res.json(resScream)
    })
    .catch(err => {
      res.json({ error: 'somethings went wrong' })
      console.error(err)
    })
} 

exports.getScream = (req, res) => {
  let screamData = {}
  db.doc(`/scereams/${ req.params.screamId }`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error:"Scream not found" })
      }
      screamData = doc.data()
      screamData.screamId = doc.id
      return db.collection('comments').orderBy('createAt', 'desc').where('screamId', '==', req.params.screamId).get()
    })
    .then(data => {
      screamData.comments = []
      data.forEach(doc => {
        screamData.comments.push(doc.data())
      })
      return res.json(screamData)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code })
    })
}

exports.commentOnScream = (req, res) => {
  if (req.body.body.trim() === '') return res.status(400).json({ error: 'Mush not be empty' })

  const newComment = {
    body: req.body.body,
    createAt: new Date().toISOString(),
    screamId: req.params.screamId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  }

  db.doc(`/scereams/${req.params.screamId}`).get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(400).json({ error: 'Scream not found' })
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 })
    })
    .then(() => {
      return db.collection('comments').add(newComment)
    })
    .then(() => {
      return res.json(newComment)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: 'Something went wrong' })
    })
}

exports.likeScream = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId).limit(1)
  
  const screamDocument = db.doc(`/scereams/${req.params.screamId}`)

  let screamData = {}

  screamDocument.get()
  .then(doc => {
    if (doc.exists) {
      screamData = doc.data()
      screamData.screamId = doc.id
      return likeDocument.get()
    } else {
      return res.status(404).json({ error: 'Scream not found' }) 
    }
  })
  .then(data => {
    if(data.empty) {
      return db.collection('likes').add({
        screamId: req.params.screamId,
        userHandle: req.user.handle
      })
      .then(() => {
        screamData.likeCount++
        return screamDocument.update({ likeCount: screamData.likeCount })
      })
      .then(() => {
        return res.json(screamData)
      })
    } else {
      return res.status(400).json({ error: 'Scream already like' })
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ error: err.code })
  })
}

exports.unlikeScream = (req, res) => {
  const likeDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId).limit(1)
  
  const screamDocument = db.doc(`/scereams/${req.params.screamId}`)

  let screamData = {}

  screamDocument.get()
  .then(doc => {
    if (doc.exists) {
      screamData = doc.data()
      screamData.screamId = doc.id
      return likeDocument.get()
    } else {
      return res.status(404).json({ error: 'Scream not found' }) 
    }
  })
  .then(data => {
    if(data.empty) {
      return res.status(400).json({ error: 'Scream already like' })   
    } else {
      return db.doc(`/likes/${data.docs[0].id}`).delete()
        .then(() => {
          screamData.likeCount--
          return screamDocument.update({ likeCount: screamData.likeCount })
        })
        .then(() => {
          return res.json(screamData)
        })
    }
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ error: err.code })
  })
}

// Delete Scream
exports.deleteScream = (req, res) => {
  const document = db.doc(`/scereams/${req.params.screamId}`)
  document.get()
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Screams not found' })
      }
      console.log('debug')
      console.log(doc.data().userHandle)
      console.log( req.user.handle)
      if(doc.data().userHendle !== req.user.handle) {
        return res.status(403).json({ error: 'unauthorized' })
      } else {
        return document.delete()
      }
    })
    .then(() => {
      return res.json({ message: 'Scream delete successfully' })
    })
    .catch(err => {
      console.log(err)
      return res.status(500).json({ error: err.code })
    })
}