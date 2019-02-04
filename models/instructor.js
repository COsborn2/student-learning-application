const mongoose = require('mongoose')
const validator = require('validator')
const {TokenSchema} = require('./token')

let InstructorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  hashedPassword: {
    type: String,
    required: true,
    minlength: 6
  },
  token: TokenSchema
})

InstructorSchema.methods.generateTokenAndSave = function (callback) {
  let instructor = this
  let access = 'instructor'

  bcrypt.genSalt(12, (err, salt) => {
    let tokenVal = jwt.sign({_id: instructor._id, access}, salt).toString()

    instructor.token = new Token({
      token: tokenVal,
      access,
      salt
    })

    instructor.save()

    callback()
  })
}

let Instructor = mongoose.model('Instructor', InstructorSchema)

module.exports = { Instructor }
