import React, { PureComponent } from 'react'

function getVideo () { // todo pass video url to this component
  return 'https://www.youtube.com/embed/36IBDpTRVNE'
}

class StudentVideo extends PureComponent {
  render () {
    return (
      <div className='container text-center'>
        <h1 className='text-center p-1 shadow'>Letter Video</h1>
        {/* todo remove hardcoded width and height values */}
        <iframe title='LetterVideo' width='560' height='315' src={getVideo()} frameBorder='0' allow='accelerometer; encrypted-media; gyroscope; picture-in-picture' />
      </div>
    )
  }
}

export default StudentVideo
