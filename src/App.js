import React, { Component } from 'react';
import './App.css';
import { Route, Switch} from 'react-router-dom';
import Home from './components/Home/Home';
import Private from './components/Private/Private';

class App extends Component {
  render() {
    return (
      <div className="">
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/private' component={Private} />
        </Switch>
      </div>
    );
  }
}

export default App;
