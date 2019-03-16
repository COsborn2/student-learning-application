import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/instructorStyles.css'

class List extends PureComponent {
  render () {
    return (
      <ul>
        {
          this.props.items.map((item, index) => {
            return <li className='filteredlist-item' key={index} onClick={() => this.props.onItemClick(item)}>{item}</li>
          })
        }
      </ul>
    )
  }
}

class FilteredList extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      currentItems: this.props.items,
      initialItems: this.props.items
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
  }

  handleFilterChange (event) {
    let updatedList = this.state.initialItems
    updatedList = updatedList.filter(item => {
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1
    })
    this.setState({ currentItems: updatedList })
  }

  onItemClick (itemName) {
    const itemIndex = this.state.initialItems.indexOf(itemName)
    this.props.onItemClick(itemIndex)
  }

  /**
   * This method forces the state to be updated when the props change
   * @param props The props passed
   * @param state The current state
   * @returns {*} The state items to update
   */
  static getDerivedStateFromProps (props, state) {
    if (props.items !== state.initialItems) {
      return {
        currentItems: props.items,
        initialItems: props.items
      }
    }
    return null
  }

  render () {
    const { currentItems } = this.state
    return (
      <div className='text-center'>
        <input className='filteredlist-search' type='text' placeholder='Search' onChange={this.handleFilterChange} />
        <List onItemClick={itemName => this.onItemClick(itemName)} items={currentItems} />
      </div>
    )
  }
}

FilteredList.propTypes = {
  items: PropTypes.array.isRequired,
  onItemClick: PropTypes.func.isRequired
}

List.propTypes = {
  items: PropTypes.array.isRequired,
  onItemClick: PropTypes.func.isRequired
}

export default FilteredList
