import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// const instructorImageSrc = 'https://surfberbere.com/wp-content/uploads/2016/04/Teacher-02-256.png'
// const studentImageSrc = 'https://publiciq.com/wp-content/uploads/2018/08/student.png'

const studentImageSrc = 'https://i.gyazo.com/90f380a3dff8a5c603c56f1498544d3c.png'
const instructorImageSrc = 'https://i.gyazo.com/4e38420d2e6daf8ac8713d1423a0d52a.png'

// const tempSizingImage = 'https://via.placeholder.com/540x400'

const Home = () => (
  <div className='mx-auto text-center' style={{ background: '#b9d5e0', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
    <div className='mx-auto text-center'>
      <div>
        <h2 style={{ color: '#7eaec5' }}>Welcome to the</h2>
      </div>

      <h1 style={{ fontSize: '70px', color: '#408fbd', marginBottom: '10%' }}>Student Learning Application</h1>

      <div className='container'>
        <div className='row justify-content-center'>

          <div className='col-md-4'>
            <Link to='/student' className='px-5 pt-5 pb-2 btn-info card mx-auto mb-4'
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b' }}>
              <img className='card-img-top' src={studentImageSrc} alt='Letter Video' />
              <h1 className='mb-4'>Student</h1>
            </Link>
          </div>

          <div className='col-md-4'>
            <Link to='/instructor' className='px-5 pt-5 pb-2 btn-info card mx-auto mb-4'
              style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b' }}>
              <img className='card-img-top' src={instructorImageSrc} alt='Letter Video' />
              <h1 className='mb-4'>Instructor</h1>
            </Link>
          </div>

        </div>
      </div>

    </div>
  </div>
)

Home.propTypes = {
  history: PropTypes.object.isRequired
}

export default Home
