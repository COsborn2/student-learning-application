import React from 'react'
import SpellingCard from './spelling/SpellingCard.js'
import DropZone from './spelling/DropZone.js'
import PropTypes from 'prop-types'
import ItemPreview from './spelling/ItemPreview.js'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'
import ScrollLock from 'react-scrolllock'

function isWordSpelled (curWordArray, wordToSpell) {
  return curWordArray.join('') === wordToSpell
}

function getLetters (word, extraLetters) {
  let letters = word.split('')

  if (extraLetters) {
    for (let i = 0; i < extraLetters.length; i++) {
      letters.push(extraLetters[i])
    }
  }

  return shuffle(letters)
}

function shuffle (cards) {
  let j, x, i
  for (i = 0; i < cards.length - 1; i++) {
    j = Math.floor(Math.random() * (i + 1))
    x = cards[i]
    cards[i] = cards[j]
    cards[j] = x
  }
  return cards
}

function getStatus (isSpelled) {
  return isSpelled ? 'Congrats!' : 'Spell this image'
}

function initializeDropZone (numCharsInWord) {
  let dropZone = []
  for (let i = 0; i < numCharsInWord; i++) { dropZone.push('_') }
  return dropZone
}

function initializeTimeEvents () {
  let timeEvents = []
  timeEvents.push(new Date().getTime())
  return timeEvents
}

// Commented out to comply with coding standards. Didnt want to get rid of it as we still need them for stat tracking once we can send stuff to the back end
/*
function calculateWrongMove (dropOrder, wordToSpell) {
  let count = 0
  for (let i = 0; i < dropOrder.length; i = i + 2) {
    if (dropOrder[i + 1] !== wordToSpell[dropOrder[i]]) {
      count++
    }
  }
  return count
}

function calculateTotalTime (timeEvents) {
  return (timeEvents[timeEvents.length - 1] - timeEvents[0])
}

function debugConvertToMinutes (time) {
  return time / 1000 / 60
}
*/
/*
  We pass an array of wordObjects as a property. Each item in the array consists of a word, and an picture
  You can access them like shown below. When a word is completed move on to the next word.
  When each word is completed, call the `onWordCompletion()` method passed as a property.
 */

class StudentSpelling extends React.Component {
  constructor (props) {
    super(props)
    const wordToSpell = this.props.wordToSpell.text
    const imageUrl = this.props.wordToSpell.picture
    this.state = {
      wordToSpell: wordToSpell,
      imageUrl: imageUrl,
      curHand: getLetters(wordToSpell),
      curDropZone: initializeDropZone(wordToSpell.length),
      dropOrder: [],
      timeEvents: initializeTimeEvents(),
      lockScroll: false }
    this.resetToNextWord = this.resetToNextWord.bind(this)
  }

  componentWillMount () { this._isMounted = true }

  componentWillUnmount () { this._isMounted = false }

  async resetToNextWord () {
    await this.props.onWordCompletion()

    if (this._isMounted) {
      let { wordToSpell, imageUrl, curHand, curDropZone, dropOrder, timeEvents } = this.state
      wordToSpell = this.props.wordToSpell.text
      imageUrl = this.props.wordToSpell.picture
      curHand = getLetters(wordToSpell)
      curDropZone = initializeDropZone(wordToSpell.length)
      dropOrder = []
      timeEvents = initializeTimeEvents()
      this.setState({ wordToSpell, imageUrl, curHand, curDropZone, dropOrder, timeEvents })
    }
  }

  renderButton (isSpelled) {
    const buttonStyle = 'mx-auto btn btn-' + (isSpelled ? 'success' : 'secondary')
    return <button type='button' className={buttonStyle} onClick={this.resetToNextWord}
      disabled={!isSpelled}>Continue</button>
    // return <button type='button' className='btn btn-danger' onClick={this.onResetClick}>Reset</button>
  }

  setDropZone = (dropZoneID, letterDropped, cardID) => {
    let { curDropZone, curHand, wordToSpell, dropOrder, timeEvents } = this.state
    const expectedLetter = wordToSpell[dropZoneID]

    dropOrder.push(dropZoneID)
    dropOrder.push(letterDropped)
    timeEvents.push(new Date().getTime())

    if (curDropZone[dropZoneID] !== expectedLetter) curDropZone[dropZoneID] = letterDropped
    if (curDropZone[dropZoneID] === expectedLetter && letterDropped === expectedLetter) curHand.splice(cardID, 1)

    this.setState({ curDropZone, curHand, dropOrder, timeEvents })
  }

  lockScroll = () => {
    this.setState({ lockScroll: true })
  }

  unlockScroll = () => {
    this.setState({ lockScroll: false })
  }

  render () {
    const { curHand, curDropZone, wordToSpell, imageUrl } = this.state
    const isSpelled = isWordSpelled(curDropZone, wordToSpell)
    const button = this.renderButton(isSpelled)
    const status = getStatus(isSpelled, wordToSpell)
    const letterCards = curHand.map((letter, i) => <SpellingCard key={i} id={i} letter={letter} lockScroll={this.lockScroll} unlockScroll={this.unlockScroll} />)
    const dropZoneCards = wordToSpell.split('').map((letter, index) =>
      <DropZone id={index} key={index} onDrop={this.setDropZone} currentLetter={curDropZone[index]}
        expectedLetter={letter} />)

    return (

      <div className='mx-auto text-center align-middle' style={{ background: '#b9d5e0', width: '90%', marginTop: '0', minHeight: '100%', paddingBottom: '5%' }}>

        <div className='mx-auto' style={{ width: '55%', padding: '5%', paddingBottom: '2%' }}>
          <div style={{ background: '#4085bd', width: '100%', padding: '3%', boxShadow: '10px 10px 5px 1px #6b6b6b' }}>
            <div className='mx-auto' style={{ background: 'white', margin: 'auto' }}>
              <img src={imageUrl} alt='To Spell' style={{ maxWidth: '80%', maxHeight: '80%', marginTop: '2%', marginBottom: '2%' }} />
            </div>
          </div>
        </div>

        <h1 className='mx-auto' style={{ color: '#4085bd' }}>{status}</h1>

        <ItemPreview key='__preview' name='Item' />
        <span>DropZone</span>
        <div className='row'>
          {dropZoneCards}
        </div>
        <span>Letter Cards</span>
        <div className='row'>
          {letterCards}
        </div>
        <div className='row'>
          {button}
        </div>
        <ScrollLock isActive={this.state.lockScroll} />

      </div> // closing div tag
    )
  }
}

StudentSpelling.propTypes = {
  wordToSpell: PropTypes.object.isRequired,
  onWordCompletion: PropTypes.func.isRequired
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(StudentSpelling)
