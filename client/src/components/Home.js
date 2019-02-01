import React from 'react'
import PropTypes from 'prop-types'
import { Button, Image } from 'react-bootstrap'

const instructorImageSrc = 'https://surfberbere.com/wp-content/uploads/2016/04/Teacher-02-256.png'
const studentImageSrc = 'https://publiciq.com/wp-content/uploads/2018/08/student.png'

const Home = ({ history }) => (
  <div className='container text-center'>
    <header className='jumbotron my-3 bg-info'>
      <h1 className='display-4 font-weight-bold'>Student Learning Application</h1>
    </header>

    <div className='row'>
      <div className='col-md-6'>
        <Button bsStyle='info' className='mx-auto mb-4 card badge-success' onClick={() => history.push('/instructor')}>
          <Image className='card-img-top w-auto' src={instructorImageSrc} alt='Instructor' />
          <div className='card-body'>
            <h5 className='card-title'>Instructor</h5>
            <p className='card-text'>Create classrooms, and manage students</p>
          </div>
        </Button>
      </div>

      <div className='col-md-6'>
        <Button bsStyle='info' className='mx-auto mb-4 card badge-success' onClick={() => history.push('/student')}>
          <Image className='card-img-top w-auto' src={studentImageSrc} alt='Student' />
          <div className='card-body'>
            <h5 className='card-title'>Student</h5>
            <p className='card-text'>Learn to write and spell</p>
          </div>
        </Button>
      </div>
    </div>
  </div>
)

Home.propTypes = {
  history: PropTypes.object.isRequired
}

export default Home
