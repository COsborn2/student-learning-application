class InstructorObj {
  TYPE = 'instructor'
  id
  JWT
  isAuth
  courses
  constructor (user) {
    if (user) {
      this.id = user.id
      this.JWT = user.JWT
      this.isAuth = user.isAuth
      this.courses = user.courses
    } else {
      this.id = -1
      this.JWT = null
      this.isAuth = false
      this.courses = null
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
  getCourses () {
    let courses = [
      {
        classCode: 1,
        className: 'Classroom 1',
        students: [{ userName: 'Rickey' }],
        assignments: [{
          id: 1,
          letters: [],
          words: [
            { word: 'kite', imageURL: 'kiteURL.PNG' },
            { word: 'car', imageURL: 'carURL.PNG' } ]
        }]
      },
      {
        classCode: 2,
        className: 'Classroom 2',
        students: [{ userName: 'Clark' }, { userName: 'Timmy' }],
        assignments: [{
          id: 1,
          letters: [],
          words: [
            { word: 'book', imageURL: 'bookURL.PNG' },
            { word: 'plane', imageURL: 'planeURL.PNG' } ]
        }]
      }
    ]
    this.courses = courses
    return true
  }
}

export default InstructorObj
