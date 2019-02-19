class InstructorApiCalls {
  // This is where backend api call is made
  verifyAuth (id, pass) {
    if (id === 'instructorDev' && pass === 'password') { // this is just for the devSkip button
      return 'Valid JWT'
    }
    console.log('Expected instructor api login call.')// todo
    return null
  }

  // This is where backend api call is made
  verifySignup (id, pass) {
    if (id.length > 3 && pass.length > 3) {
      return 'Valid JWT'
    }
    console.log('Expected instructor api sign-up call.')// todo
    return null
  }

  // This is where the api call is made to retrieve the specific instructor's classes
  updateClasses () {
    let classrooms = [{
      classCode: 1,
      students: [{ userName: 'devStudent' }]
    }]
    return classrooms
  }
}

export default InstructorApiCalls
