import React, { Component } from 'react';
import Validator from '../lib/validator';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isMatch from 'lodash/isMatch';

function newTile(type = null, player) {
  const color = player === 'B' ? 'black' : 'white';
  const dom = (
    <div
      className={`f1-l f3 mt1 mt2-l ${color} icon-${type} pointer`}
      onClick={() => console.log('[Grid.newTile] type: ', type)}
    ></div>
  );
  return {
    type,
    player,
    dom
  }
}

function generateBoard() {
  return [
    [newTile('r', 'B'), newTile('n', 'B'), newTile('b', 'B'), newTile('q', 'B'), newTile('k', 'B'), newTile('b', 'B'), newTile('n', 'B'), newTile('r', 'B')],
    [newTile('p', 'B'), newTile('p', 'B'), newTile('p', 'B'), newTile('p', 'B'), newTile('p', 'B'), newTile('p', 'B'), newTile('p', 'B'), newTile('p', 'B')],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()], // extra blanks
    //[newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W')],
    [newTile('r', 'W'), newTile('n', 'W'), newTile('b', 'W'), newTile('q', 'W'), newTile('k', 'W'), newTile('b', 'W'), newTile('n', 'W'), newTile('r', 'W')]
  ];
}

class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: generateBoard(),
      turn: 'W',
      selectedSquare: { x: null, y: null },
      moves: null
    }
  }
  clickSquare(tile, row, column, move) {
    const { player, type } = tile;
    const { board, moves, selectedSquare, turn } = this.state;
    const { x, y } = selectedSquare;
    console.log('[Grid.clickSquare] player: ' + player + ' row: ' + row +  ' column: ' + column);
    console.log('[Grid.clickSquare] selectedSquare: ', selectedSquare);
    console.log('[Grid.clickSquare] moves: ', moves);
    console.log('[Grid.clickSquare] move: ', move);

    // move a piece
    if (move && selectedSquare) {
      console.log('[Grid.clickSquare] board[row][column]: ', board[row][column]);
      console.log('[Grid.clickSquare] board[y][x]: ', board[y][x]);
      const piece = board[y][x];
      board[y][x] = newTile();
      board[row][column] = piece;
      console.log('[Grid.clickSquare] board[row][column]: ', board[row][column]);
      return this.setState({
        selectedSquare: {
          x: null,
          y: null
        },
        moves: null,
        board,
        turn: turn === 'W' ? 'B': 'W'
      });
    }

    // deselect a selected piece
    if (turn !== player || !type || (row === y && column === x)) {
      return this.setState({
        selectedSquare: {
          x: null,
          y: null
        },
        moves: null
      });
    }

    // select a piece
    return this.setState({
      moves: Validator.validMoves(tile, board, row, column),
      selectedSquare: {
        x: column,
        y: row
      }
    });
  }
  render() {
    const { board, moves, selectedSquare, turn } = this.state;

    return (
      <div className="grid">
        <div className="mv4 center tc ">
          {
            board.map((row, indexY) => {
              return (
                <div key={indexY} className="">
                  {row.map((tile, indexX) => {
                    const key = `tile${indexY}${indexX}`;
                    const squareX = selectedSquare.x;
                    const squareY = selectedSquare.y;
                    const move = find(moves, { x: indexX, y: indexY });
                    let bgColor = (indexX + (indexY % 2)) % 2 ? 'bg-gray' : 'bg-light-silver';
                    if (move) {
                      bgColor = 'bg-light-blue';
                    }
                    if (squareX === indexX && squareY === indexY) {
                      bgColor = 'bg-blue';
                    }
                    return (
                      <div
                        key={key}
                        onClick={() => this.clickSquare(tile, indexY, indexX, move)}
                        className={`dib f7 w3-l w2 h3-l h2 v-mid ba b--white ${bgColor} ma0`}
                      >{indexX} {indexY} {tile.dom}</div>
                    )}
                  )}
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default Grid;