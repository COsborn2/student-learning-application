import React from 'react'
import { Image } from 'react-bootstrap'
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

function getLetters (wordToSpell, extraLetters) {
  let letters = wordToSpell.split('')

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
  We pass an array of wordObjects as a property. Each item in the array consists of a word, and an imageURL
  You can access them like shown below. When a word is completed move on to the next word.
  When each word is completed, call the `onWordCompletion()` method passed as a property.
 */

class StudentSpelling extends React.Component {
  constructor (props) {
    super(props)
    let wordsToSpell = props.wordsToSpell
    let firstWordToSpell = wordsToSpell[0].word
    this.state = {
      wordsToSpell: wordsToSpell,
      wordIndex: 0,
      curWordToSpell: firstWordToSpell,
      curImageURL: wordsToSpell[0].imageURL,
      curHand: getLetters(firstWordToSpell),
      curDropZone: initializeDropZone(firstWordToSpell.length),
      dropOrder: [],
      timeEvents: initializeTimeEvents(),
      lockScroll: false }
    this.advanceToNextWord = this.advanceToNextWord.bind(this)
  }

  advanceToNextWord () {
    let { wordsToSpell, wordIndex, curWordToSpell, curImageURL, curHand, curDropZone, dropOrder, timeEvents } = this.state
    const allWordsSpelled = wordIndex >= wordsToSpell.length - 1
    wordIndex++
    if (!allWordsSpelled) {
      const nextWordItem = wordsToSpell[wordIndex]
      curWordToSpell = nextWordItem.word
      curImageURL = nextWordItem.imageURL
      curHand = getLetters(curWordToSpell)
      curDropZone = initializeDropZone(curWordToSpell.length)
      dropOrder = []
      timeEvents = initializeTimeEvents()
      this.setState({ wordsToSpell, wordIndex, curWordToSpell, curImageURL, curHand, curDropZone, dropOrder, timeEvents })
    }
    this.props.onWordCompletion(wordIndex, allWordsSpelled)
  }

  renderButton (isSpelled) {
    const buttonStyle = 'mx-auto btn btn-' + (isSpelled ? 'success' : 'secondary')
    return <button type='button' className={buttonStyle} onClick={this.advanceToNextWord}
      disabled={!isSpelled}>Continue</button>
    // return <button type='button' className='btn btn-danger' onClick={this.onResetClick}>Reset</button>
  }

  setDropZone = (dropZoneID, letterDropped, cardID) => {
    let { curDropZone, curHand, curWordToSpell, dropOrder, timeEvents } = this.state
    const expectedLetter = curWordToSpell[dropZoneID]

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
    const { curHand, curDropZone, curWordToSpell } = this.state
    const isSpelled = isWordSpelled(curDropZone, curWordToSpell)
    const button = this.renderButton(isSpelled)
    const status = getStatus(isSpelled, curWordToSpell)
    const letterCards = curHand.map((letter, i) => <SpellingCard key={i} id={i} letter={letter} lockScroll={this.lockScroll} unlockScroll={this.unlockScroll} />)
    const dropZoneCards = curWordToSpell.split('').map((letter, index) =>
      <DropZone id={index} key={index} onDrop={this.setDropZone} currentLetter={curDropZone[index]}
        expectedLetter={letter} />)

    return (

      <div className='mx-auto text-center align-middle' style={{ background: '#b9d5e0', width: '90%', paddingTop: '0', marginTop: '0' }}>
        <div className='mb-5' style={{ background: '#7eaec5', color: 'white', height: '11vh', margin: '0' }}>
          <h1 className='display-4 font-weight-bold' style={{ fontSize: '4vh', margin: '0', paddingTop: '3vh' }}>Student Spelling</h1>
        </div>
        
        <ItemPreview key='__preview' name='Item' />
        <h2 className='jumbotron bg-info'>
          {status}
          <Image className='img-fluid' alt='Responsive image' src={this.state.curImageURL} />
        </h2>
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
      </div>
    )
  }
}

StudentSpelling.propTypes = {
  wordsToSpell: PropTypes.array.isRequired,
  onWordCompletion: PropTypes.func.isRequired
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(StudentSpelling)
