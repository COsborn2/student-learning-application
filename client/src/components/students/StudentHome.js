import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import LetterLine from './utils/LetterLine'

const tempSizingImage = 'https://via.placeholder.com/270x200'

/**
 * This is the student home screen.
 */
class StudentHome extends PureComponent {
  render () {
    const { match, history, letterLineInfo, onLetterLineSelection } = this.props
    return (
      <div className='mx-auto text-center align-middle' style={{ background: '#b9d5e0', width: '90%', marginTop: '0', paddingTop: '2%' }}>

        <div className='row'>
          <div className='col-md-4' style={{ maxWidth: '25vw', marginLeft: 'auto', marginRight: 'auto', minWidth: '200px', minHeight: '200px' }}>
            <Button className='btn-info' onClick={() => history.push(match.url + '/video')}
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b', paddingLeft: '5%', paddingRight: '5%' }}>
              <img src={tempSizingImage} alt='Letter Video' style={{ maxWidth: '80%', maxHeight: '80%', marginTop: '10%', marginBottom: '2%' }} />
              <h1 className='mb-4' style={{ fontSize: '200%' }}>Review</h1>
            </Button>
          </div>

          <div className='col-md-4' style={{ maxWidth: '25vw', marginLeft: 'auto', marginRight: 'auto', minWidth: '200px', minHeight: '200px' }}>
            <Button className='btn-info' onClick={() => history.push(match.url + '/writing')}
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b', paddingLeft: '5%', paddingRight: '5%' }}>
              <img src={tempSizingImage} alt='Letter Video' style={{ maxWidth: '80%', maxHeight: '80%', marginTop: '10%', marginBottom: '2%' }} />
              <h1 className='mb-4' style={{ fontSize: '200%' }}>Writing</h1>
            </Button>
          </div>

          <div className='col-md-4' style={{ maxWidth: '25vw', marginLeft: 'auto', marginRight: 'auto', minWidth: '200px', minHeight: '200px' }}>
            <Button className='btn-info' onClick={() => history.push(match.url + '/spelling')}
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b', paddingLeft: '5%', paddingRight: '5%' }}>
              <img src={tempSizingImage} alt='Letter Video' style={{ maxWidth: '80%', maxHeight: '80%', marginTop: '10%', marginBottom: '2%' }} />
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
  onLetterLineSelection: PropTypes.func.isRequired
}

export default StudentHome
