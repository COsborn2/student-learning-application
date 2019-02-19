class InstructorApiCalls {
  // This is where backend api call is made
  static verifyAuth (id, pass) {
    if (id === 'instructorDev' && pass === 'password') { // this is just for the devSkip button
      return 'Valid JWT'
    }
    console.log('Expected instructor api login call.')// todo
    return null
  }

  // This is where backend api call is made
  static verifySignup (id, pass) {
    if (id.length > 3 && pass.length > 3) {
      return 'Valid JWT'
    }
    console.log('Expected instructor api sign-up call.')// todo
    return null
  }

  // This is where the api call is made to retrieve the specific instructor's classes
  static getCourses () {
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
            { word: 'car', imageURL: 'carURL.PNG' }]
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
            { word: 'plane', imageURL: 'planeURL.PNG' }]
        }]
      }
    ]
    return courses
  }
}

export default InstructorApiCalls
