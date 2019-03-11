import React, { PureComponent } from 'react'

function getVideo () { // TODO: pass video url to this component
  return 'https://www.youtube.com/embed/36IBDpTRVNE'
}

class StudentVideo extends PureComponent {
  render () {
    return (
      <div className='mx-auto text-center align-middle' style={{ background: '#b9d5e0', marginTop: '0', paddingTop: '2%', width: '90%' }}>
        <div className='mx-auto' style={{ width: '55%', paddingBottom: '2%' }}>
          <div className='iframe-container' style={{ background: '#4085bd', width: '100%', padding: '3%', boxShadow: '10px 10px 5px 1px #6b6b6b' }}>
            <div className='iframe-container' style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: '0' }}>
              <iframe title='LetterVideo' width='560' height='315' src={getVideo()} frameBorder='0' allow='accelerometer; encrypted-media; gyroscope; picture-in-picture'
                style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default StudentVideo
