import fetch from 'isomorphic-fetch'

/* ROUTES */
const signupURL = '/api/instructor'
const loginURL = '/api/instructor/login'
const getCoursesURL = '/api/instructor'
const createCourseURL = '/api/classrooms'
const getCourseByIdURL = '/api/classrooms/'

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
    let jwt = res.headers.get('x-auth')
    return { name: body.name, jwt, email: body.email, courseIds: body.class }
  }

  /***
   * This method calls the api to retrieve the instructors courses
   * @param jwt Web Token
   * @returns {Promise<*>} Returns the Instructor's courses. Or error if failed
   */
  static async getCourses (jwt) {
    let httpMessage = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': jwt
      }
    }

    const res = await fetch(getCoursesURL, httpMessage)
    const body = await res.json()
    if (res.status !== 200) {
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }
    return { courses: body.class }
  }

  /**
   * This method calls the api to create a new course with the given courseCode
   * @param jwt Web token
   * @param courseCode Course code to be used to create a new course
   * @returns {Promise<*>} Returns the course created. Or error if failed
   */
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
    const body = await res.json()
    if (res.status !== 200) {
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }
    return { course: body.classroom, courseIds: body.updatedInstructor.class }
  }

  /**
   * This method calls the api to retrieve a course by its id
   * @param jwt Web token
   * @param id The id of the course to get
   * @returns {Promise<*>} Returns the course. Or error if failed
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
}

export default InstructorApiCalls
