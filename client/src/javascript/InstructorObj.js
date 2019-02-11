class InstructorObj {
  TYPE = 'instructor'
  id
  JWT
  isAuth
  classrooms
  constructor (user) {
    if (user) {
      this.id = user.id
      this.JWT = user.JWT
      this.isAuth = user.isAuth
      this.classrooms = user.classrooms
    } else {
      this.id = -1
      this.JWT = null
      this.isAuth = false
      this.classrooms = null
    }
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

  // This is where the api call is made to retrieve the specific instructor's classes
  // IMPORTANT: THE INSTRUCTOROBJ MUST BE SAVED USING SET STATE AFTER THIS CALL
  updateClasses () {
    let classrooms = [{
      classCode: 1,
      students: [{ userName: 'devStudent' }]
    }]
    this.classrooms = classrooms
    return true
  }
}

export default InstructorObj
