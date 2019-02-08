class StudentObj {
  TYPE = 'Student'
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
    if (id === 'StudentDev' && pass === 'password') {
      this.id = id
      this.JWT = 'Valid JWT'
      this.isAuth = true
      return true
    }
    console.log('Expected api call.')// todo
    this.id = -1
    this.JWT = null
    this.isAuth = false
    return false
  }
}

export default StudentObj
