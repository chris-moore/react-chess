import React, { Component } from 'react';
import Validator from '../lib/validator';
import ComputerPlayer from '../lib/validator';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isMatch from 'lodash/isMatch';

function newTile(type = null, player) {
  const color = player === 'B' ? 'black' : 'white';
  const dom = (
    <div
      className={`f1-l f3 mt1 mt2-l ${color} icon-${type}`}
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
    [newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W'), newTile('p', 'W')],
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
  movePiece(board, currentRow, currentColumn, nextRow, nextColumn, turn) {
    const piece = board[currentRow][currentColumn];
    board[currentRow][currentColumn] = newTile();
    board[nextRow][nextColumn] = piece;
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
  clickSquare(tile, row, column, move) {
    const { player, type } = tile;
    const { board, moves, selectedSquare, turn } = this.state;
    const { x, y } = selectedSquare;

    // move a piece
    if (move && selectedSquare) {
      console.log('[Grid.clickSquare] board[row][column]: ', board[row][column]);
      console.log('[Grid.clickSquare] board[y][x]: ', board[y][x]);
      return this.movePiece(board, y, x, row, column, turn);

      // do computer move if their turn
      if (this.state.turn === 'B') {

      }
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
    const playerTurn = turn === 'W' ? 'Whites move' : 'Blacks move';

    return (
      <div className="grid">
        <h3>{playerTurn}</h3>
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
                    const playerStyle = turn === tile.player ? 'pointer' : '';
                    let bgColor = (indexX + (indexY % 2)) % 2 ? 'bg-gray' : 'bg-light-silver';
                    if (move) {
                      bgColor = 'bg-light-blue pointer'; // this is an available move
                    }
                    if (squareX === indexX && squareY === indexY) {
                      bgColor = 'bg-blue'; // this is the selected piece
                    }
                    return (
                      <div
                        key={key}
                        onClick={() => this.clickSquare(tile, indexY, indexX, move)}
                        className={`dib f7 w3-l w2 h3-l h2 v-mid ba b--white ${bgColor} ma0 ${playerStyle}`}
                      >
                        {tile.dom}
                      </div>
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
