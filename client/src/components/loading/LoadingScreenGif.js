import React from 'react'
import PropTypes from 'prop-types'
import LoadingGif from '../../assets/images/LoadingScreenGif.gif'

const centerStyles = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
}

// this serves as both the loading screen when you fist launch as well
// as the loading image used by LoadingScreen when awaiting api calls

function LoadingScreenGif (props) {
  let className = (!props.className) ? 'img-fluid position-absolute m-auto' : props.className
  return (<img className={className} style={centerStyles} alt='Loading...' src={LoadingGif} />
  )
}

LoadingScreenGif.propTypes = {
  className: PropTypes.string
}

export default LoadingScreenGif
