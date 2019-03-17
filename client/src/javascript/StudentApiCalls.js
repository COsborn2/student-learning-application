import fetch from 'isomorphic-fetch'

/* ROUTES */
const signupURL = '/api/student'
const loginURL = '/api/student/login'
const initURL = '/api/student'
const getAssignmentURL = '/api/assignment/'
const updateProgressURL = '/api/student/progress'
const detectWritingURL = '/api/student/writing'

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
}

export default StudentApiCalls
