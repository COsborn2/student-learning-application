import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HomeScreen from './HomeScreen'
import DragAndDrop from './DragAndDrop'

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={HomeScreen} />
      <Route path='/DragAndDrop' component={DragAndDrop} />
    </Switch>
  </main>
)

export default Main
