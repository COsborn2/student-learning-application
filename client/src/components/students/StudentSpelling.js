import React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import { Image } from 'react-bootstrap'
import HTML5Backend from 'react-dnd-html5-backend'
import './StudentSpelling.css'
import SpellingCard from './spelling/SpellingCard.js'
import DropZone from './spelling/DropZone.js'
import PropTypes from 'prop-types'

function isWordSpelled (curWord, wordToSpell) {
  return curWord.join('') === wordToSpell
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

/*
  We pass an array of wordObjects as a property. Each item in the array consists of a word, and an imageURL
  You can access them like shown below. When a word is completed move on to the next word.
  When the last word is completed, call the `onSpellingCompletion()` method passed as a property.
 */

class StudentSpelling extends React.Component {
  constructor (props) {
    super(props)
    let wordsToSpell = props.wordsToSpell
    let firstWordToSpell = wordsToSpell[0].word
    let imageURL = wordsToSpell[0].imageURL
    this.state = {
      wordsToSpell: wordsToSpell,
      wordToSpell: firstWordToSpell,
      imageURL: imageURL,
      curHand: getLetters(firstWordToSpell),
      curDropZone: initializeDropZone(firstWordToSpell.length)
    }
  }

  renderButton (isSpelled) {
    const buttonStyle = 'btn btn-' + (isSpelled ? 'success' : 'secondary')
    return <button type='button' className={buttonStyle} onClick={this.props.onSpellingCompletion} disabled={!isSpelled}>Continue</button>
    // return <button type='button' className='btn btn-danger' onClick={this.onResetClick}>Reset</button>
  }

  setDropZone = (dropZoneID, letterDropped, cardID) => {
    let { curDropZone, curHand, wordToSpell } = this.state
    const expectedLetter = wordToSpell[dropZoneID]

    curDropZone[dropZoneID] = letterDropped
    if (letterDropped === expectedLetter) curHand.splice(cardID, 1)

    this.setState({ curDropZone, curHand })
  }

  render () {
    const { curHand, curDropZone, wordToSpell } = this.state
    let isSpelled = isWordSpelled(curDropZone, wordToSpell)
    let button = this.renderButton(isSpelled)
    let status = getStatus(isSpelled, wordToSpell)
    let letterCards = curHand.map((letter, i) => <SpellingCard key={i} id={i} letter={letter} />)
    let dropZoneCards = wordToSpell.split('').map((letter, index) =>
      <DropZone id={index} key={index} onDrop={this.setDropZone} currentLetter={curDropZone[index]} expectedLetter={letter} />)

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div className='container text-center'>
          <h1 color={'red'}>Spelling Cards!</h1>
          <h2 className='headerDND'>
            {status}
            <Image className='img-fluid' alt='Responsive image' src={this.state.imageURL} />
          </h2>
          <span>DropZone</span>
          <div className='row'>
            {dropZoneCards}
          </div>
          <span>Letter Cards</span>
          <div className='row'>
            {letterCards}
          </div>
          {button}
        </div>
      </DragDropContextProvider>)
  }
}

StudentSpelling.propTypes = {
  wordsToSpell: PropTypes.array.isRequired,
  onSpellingCompletion: PropTypes.func.isRequired
}

export default StudentSpelling
