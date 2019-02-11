class StudentObj {
  TYPE = 'student'
  id
  JWT
  isAuth
  assignments
  progress
  constructor (user) {
    if (user) {
      this.id = user.id
      this.JWT = user.JWT
      this.isAuth = user.isAuth
      this.assignments = user.assignments
      this.progress = user.progress
    } else {
      this.id = -1
      this.JWT = null
      this.isAuth = false
      this.assignments = null
      this.progress = null
    }
  }

  // This is where backend api call is made
  verifyAuth (id, pass) {
    if (id === 'studentDev' && pass === 'password') { // this is just for the devSkip button
      this.id = id
      this.JWT = 'Valid JWT'
      this.isAuth = true
      return true
    }
    console.log('Expected api login call.')// todo
    return false
  }

  // This is where backend api call is made
  verifySignup (id, pass) {
    if (id.length > 3 && pass.length > 3) { // this is just to test that signup is working
      this.id = id
      this.JWT = 'Valid JWT'
      this.isAuth = true
      return true
    }
    console.log('Expected api signup call.')// todo
    return false
  }

  // This is where the api call is made to retrieve the specific student's assignments
  // IMPORTANT: THE STUDENTOBJ MUST BE SAVED USING SET STATE AFTER THIS CALL
  getAssignments () {
    let progress = {
      curAssignmentIndex: 0,
      curWordIndex: 0, // if word index is equal to the array size, all words have been spelled
      curLetterIndex: 0
    }
    let assignments = [{
      letters: [],
      words: [
        { word: 'kite', imageURL: 'https://www.shareicon.net/download/2016/07/09/118997_activity.ico' },
        { word: 'car', imageURL: 'https://images.vexels.com/media/users/3/154391/isolated/lists/430c48555fb4c80d9e77fc83d74fdb85-convertible-car-side-view-silhouette.png' }
      ]
    }]
    this.progress = progress
    this.assignments = assignments
    return true
  }

  // This is where the api call is made to update the specific studnet's assignment progress on the server
  putAssignments () {
    console.log('user wordIndex: ' + this.progress.curWordIndex)
    console.log('Expected api signup call.')
  }
}

export default StudentObj
