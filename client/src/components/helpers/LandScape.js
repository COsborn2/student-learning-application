import React, { PureComponent } from 'react'

const centerStyle = { top: 0, bottom: 0, left: 0, right: 0 }

class LandScape extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { isPortrait: false }
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  static isPortrait (height, width) {
    return height > width
  }

  componentDidMount () {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions () {
    this.setState({ isPortrait: LandScape.isPortrait(window.innerHeight, window.innerWidth) })
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
