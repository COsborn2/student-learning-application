var { User } = require('../models/user')

module.exports.allUsers = (req, res) => {
  User.find().then((users) => {
    res.send({ users })
    console.log('sent')
  }, (e) => {
    res.status(400).send(e)
  })
}
