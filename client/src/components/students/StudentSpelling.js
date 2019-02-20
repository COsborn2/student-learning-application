import React from 'react'
import { Image } from 'react-bootstrap'
import './StudentSpelling.css'
import SpellingCard from './spelling/SpellingCard.js'
import DropZone from './spelling/DropZone.js'
import PropTypes from 'prop-types'
import ItemPreview from './spelling/ItemPreview.js'

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
      curDropZone: initializeDropZone(firstWordToSpell.length)
    }
    this.advanceToNextWord = this.advanceToNextWord.bind(this)
  }

  advanceToNextWord () {
    let { wordsToSpell, wordIndex, curWordToSpell, curImageURL, curHand, curDropZone } = this.state
    const allWordsSpelled = wordIndex >= wordsToSpell.length - 1
    wordIndex++
    if (!allWordsSpelled) {
      const nextWordItem = wordsToSpell[wordIndex]
      curWordToSpell = nextWordItem.word
      curImageURL = nextWordItem.imageURL
      curHand = getLetters(curWordToSpell)
      curDropZone = initializeDropZone(curWordToSpell.length)
      this.setState({ wordsToSpell, wordIndex, curWordToSpell, curImageURL, curHand, curDropZone })
    }
    this.props.onWordCompletion(wordIndex, allWordsSpelled)
  }

  renderButton (isSpelled) {
    const buttonStyle = 'btn btn-' + (isSpelled ? 'success' : 'secondary')
    return <button type='button' className={buttonStyle} onClick={this.advanceToNextWord}
      disabled={!isSpelled}>Continue</button>
    // return <button type='button' className='btn btn-danger' onClick={this.onResetClick}>Reset</button>
  }

  setDropZone = (dropZoneID, letterDropped, cardID) => {
    let { curDropZone, curHand, curWordToSpell } = this.state
    const expectedLetter = curWordToSpell[dropZoneID]

    curDropZone[dropZoneID] = letterDropped
    if (letterDropped === expectedLetter) curHand.splice(cardID, 1)

    this.setState({ curDropZone, curHand })
  }

  render () {
    const { curHand, curDropZone, curWordToSpell } = this.state
    const isSpelled = isWordSpelled(curDropZone, curWordToSpell)
    const button = this.renderButton(isSpelled)
    const status = getStatus(isSpelled, curWordToSpell)
    const letterCards = curHand.map((letter, i) => <SpellingCard key={i} id={i} letter={letter} />)
    const dropZoneCards = curWordToSpell.split('').map((letter, index) =>
      <DropZone id={index} key={index} onDrop={this.setDropZone} currentLetter={curDropZone[index]}
        expectedLetter={letter} />)

    return (
      <div className='container text-center'>
        <h1 color={'red'}>Spelling Cards!</h1>
        <h2 className='headerDND'>
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
        {button}
        <ItemPreview key='__preview' name='Item' />
      </div>)
  }
}

StudentSpelling.propTypes = {
  wordsToSpell: PropTypes.array.isRequired,
  onWordCompletion: PropTypes.func.isRequired
}

export default StudentSpelling
