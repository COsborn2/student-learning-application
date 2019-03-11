import fetch from 'isomorphic-fetch'

/* ROUTES */
const signupURL = '/api/student'
const loginURL = '/api/student/login'
const initURL = '/api/student'
const getAssignmentURL = '/api/assignment/'
const updateProgressURL = '/api/student/progress'
const detectWritingURL = '/api/student/writing'

async function stall (stallTime = 3000) {
  await new Promise(resolve => setTimeout(resolve, stallTime))
}

class StudentApiCalls {
  /***
   * This method calls the signup api.
   * @param classCode classcode used to signup
   * @param username username used to signup
   * @returns {Promise<*>} returns the user
   */
  static async signup (classCode, username) {
    let httpMessage = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        classcode: classCode
      })
    }

    const res = await fetch(signupURL, httpMessage)
    const body = await res.json()
    if (res.status !== 200) {
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }

    let jwt = res.headers.get('x-auth')
    return {
      username: body.username,
      jwt,
      classcode: body.classcode,
      progress: {
        currentAssignmentIndex: body.currentAssignment,
        currentWordIndex: body.currentLetter, // if word index is equal to the array size, all words have been spelled
        currentLetterIndex: body.currentWord,
        finishedCourse: body.finishedCourse
      }
    }
  }

  /***
   * This method calls the login api.
   * @param classCode classcode used to login
   * @param username username used to login
   * @returns {Promise<*>} returns the user
   */
  static async login (classCode, username) {
    let httpMessage = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        classcode: classCode
      })
    }

    const res = await fetch(loginURL, httpMessage)
    const body = await res.json()
    if (res.status !== 200) {
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }

    let jwt = res.headers.get('x-auth')
    return {
      username: body.username,
      jwt,
      classcode: body.classcode,
      progress: {
        currentAssignmentIndex: body.currentAssignment,
        currentWordIndex: body.currentLetter, // if word index is equal to the array size, all words have been spelled
        currentLetterIndex: body.currentWord,
        finishedCourse: body.finishedCourse
      }
    }
  }

  /***
   * This method calls the init student api.
   * @param jwt Web token
   * @returns {Promise<*>} AssignmentIds and populated letters
   */
  static async getInitialStudentState (jwt) {
    let httpMessage = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': jwt
      }
    }

    const res = await fetch(initURL, httpMessage)
    let body = await res.json()
    if (res.status !== 200) {
      const body = await res.json()
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }
    return body
  }

  /***
   * This method calls the get assignment api
   * @param id Id to get
   * @returns {Promise<*>} Populated assignment
   */
  static async getAssignmentById (id) {
    let httpMessage = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }

    const res = await fetch(getAssignmentURL + id, httpMessage)
    let body = await res.json()
    if (res.status !== 200) {
      const body = await res.json()
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }

    return body.assignment
  }

  /***
   * This method is used to call the detectWriting api.
   * @param jwt Web token
   * @param image64 Base 64 encoded image
   * @returns {Promise<*>}
   */
  static async detectWriting (jwt, image64) {
    let httpMessage = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': jwt
      },
      body: JSON.stringify({ image: image64 })
    }

    const res = await fetch(detectWritingURL, httpMessage)
    const body = await res.json()
    if (res.status !== 200) {
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }

    return body
  }

  /***
   * This method is used to call the update student progress route
   * @param jwt Web token
   * @param progress Current students progress
   * @returns {Promise<*>} Returns the updated student
   */
  static async updateStudentProgress (jwt, progress) {
    let httpMessage = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': jwt
      },
      body: JSON.stringify({
        currentLetter: progress.currentLetterIndex,
        currentWord: progress.currentWordIndex,
        currentAssignment: progress.currentAssignmentIndex }
      )
    }

    const res = await fetch(updateProgressURL, httpMessage)
    const body = await res.json()
    if (res.status !== 200) {
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }

    return {
      username: body.username,
      jwt,
      classcode: body.classcode,
      progress: {
        currentAssignmentIndex: body.currentAssignment,
        currentWordIndex: body.currentLetter, // if word index is equal to the array size, all words have been spelled
        currentLetterIndex: body.currentWord,
        finishedCourse: body.finishedCourse
      }
    }
  }

  /***
   * This method is used to call the update student progress route
   * @param jwt Web token
   * @param progress Current students progress
   * @returns {Promise<*>} Returns the updated student
   */
  static async devSetStudentProgress (jwt, assignmentIndex, letterIndex, wordIndex) { // todo remove dev api call
    let httpMessage = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': jwt
      },
      body: JSON.stringify({
        currentLetter: letterIndex,
        currentWord: wordIndex,
        currentAssignment: assignmentIndex }
      )
    }

    const res = await fetch(updateProgressURL, httpMessage)
    const body = await res.json()
    if (res.status !== 200) {
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }

    return {
      username: body.username,
      jwt,
      classcode: body.classcode,
      progress: {
        currentAssignmentIndex: body.currentAssignment,
        currentWordIndex: body.currentLetter,
        currentLetterIndex: body.currentWord,
        finishedCourse: body.finishedCourse
      }
    }
  }

  /***
   * This method uses local storrage rather than calling the api. Will be removed when api is fixed
   * @param jwt Web token
   * @param progress Current users progress
   * @returns {Promise<boolean>} returns true if successful
   */
  static async updateStudentProgressMock (jwt, progress) {
    window.localStorage.setItem('progress', JSON.stringify(progress))
    return true
  }

  static getAssignmentByIdMock (id) {
    return {
      letters: ['a', 'b', 'c'],
      words: [
        { text: 'kite', picture: 'https://www.shareicon.net/download/2016/07/09/118997_activity.ico' },
        {
          text: 'car',
          picture: 'https://images.vexels.com/media/users/3/154391/isolated/lists/430c48555fb4c80d9e77fc83d74fdb85-convertible-car-side-view-silhouette.png'
        }
      ]
    }
  }

  static async getProgressMock (jwt) {
    await stall(500)
    let progress = {
      currentAssignmentIndex: 0,
      currentWordIndex: 0, // if word index is equal to the array size, all words have been spelled
      currentLetterIndex: 0
    }
    return progress
  }

  // This is where the api call is made to retrieve the specific student's assignments
  static async getAssignmentsMock (jwt) {
    await stall(500)
    let assignments = [
      {
        letters: ['a', 'b', 'c'],
        words: [
          { word: 'kite', imageURL: 'https://www.shareicon.net/download/2016/07/09/118997_activity.ico' },
          {
            word: 'car',
            imageURL: 'https://images.vexels.com/media/users/3/154391/isolated/lists/430c48555fb4c80d9e77fc83d74fdb85-convertible-car-side-view-silhouette.png'
          }
        ]
      },
      {
        letters: ['d'],
        words: [
          { word: 'kite', imageURL: 'https://www.shareicon.net/download/2016/07/09/118997_activity.ico' },
          {
            word: 'car',
            imageURL: 'https://images.vexels.com/media/users/3/154391/isolated/lists/430c48555fb4c80d9e77fc83d74fdb85-convertible-car-side-view-silhouette.png'
          }
        ]
      }
    ]

    return assignments
  }

  static async getLettersMock (jwt) {
    return [
      ['a', 'b', 'c'],
      ['d'], ['e'], ['f']
    ]
  }

  // This is where the api call is made to update the specific students's assignment progress on the server
  static async putAssignmentsMock (jwt, progress) {
    await stall(1000)
    console.log('user progress in update api call: ')
    console.log(progress)
    return {}
  }
}

export default StudentApiCalls
