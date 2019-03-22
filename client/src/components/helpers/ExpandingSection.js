import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/instructorStyles.css'

/**
 * This class is used to animate a section sliding out
 * If the onExpanded or onCollapsed props are defined, they
 * are called when that animation is completed
 */
class ExpandingSection extends PureComponent {
  state = {
    show: this.props.show
  }

  /**
   * This is triggered before every render to check if the props have changed
   * If the component prop show went from true to false, the onCollapsed prop function is called after it is collapsed if it is defined
   * If the component prop show went from false to true, the onExpanded prop function is called after it is expanded if it is defined
   * @param props The props passed to this component
   * @param state The current state
   * @returns {*} The state items to update, or null if no update is needed
   */
  static getDerivedStateFromProps (props, state) {
    if (props.show && !state.show) {
      if (props.onExpanded) {
        setTimeout(() => props.onExpanded(), 500)
      }
      return { show: true }
    } else if (!props.show && state.show) {
      if (props.onCollapsed) {
        setTimeout(() => props.onCollapsed(), 500)
      }
      return { show: false }
    }
    return null
  }

  render () {
    const { show } = this.state
    let additionalStyles = ''
    if (this.props.className) { additionalStyles = this.props.className }
    let outerCss = show ? 'section expand ' : 'section '
    let innerCss = show ? 'section-content expand ' : 'section-content '

    return (
      <div className={outerCss + additionalStyles + ` container rounded my-4 py-1`}>
        <div className={innerCss}>
          {this.props.children}
        </div>

      </div>
    )
  }
}

ExpandingSection.propTypes = {
  show: PropTypes.bool.isRequired,
  className: PropTypes.string,
  onCollapsed: PropTypes.func,
  onExpanded: PropTypes.func
}

export default ExpandingSection
