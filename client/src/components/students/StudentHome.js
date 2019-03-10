import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import LetterLine from './utils/LetterLine'

const tempSizingImage = 'https://via.placeholder.com/270x200'

class StudentHome extends PureComponent {
  render () {
    const { match, history, progress, letters } = this.props
    return (
      <div className='mx-auto text-center' style={{ background: '#b9d5e0', width: '85%' }}>
        <div>
          <header className='jumbotron jumbotron-fluid' style={{ background: '#7eaec5', color: 'white' }}>
            <div className='container'>
              <h1 className='display-4 font-weight-bold' style={{ fontSize: '4vh' }}>Hello {match.params.username}</h1>
            </div>
          </header>
        </div>

        <div className='row'>
          <div className='col-md-4'>
            <Button className='px-5 pt-5 pb-2 btn-info mx-auto mb-4' onClick={() => history.push(match.url + '/video')}
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b' }}>
              <img className='card-img-top' src={tempSizingImage} alt='Letter Video' />
              <h1 className='mb-4'>Review</h1>
            </Button>
          </div>

          <div className='col-md-4'>
            <Button className='px-5 pt-5 pb-2 btn-info mx-auto mb-4' onClick={() => history.push(match.url + '/writing')}
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b' }}>
              <img className='card-img-top' src={tempSizingImage} alt='Letter Video' />
              <h1 className='mb-4'>Writing</h1>
            </Button>
          </div>

          <div className='col-md-4'>
            <Button className='px-5 pt-5 pb-2 btn-info mx-auto mb-4' onClick={() => history.push(match.url + '/spelling')}
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b' }}>
              <img className='card-img-top' src={tempSizingImage} alt='Letter Video' />
              <h1 className='mb-4'>Spelling</h1>
            </Button>
          </div>
        </div>
        <LetterLine letters={letters} progress={progress} />
      </div>
    )
  }
}

StudentHome.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  progress: PropTypes.object.isRequired,
  letters: PropTypes.array.isRequired
}

export default StudentHome
