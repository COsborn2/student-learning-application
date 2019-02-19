import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import FormControl from 'react-bootstrap/FormControl'
import PropTypes from 'prop-types'

class CustomToggle extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    e.preventDefault()
    console.log('toggle btn click')
    this.props.onClick(e)
  }

  render () {
    return (
      <a href=' ' onClick={this.handleClick}>
        {this.props.children}
      </a>
    )
  }
}

class CustomMenu extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleChange = this.handleChange.bind(this)

    this.state = { value: '' }
  }

  handleChange (e) {
    console.log('menu filter change')
    this.setState({ value: e.target.value.toLowerCase().trim() })
  }

  render () {
    const {
      children,
      style,
      className,
      'aria-labelledby': labeledBy
    } = this.props

    const { value } = this.state

    return (
      <div style={style} className={className} aria-labelledby={labeledBy}>
        <FormControl
          autoFocus
          className='mx-3 my-2 w-auto'
          placeholder='Type to filter...'
          onChange={this.handleChange}
          value={value}
        />
        <ul className='list-unstyled'>
          {React.Children.toArray(children).filter(
            child =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    )
  }
}

class DropDownWithFilter extends React.Component {
  render () {
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id='dropdown-custom-toggle'>
          <button className='btn-lg btn-info'>{this.props.category}</button>
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          {this.props.values.map((value, index) =>
            <Dropdown.Item key={index} eventKey={index}
              onClick={() => this.props.onSelected(index)}>{value}</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

DropDownWithFilter.propTypes = {
  category: PropTypes.string.isRequired,
  values: PropTypes.array.isRequired,
  onSelected: PropTypes.func.isRequired
}

export default DropDownWithFilter
