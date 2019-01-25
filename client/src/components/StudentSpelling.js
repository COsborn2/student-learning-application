import React from 'react'
import './StudentSpelling.css'

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

function Card (props) {
  return (
    <div key={props.id}
      onClick={props.onClick}
      className='mx-auto col-md-1 card badge-success'>
      <h5 className='card-title card badge-light'>
        {props.value}
      </h5>
    </div>
  )
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

function DropZone(props)
{
  return(
    <div key={"dropzone" + props.id}
    className='col-md-1 mx-1 card badge-success'>Drag something here!</div>
  )
}

class StudentSpelling extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      wordToSpell: getWord(),
      reset: getLetters(getWord(), getUnlockedLetters(), 1),
      letters: [],
      words: []
    }
    this.state.letters = this.state.reset.slice()
  }

  onLetterClick = (id) => {
    var newWords = this.state.words
    newWords.push(this.state.letters[id])

    var newLetters = this.state.letters
    newLetters.splice(id, 1)

    this.setState({ letters: newLetters,
      words: newWords })
  }

  onWordClick = (id) => {
    var newLetters = this.state.letters
    newLetters.push(this.state.words[id])

    var newWords = this.state.words
    newWords.splice(id, 1)

    this.setState({ letters: newLetters,
      words: newWords })
  }

  onResetClick = () => {
    var reset = this.state.reset.slice()
    this.setState({ words: [], letters: reset })
  }

  renderCard (t, i, func) {
    return (
      <Card id={i}
        onClick={(e) => func(i)}
        value={t} />
    )
  }

  renderButton (YN) {
    if (YN) { return <button type='button' class='btn btn-success' onClick={() => alert('Working on it')}>Continue</button> }
    return <button type='button' class='btn btn-danger' onClick={this.onResetClick}>Reset</button>
  }

  render () {
    var complete = isComplete(this.state.words, this.state.wordToSpell)
    var lSpace = []
    var wSpace = []
    var button = this.renderButton(complete)
    var status = getStatus(complete, this.state.wordToSpell)

    this.state.letters.forEach((t, i) => {
      lSpace.push(
        this.renderCard(t, i, this.onLetterClick)
      )
    })

    this.state.words.forEach((t, i) => {
      wSpace.push(
        this.renderCard(t, i, this.onWordClick)
      )
    })

    return (
      <div className='container text-center'>
        <h1 color={'red'}>Spelling Cards!</h1>
        <h2 className='headerDND'>{status}</h2>

        <span>WordSpace</span>
        <div className='row ext-center'>
          <DropZone></DropZone>
          <DropZone></DropZone>
          <DropZone></DropZone>
          <DropZone></DropZone>
        </div>
        <span>Letter</span>
        <div className='row ext-center'>
          {lSpace}
        </div>
        {button}
      </div>)
  }
}

export default StudentSpelling
