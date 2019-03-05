import fetch from 'isomorphic-fetch'

class StudentApiCalls {
  // this is where a login is attempted
  static async verifyAuth (id, pass) {
    if (id === 'studentDev' && pass === 'password') { // todo this is just for the devSkip button
      return { jwt: 'ValidJwt' }
    }
    console.log('wpw')
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

    const response = await fetch(`api/student/login`, httpMessage)
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

  // this is where a sign up is attempted
  static async verifySignup (id, pass) {
    if (id === 'studentDev' && pass === 'password') { // todo this is just for the devSkip button
      return { jwt: 'ValidJwt' }
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

    const response = await fetch(`api/student`, httpMessage)
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

  // this is where the api call to retrieve the progress is
  static getProgress (jwt) {
    let progress = {
      curAssignmentIndex: 0,
      curWordIndex: 0, // if word index is equal to the array size, all words have been spelled
      curLetterIndex: 1
    }
    return progress
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
