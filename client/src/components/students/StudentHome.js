import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import LetterLine from './utils/LetterLine'

// const tempSizingImage = 'https://via.placeholder.com/270x200'

const reviewImage = 'https://i.gyazo.com/b0349898ad116bd5d7ccd1ea16eed540.png'
const writingImage = 'https://i.gyazo.com/e7c00ac9dd4c8eecf4d9052f442f3437.png'
const spellingImage = 'https://i.gyazo.com/dc5f0a30fd614cb65b4039a713973142.png'

/**
 * This is the student home screen.
 */
class StudentHome extends PureComponent {
  render () {
    const { match, history, letterLineInfo, onLetterLineSelection } = this.props
    return (
      <div className='mx-auto text-center align-middle' style={{ background: '#b9d5e0', width: '90%', marginTop: '0', paddingTop: '2%' }}>

        <div className='row'>
          <div className='col-4' style={{ maxWidth: '25vw', marginLeft: 'auto', marginRight: 'auto', minWidth: '200px', minHeight: '200px' }}>
            <Button className='btn-info' onClick={() => history.push(match.url + '/video')}
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b', paddingLeft: '5%', paddingRight: '5%' }}>
              <img src={reviewImage} alt='Letter Video' style={{ maxWidth: '80%', maxHeight: '80%', marginTop: '10%', marginBottom: '2%' }} />
              <h1 className='mb-4' style={{ fontSize: '200%' }}>Review</h1>
            </Button>
          </div>

          <div className='col4' style={{ maxWidth: '25vw', marginLeft: 'auto', marginRight: 'auto', minWidth: '200px', minHeight: '200px' }}>
            <Button className='btn-info' onClick={() => history.push(match.url + '/writing')}
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b', paddingLeft: '5%', paddingRight: '5%' }}>
              <img src={writingImage} alt='Letter Video' style={{ maxWidth: '80%', maxHeight: '80%', marginTop: '10%', marginBottom: '2%' }} />
              <h1 className='mb-4' style={{ fontSize: '200%' }}>Writing</h1>
            </Button>
          </div>

          <div className='col-4' style={{ maxWidth: '25vw', marginLeft: 'auto', marginRight: 'auto', minWidth: '200px', minHeight: '200px' }}>
            <Button className='btn-info' disabled={this.props.disableSpellingButton} onClick={() => history.push(match.url + '/spelling')}
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b', paddingLeft: '5%', paddingRight: '5%' }}>
              <img src={spellingImage} alt='Letter Video' style={{ maxWidth: '80%', maxHeight: '80%', marginTop: '10%', marginBottom: '2%' }} />
              <h1 className='mb-4' style={{ fontSize: '200%' }}>Spelling</h1>
            </Button>
          </div>
        </div>

        <div style={{ paddingTop: '2%' }}>
          <LetterLine letterLineInfo={letterLineInfo} onLetterLineSelection={onLetterLineSelection} />
        </div>

      </div>
    )
  }
}

StudentHome.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  letterLineInfo: PropTypes.object.isRequired,
  onLetterLineSelection: PropTypes.func.isRequired,
  disableSpellingButton: PropTypes.bool.isRequired
}

export default StudentHome
