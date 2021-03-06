import React, { PureComponent } from 'react'

const centerStyle = { top: 0, bottom: 0, left: 0, right: 0 }

/**
 * This component is used to display an image suggesting to rotate the device to landscape mode
 */
class LandScape extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { isPortrait: false }
    this.onWindowResize = this.onWindowResize.bind(this)
  }

  /**
   * This method is called right before the component is mounted from the DOM
   * It registers the screen size event handler
   */
  componentDidMount () {
    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize)
  }

  /**
   * This method is called right before the component is unmounted from the DOM
   */
  componentWillUnmount () {
    window.removeEventListener('resize', this.onWindowResize)
  }

  /**
   * This is called when the size of the screen changes
   */
  onWindowResize () {
    this.setState({ isPortrait: window.innerHeight > window.innerWidth })
  }

  render () {
    const { isPortrait } = this.state
    if (!isPortrait) return <div />
    return (
      <div className='backdrop fade-in bg-white'>
        <img className='img-fluid position-absolute m-auto fade-in w-50' style={centerStyle} alt='Turn screen to landscape' src={'https://us.123rf.com/450wm/honzahruby/honzahruby1507/honzahruby150700164/42507960-vector-linear-icon-with-rotate-tablet-gesture-from-portrait-to-landscape-screen-mode-flat-design-thi.jpg?ver=6'} />
      </div>
    )
  }
}

export default LandScape
