import React from 'react'
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import './StudentSpelling.css'

import SpellingCard from './spelling/SpellingCard.js'
import DropZone from './spelling/DropZone.js'

function getWord () {
  return 'kite'
}

function getUnlockedLetters () {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'z', 'y', 'z']
}

function isComplete (words, wordToSpell) {
  let w = ''
  words.forEach(function (e) {
    w += e
  })
  if (w === wordToSpell) { return true }
  return false
}

function getLetters (wordToSpell, unlockedLetters, extraCards) {
  var alphabet = unlockedLetters
  var letters = wordToSpell.split('')

  for (var i = 0; i < extraCards; i++) {
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)])
  }

  return shuffle(letters)
}

function shuffle (cards) {
  var j, x, i
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
  return 'Spell ' + word
}

function initializeDropZone(howMany)
{
  var dropZone = [];

  for (var i = 0; i < howMany; i++)
  {
    dropZone.push("[]");
  }
  return dropZone;
}

class StudentSpelling extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      wordToSpell: getWord(),
      reset: getLetters(getWord(), getUnlockedLetters(), 1),
      letters: [],
      dropZoneState: initializeDropZone(getWord().length),
    }
    this.state.letters = this.state.reset.slice()
  }

  onResetClick = () => {
    alert("Currently Broken")
    /*var reset = this.state.reset.slice()
    this.setState({letters: reset })*/
  }

  renderCard (t, i) {
    return (
      <SpellingCard id={i}
        value={t} />
    )
  }

  renderButton (YN) {
    if (YN) { return <button type='button' class='btn btn-success' onClick={() => alert('Working on it')}>Continue</button> }
    return <button type='button' class='btn btn-danger' onClick={this.onResetClick}>Reset</button>
  }

  setDropZone = (dropZoneID, data, cardID) =>
  {
    var updateDropZone = this.state.dropZoneState;
    var newLetters = this.state.letters;
    updateDropZone[dropZoneID] = data;
  
    if(updateDropZone[dropZoneID] === this.state.wordToSpell[dropZoneID])
    {
      newLetters.splice(cardID, 1)
    }

    this.setState({dropZoneState: updateDropZone})
    this.setState({letters: newLetters})
  }

  render () {
    var complete = isComplete(this.state.dropZoneState, this.state.wordToSpell)
    var renderLetterCards = []
    var button = this.renderButton(complete)
    var status = getStatus(complete, this.state.wordToSpell)
    var renderDropZone = []

    this.state.letters.forEach((t, i) => {
      renderLetterCards.push(
        this.renderCard(t, i)
      )
    })

    this.state.wordToSpell.split('').forEach((t, i) => {
      renderDropZone.push(<DropZone id={i} onDrop={this.setDropZone} passedLetter={this.state.dropZoneState[i]} setLetter={t}></DropZone>)
    })

    const { connectDragSource, connectDropTarget } = this.props
    return (
      <DragDropContextProvider backend={HTML5Backend}>
      <div className='container text-center'>
        <h1 color={'red'}>Spelling Cards!</h1>
        <h2 className='headerDND'>{status}</h2>
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
