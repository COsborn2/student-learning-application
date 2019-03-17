import React, { Component } from 'react'
import { Link } from 'react-router-dom'

/**
 * This component is rendered when an error occurs
 */
class ErrorScreen extends Component {
  constructor (props) {
    super(props)
    window.sessionStorage.clear()
  }

  render () {
    return (
      <div className='mx-auto text-center' style={{ background: '#b9d5e0', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className='mx-auto text-center'>

          <h1 style={{ fontSize: '70px', color: '#408fbd', marginBottom: '10%' }}>Whoops, Something went wrong</h1>

          <div>
            <h2 style={{ color: '#7eaec5' }}>An unknown error occurred. Please re-login and try again</h2>
          </div>

          <div className='container'>
            <div className='row justify-content-center'>

              <div className='col-md-4'>
                <Link to='/' className='px-5 pt-5 pb-2 btn-info card mx-auto mb-4'
                  style={{ background: '#408fbd', boxShadow: '10px 10px 5px 1px #6b6b6b' }}>
                  <h1 className='mb-4'>Home</h1>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default ErrorScreen
