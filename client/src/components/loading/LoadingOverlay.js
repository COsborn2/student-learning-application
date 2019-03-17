import React from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/LoadingStyles.css'
import Spinner from '../../assets/images/Spinner.gif'

const styles = {
  center: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
}

/**
 * This component renders a loading overlay when the prop show is true
 * @param show Whether or not to display the overlay
 * @returns {*} The overlay to render
 */
const LoadingOverlay = ({ show }) => {
  if (!show) return <div />
  return (
    <div className='backdrop fade-in'>
      <img className='img-fluid position-absolute m-auto fade-in w-50' style={styles.center} src={Spinner} alt='Loading...' />
    </div>
  )
}

LoadingOverlay.propTypes = {
  show: PropTypes.bool.isRequired
}

export default LoadingOverlay
