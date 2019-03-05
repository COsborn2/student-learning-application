import React from 'react'
import PropTypes from 'prop-types'

function LoadingSpinner (props) {
  let loadingStyle = ''
  if (props.isLoading) {
    loadingStyle = 'loading-img'
  } else {
    loadingStyle = 'loading-img-finish'
    setTimeout(() => props.onLoadComplete(), 500)
  }
  return (
    <img className={loadingStyle}
      src='https://media0.giphy.com/media/5AtXMjjrTMwvK/giphy.gif?cid=3640f6095c7cdfe533726d36630279e9'
      alt='Loading' />)
}

LoadingSpinner.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onLoadComplete: PropTypes.func.isRequired
}

export default LoadingSpinner
