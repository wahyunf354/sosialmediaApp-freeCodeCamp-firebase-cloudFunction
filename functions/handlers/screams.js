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

  const newScream = {
    body: req.body.body,
    userHendle: req.user.handle,
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
} 