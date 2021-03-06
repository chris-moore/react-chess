import React, { Component } from 'react';
import Link from 'react-router-dom/Link';
import Grid from '../components/Grid';

class Home extends Component {
  render() {
    return (
      <div className="home sans-serif pa4">
        <Link to="/win">WIN NOW</Link>
        <div className="ma3 center">
          <Grid />
        </div>
      </div>
    );
  }
}

export default Home;
