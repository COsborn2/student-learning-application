import React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import { Image } from 'react-bootstrap'
import HTML5Backend from 'react-dnd-html5-backend'
import './StudentSpelling.css'
import SpellingCard from './spelling/SpellingCard.js'
import DropZone from './spelling/DropZone.js'

function getWord () {
  return 'kite'
}

function getUnlockedLetters () {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'z', 'y', 'z']
}

function getSpellingPicture () {
  return 'https://www.lifebreeze.co.uk/product_images/27.gif'
}

function isComplete (words, wordToSpell) {
  let w = ''
  words.forEach(function (e) {
    w += e
  })
  if (w === wordToSpell) { return true }
  return false
}

function getLetters (wordToSpell, unlockedLetters, extraLetters) {
  let alphabet = unlockedLetters
  let letters = wordToSpell.split('')

  if (extraLetters !== null) {
    for (var i = 0; i < extraLetters.length; i++) {
      letters.push(extraLetters[i])
    }
  }

  return shuffle(letters)
}

function shuffle (cards) {
  let j, x, i
  for (i = cards.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = cards[i]
    cards[i] = cards[j]
    cards[j] = x
  }
  return cards
}

function getStatus (YN, word) {
  if (YN) { return 'Congrats!' }
  return 'Spell this image'
}

function initializeDropZone (howMany) {
  let dropZone = []

  for (let i = 0; i < howMany; i++) {
    dropZone.push('[]')
  }
  return dropZone
}

class StudentSpelling extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      wordToSpell: getWord(),
      initualHand: [],
      currentHand: getLetters(getWord(), getUnlockedLetters(), null),
      dropZoneState: initializeDropZone(getWord().length),
      spellingPicture: getSpellingPicture()
    }
    // this.state.currentHand = this.state.initualHand.slice()
  }

  /* onResetClick = () => {
    this.setState({currentHand: getLetters(getWord(), getUnlockedLetters(), null),
                    dropZoneState: initializeDropZone(getWord().length)})
  } */

  renderCard (t, i) {
    return (
      <SpellingCard id={i}
        value={t} />
    )
  }

  renderButton (YN) {
    if (YN) {
      return <button type='button' className='btn btn-success' onClick={() => alert('Working on it')}>Continue</button>
    }
    return <button type='button' className='btn btn-secondary'>Continue</button>
    // return <button type='button' className='btn btn-danger' onClick={this.onResetClick}>Reset</button>
  }

  setDropZone = (dropZoneID, data, cardID) => {
    let updateDropZone = this.state.dropZoneState
    let newLetters = this.state.currentHand

    if (updateDropZone[dropZoneID] !== this.state.wordToSpell[dropZoneID]) {
      updateDropZone[dropZoneID] = data
      if (data === this.state.wordToSpell[dropZoneID]) {
        newLetters.splice(cardID, 1)
      }
    }

    this.setState({ dropZoneState: updateDropZone })
    this.setState({ currentHand: newLetters })
  }

  render () {
    let complete = isComplete(this.state.dropZoneState, this.state.wordToSpell)
    let renderLetterCards = []
    let button = this.renderButton(complete)
    let status = getStatus(complete, this.state.wordToSpell)
    let renderDropZone = []

    this.state.currentHand.forEach((t, i) => {
      renderLetterCards.push(
        this.renderCard(t, i)
      )
    })

    this.state.wordToSpell.split('').forEach((t, i) => {
      renderDropZone.push(<DropZone id={i} onDrop={this.setDropZone} passedLetter={this.state.dropZoneState[i]} setLetter={t} />)
    })

    const { connectDragSource, connectDropTarget } = this.props
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className='container text-center'>
          <h1 color={'red'}>Spelling Cards!</h1>
          <h2 className='headerDND'>{status}<Image className='img-fluid' alt='Responsive image' src={this.state.spellingPicture} /></h2>
          <span>DropZone</span>
          <div className='row ext-center'>
            {renderDropZone}
          </div>
          <span>Letter Cards</span>
          <div className='row ext-center'>
            {renderLetterCards}
          </div>
          {button}
        </div>
      </DragDropContextProvider>)
  }
}

export default StudentSpelling
