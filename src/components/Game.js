import React, { Component } from 'react';
import Grid from './Grid';

class Game extends Component {
  render() {

    return (
      <div className="game">
        This is the game.
        <Grid />
      </div>
    );
  }
}

export default Game;
