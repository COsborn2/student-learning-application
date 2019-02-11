class InstructorObj {
  TYPE = 'instructor'
  id
  JWT
  isAuth
  constructor (id) {
    this.id = (id !== undefined) ? id : -1
    this.JWT = null
    this.isAuth = false
  }

  // This is where backend api call is made
  verifyAuth (id, pass) {
    if (id === 'instructorDev' && pass === 'password') { // this is just for the devSkip button
      this.id = id
      this.JWT = 'Valid JWT'
      this.isAuth = true
      return true
    }
    console.log('Expected instructor api login call.')// todo
    this.id = -1
    this.JWT = null
    this.isAuth = false
    return false
  }

  // This is where backend api call is made
  verifySignup (id, pass) {
    if (id.length > 3 && pass.length > 3) {
      this.id = id
      this.JWT = 'Valid JWT'
      this.isAuth = true
      return true
    }
    console.log('Expected instructor api signup call.')// todo
    return false
  }
}

export default InstructorObj
