import React, { Component } from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/instructorStyles.css'

class ExpandingSection extends Component {
  render () {
    let outerCss = this.props.show ? 'section expand ' : 'section '
    let innerCss = this.props.show ? 'section-content expand ' : 'section-content '
    return (
      <div className={outerCss + `container badge-light rounded my-4 py-1`}>
        <div className={innerCss}>
          {this.props.children}
        </div>

      </div>
    )
  }
}

ExpandingSection.propTypes = {
  show: PropTypes.bool.isRequired
}

export default ExpandingSection
