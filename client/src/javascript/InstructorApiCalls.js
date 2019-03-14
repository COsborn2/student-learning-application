import fetch from 'isomorphic-fetch'

/* ROUTES */
const signupURL = '/api/instructor'
const loginURL = '/api/instructor/login'
const createCourseURL = '/api/classrooms'
const getCourseByIdURL = '/api/classrooms/'

async function stall (stallTime = 3000) {
  await new Promise(resolve => setTimeout(resolve, stallTime))
}

class InstructorApiCalls {
  /***
   * This method calls the api to create a new Instructor
   * @param name The name of the new Instructor
   * @param email The email of the new Instructor
   * @param password The password of the new Instructor
   * @returns {Promise<*>} Returns the Instructor's name, email, and jwt. Or error if sign up failed
   */
  static async signup (name, email, password) {
    let httpMessage = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name
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
    return { name: body.name, jwt, email: body.email, courseIds: body.class }
  }

  /***
   * This method calls the api to create a new Instructor
   * @param email The email to attempt authentication with
   * @param password The password to attempt authentication
   * @returns {Promise<*>} Returns the Instructor's name, email, and jwt. Or error if login failed
   */
  static async login (email, password) {
    let httpMessage = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
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
    console.log(body)
    let jwt = res.headers.get('x-auth')
    return { name: body.name, jwt, email: body.email, courseIds: body.class }
  }

  static async createCourse (jwt, courseCode) {
    let httpMessage = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': jwt
      },
      body: JSON.stringify({ classcode: courseCode })
    }

    const res = await fetch(createCourseURL, httpMessage)
    console.log(res)
    const body = await res.json()
    if (res.status !== 200) {
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }
    console.log(body)
    return { course: body.classroom, courseIds: body.updatedInstructor.class }
  }

  /**
   * This method calls the api to create a new Instructor
   * @param jwt
   * @param id
   * @returns {Promise<*>}
   */
  static async getCourseById (jwt, id) {
    let httpMessage = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': jwt
      }
    }

    const res = await fetch(getCourseByIdURL + id, httpMessage)
    const body = await res.json()
    if (res.status !== 200) {
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }
    console.log(body)
    return body
  }

  // This is where the api call is made to retrieve the specific instructor's classes
  static async getCourses () {
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
    await stall(1500)
    return courses
  }
}

export default InstructorApiCalls
