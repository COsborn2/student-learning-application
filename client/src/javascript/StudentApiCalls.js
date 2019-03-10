import fetch from 'isomorphic-fetch'

/* ROUTES */
const signupURL = '/api/student'
const loginURL = '/api/student/login'
const initURL = '/api/student'
const getAssignmentsAndProgressURL = '/api/student/progress'
const detectWritingURL = '/api/student/writing'

async function stall (stallTime = 3000) {
  await new Promise(resolve => setTimeout(resolve, stallTime))
}

class StudentApiCalls {
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
    return { jwt, username: body.username }
  }

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
    return { jwt, username: body.username }
  }

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
    console.log('body')
    console.log(body)
    if (res.status !== 200) {
      const body = await res.json()
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }
    return body
  }

  static async getAssignmentsAndProgress (jwt) {
    let httpMessage = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-auth': jwt
      }
    }

    const res = await fetch(getAssignmentsAndProgressURL, httpMessage)
    let body = await res.json()
    if (res.status !== 200) {
      const body = await res.json()
      console.log(httpMessage) // todo remove log statements
      console.log(res)
      console.log(`Error: ${body.error}`)
      return { error: body.error }
    }
    return { student: body.student, classroom: body.classroom }
  }

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

  static async getAssignmentByIdMock (id) {
    return {
      letters: ['a', 'b', 'c'],
      words: [
        { word: 'kite', imageURL: 'https://www.shareicon.net/download/2016/07/09/118997_activity.ico' },
        {
          word: 'car',
          imageURL: 'https://images.vexels.com/media/users/3/154391/isolated/lists/430c48555fb4c80d9e77fc83d74fdb85-convertible-car-side-view-silhouette.png'
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
