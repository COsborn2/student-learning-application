import React from 'react'
import './DragAndDrop.css'

function isComplete (words, wordToSpell) {
  let w = ''
  console.log('Passed in: ' + words)
  words.forEach(function (e) {
    w += e
  })
  console.log('Output: ' + w)
  if (w === wordToSpell) { return true }
  return false
}

function getLetters (wordToSpell) {
  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'z', 'y', 'z']
  var letters = []

  wordToSpell.forEach(function (e) {
    letters.push(alphabet[alphabet.indexOf(e)])
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)])
  })

  return shuffle(letters)
}

function Card (props) {
  return (
    <div key={props.id}
      onClick={props.onClick}
      className='cardDND'>
      <div className='letterHolderDND'>
        {props.value}
      </div>
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

class DragAndDrop extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      wordToSpell: 'bear',
      letters: getLetters(['b', 'e', 'a', 'r']),
      words: []
    }

  }

  onLetterClick = (id) => {
    console.log(id)

    this.state.words.push(this.state.letters[id])
    this.state.letters.splice(id, 1)

    console.log(this.state.letters)
    console.log(this.state.words)

    this.setState({ letters: this.state.letters,
      words: this.state.words })

    console.log(isComplete(this.state.words, this.state.wordToSpell))
  }

  onWordClick = (id) => {
    console.log(id)

    this.state.letters.push(this.state.words[id])
    this.state.words.splice(id, 1)

    console.log(this.state.letters)
    console.log(this.state.words)

    this.setState({ letters: this.state.letters,
      words: this.state.words })
  }

  renderCard (t, i, func) {
    return (
      <Card id={i}
        onClick={(e) => func(i)}
        value={t} />
    )
  }

  render () {
    var lSpace = []
    var wSpace = []

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

    let status
    if (!isComplete(this.state.words, this.state.wordToSpell)) {
      status = 'Spell: ' + this.state.wordToSpell
    } else {
      status = 'You did it!'
    }

    return (
      <div className='container-dragDND'>
        <h1 color={'red'}>hello</h1>
        <h2 className='headerDND'>{status}</h2>

        <span>WordSpace</span>
        <div className='droppableDND'
          onDragOver={(e) => this.onDragOver(e)}
          onDrop={(e) => this.onDrop(e, 'WordSpace')}>
          {wSpace}
        </div>
        <span>Letter</span>
        <div className='LetterDND'
          onDragOver={(e) => this.onDragOver(e)}
          onDrop={(e) => this.onDrop(e, 'Letter')}
        >
          {lSpace}
        </div>
      </div>)
  }
}

export default DragAndDrop
