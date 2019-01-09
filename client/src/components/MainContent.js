import React from 'react'
import { Switch, Route } from 'react-router-dom'
import HomeScreen from './HomeScreen'
import DragAndDrop from './DragAndDrop'

const MainContent = () => (
  <main>
    <Switch>
      <Route exact path='/' component={HomeScreen} />
      <Route path='/spelling' component={DragAndDrop} />
    </Switch>
  </main>
)

export default MainContent
