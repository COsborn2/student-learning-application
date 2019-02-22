import fetch from 'isomorphic-fetch'

class InstructorApiCalls {
  // This is where backend api call is made
  static async verifyAuth (id, pass) {

    if (id === 'instructorDev@test.com' && pass === 'password') { // this is just for the devSkip button
      return 'Valid JWT'
    }
    let httpMessage = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: id,
        password: pass
      })
    }

    const response = await fetch('/api/instructor/login', httpMessage)
    console.log('loginRes: ' + response)
    if (response.status !== 200) {
      return {
        jwt: null,
        error: await response.json()
      }
    }
    let jwt = response.headers.get('x-auth')
    return { jwt, error: null }
  }

  // This is where backend api call is made
  static async verifySignup (id, pass) {
    let httpMessage = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: id,
        password: pass
      })
    }

    const response = await fetch(`api/instructor`, httpMessage)
    console.log(response)
    if (response.status !== 200) {
      return {
        jwt: null,
        error: (await response.json()).error
      }
    }

    let jwt = response.headers.get('x-auth')
    return { jwt, error: null }
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
