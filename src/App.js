import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './routes/Home';
import Win from './routes/Win';
import './tachyons.css';
import './fonts.css';

const App = () =>
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/win" component={Win} />
  </Switch>;

export default App;
