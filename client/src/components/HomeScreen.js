import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

class HomeScreen extends Component {
  constructor () {
    super()
    this.state = {
      doRedirect: null
    }
  }
  render () {
    if (this.state.doRedirect !== null) { return <Redirect to={this.state.doRedirect} /> }

    const writingImgSrc = 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/pencil.png'
    const spellingImgSrc = 'data:image/png;base64,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'
    return (
      <React.Fragment>
        <div className='container'>
          <header className='jumbotron my-3 bg-info'>
            <h1 className='display-4'>Student Learning Application</h1>
          </header>

          <div className='row'>
            <div className='col-md-6'>
              <div className='card' onClick={() => this.setState({ doRedirect: '/DragAndDrop' })}>
                <img className='card-img-top' src={spellingImgSrc} alt='Card image cap' />
                <div className='card-body text-center'>
                  <h5 className='card-title'>Spelling</h5>
                  <p className='card-text'>A simple demo using drag and drop to spell the word using the letter blocks provided</p>
                </div>
              </div>
            </div>

            <div className='col-md-6'>
              <div className='card' onClick={() => alert('write')}>
                <img className='card-img-top' src={writingImgSrc} alt='Card image cap' />
                <div className='card-body text-center'>
                  <h5 className='card-title'>Hand Writing</h5>
                  <p className='card-text'>Hand write to spell the words</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default HomeScreen
