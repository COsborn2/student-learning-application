import React from 'react'

const centerStyle = { top: 0, bottom: 0, left: 0, right: 0 }

function checkLandScape (h, w) {
  return h >= w
}

function LandScape (props) {
  if (checkLandScape(props.windowHeight, props.windowWidth)) {
    return (<div className='backdrop fade-in bg-white'>
    <img className='img-fluid position-absolute m-auto fade-in w-50' style={centerStyle} alt='Responsive image' src={'https://us.123rf.com/450wm/honzahruby/honzahruby1507/honzahruby150700164/42507960-vector-linear-icon-with-rotate-tablet-gesture-from-portrait-to-landscape-screen-mode-flat-design-thi.jpg?ver=6'} alt='Loading...' />
  </div>)
  } 
  else {
    return <div></div>
  }
}

export default LandScape
