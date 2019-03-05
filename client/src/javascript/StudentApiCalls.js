import fetch from 'isomorphic-fetch'

/* ROUTES */
const loginURL = '/api/student/login'
const signupURL = '/api/student'
const getAssignmentsAndProgressURL = '/api/student/progress'

class StudentApiCalls {
  static async login (courseCode, userName) {
    console.log(`Student Login\nCourse Code: ${courseCode}\nUsername: ${userName}`)

    let httpMessage = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: userName,
        classcode: courseCode
      })
    }

    const res = await fetch(loginURL, httpMessage)
    console.log(res)
    if (res.status !== 200) {
      const body = await res.json()
      return { jwt: null, error: body.error }
    }

    let jwt = res.headers.get('x-auth')
    return { jwt, error: null }
  }

  static async signup (courseCode, userName) {
    console.log(`Student Signup\nCourse Code: ${courseCode}\nUsername: ${userName}`)

    let httpMessage = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: userName,
        classcode: courseCode
      })
    }

    const res = await fetch(signupURL, httpMessage)
    console.log(res)
    if (res.status !== 200) {
      const body = await res.json()
      return { jwt: null, error: body.error }
    }

    let jwt = res.headers.get('x-auth')
    return { jwt, error: null }
  }

  static async getAssignmentsAndProgress (jwt) {
    console.log(`Student Signup\nJWT: ${jwt}`)

    let httpMessage = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': jwt
      }
    }

    const res = await fetch(getAssignmentsAndProgressURL, httpMessage)
    console.log(res)
    if (res.status !== 200) {
      const body = await res.json()
      return { jwt: null, error: body.error }
    }
    let body = await res.json()

    return { student: body.student, classroom: body.classroom }
  }

  // This is where the api call is made to retrieve the specific student's assignments
  static getAssignments (jwt) {
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

  // This is where the api call is made to update the specific students's assignment progress on the server
  static putAssignments (jwt, progress) {
    console.log('user wordIndex: ' + progress.curWordIndex)
    console.log('Expected api signup call.')
  }
}

export default StudentApiCalls
