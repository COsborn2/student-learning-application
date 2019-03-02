import React from 'react'

function getVideo () {
  return 'https://www.youtube.com/embed/36IBDpTRVNE'
}

class StudentVideo extends React.Component {
  constructor (props) {
    super(props)
    this.state = { }
  }

  render () {
    return (
      <div className='container text-center'>
        <h1 className='text-center p-1 shadow'>Letter Video</h1>
        <iframe width='560' height='315' src={getVideo()} frameborder='0' allow='accelerometer; encrypted-media; gyroscope; picture-in-picture' />
      </div>
    )
  }
}

export default StudentVideo
