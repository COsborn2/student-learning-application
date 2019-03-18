import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import '../../assets/css/instructorStyles.css'

/**
 * This serves as a simple list that is displayed
 */
const List = (props) => {
  return (
    <ul>
      {
        props.items.map((item, index) => {
          return <li className='filteredlist-item' key={index} onClick={() => props.onItemClick(item)}>{item}</li>
        })
      }
    </ul>
  )
}

/**
 * This serves as a simple list that displays the string items passed to it as a prop,
 * and calls the onItemClick prop and passes it the index of the item clicked. The filter
 * can be used to show less items and make selecting from a large list easier
 */
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

  /**
   * This is triggered every time the filter is changed
   * @param event The onChange event
   */
  handleFilterChange (event) {
    let updatedList = this.state.initialItems
    updatedList = updatedList.filter(item => {
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1
    })
    this.setState({ currentItems: updatedList })
  }

  /**
   * This method is called before every render. If the props have changed, update the state
   * @param props The props passed to this component
   * @param state The current component state
   * @returns {*} The state values to update or null if no update is required
   */
  static getDerivedStateFromProps (props, state) {
    if (props.items !== state.initialItems) {
      return { initialItems: props.items, currentItems: props.items }
    }
    return null
  }

  /**
   * This is triggered every time a list item is clicked. It calls the callback passed as a prop, passing the index of the item clicked
   * @param itemName The name of the item clicked
   */
  onItemClick (itemName) {
    const itemIndex = this.state.initialItems.indexOf(itemName)
    this.props.onItemClick(itemIndex)
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
