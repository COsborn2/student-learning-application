import fetch from 'isomorphic-fetch'

/* ROUTES */
const signupURL = '/api/instructor'
const loginURL = '/api/instructor/login'

class InstructorApiCalls {
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
    return { jwt, name: body.name }
  }

  static async login (name, email, password) {
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

    const res = await fetch(loginURL, httpMessage)
    const body = await res.json()
    if (res.status !== 200) {
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }

    let jwt = res.headers.get('x-auth')
    return { jwt, name: body.name }
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
