import React, { Component } from 'react';
import Validator from '../lib/validator';
import ComputerPlayer from '../lib/computerPlayer';
import delay from 'lodash/delay';
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
      selectedSquare: { column: null, row: null },
      moves: null,
      human: 'W',
      computer: 'B',
      history: []
    }
  }
  movePiece(board, currentRow, currentColumn, nextRow, nextColumn, turn) {
    const previousHistory = this.state.history;
    const piece = board[currentRow][currentColumn];
    board[currentRow][currentColumn] = newTile();
    board[nextRow][nextColumn] = piece;
    return this.setState({
      selectedSquare: {
        column: null,
        row: null
      },
      moves: null,
      board,
      turn: turn === 'W' ? 'B' : 'W',
      history: [
        ...previousHistory,
        {
          row: nextRow,
          column: nextColumn,
          player: piece.player,
          type: piece.type
        }
      ]
    });
  }
  clickSquare(tile, clickRow, clickColumn, move) {
    const { player, type } = tile;
    const { board, computer, human, moves, selectedSquare, turn } = this.state;
    const { row, column } = selectedSquare;

    // move a piece
    if (move && selectedSquare && turn === human) {
      this.movePiece(board, row, column, clickRow, clickColumn, turn);

      // do computer move right after
      delay(() => {
        const cpMove = ComputerPlayer.makeMove(board, computer);
        this.movePiece(
          board,
          cpMove.currentRow,
          cpMove.currentColumn,
          cpMove.nextRow,
          cpMove.nextColumn,
          this.state.turn
        );
      }, 1000);
      return;
    }

    // deselect a selected piece
    if (turn !== player || !type || (clickRow === row && clickColumn === column)) {
      return this.setState({
        selectedSquare: {
          column: null,
          row: null
        },
        moves: null
      });
    }

    // select a piece
    return this.setState({
      moves: Validator.validMoves(tile, board, clickRow, clickColumn),
      selectedSquare: {
        column: clickColumn,
        row: clickRow
      }
    });
  }
  render() {
    const { board, history, human, moves, selectedSquare, turn } = this.state;
    const playerTurn = turn === 'W' ? 'White to move' : 'Black to move';

    return (
      <div className="grid relative">
        <h3>{playerTurn}</h3>
        <div className="mv4 center tc ">
          {
            board.map((row, indexRow) => {
              const boardOpaque = turn === human ? '' : 'o-80';
              return (
                <div key={indexRow} className={`${boardOpaque}`}>
                  {row.map((tile, indexColumn) => {
                    const key = `tile${indexRow}${indexColumn}`;
                    const squareColumn = selectedSquare.column;
                    const squareRow = selectedSquare.row;
                    const move = find(moves, { row: indexRow, column: indexColumn });
                    const playerStyle = turn === tile.player ? 'pointer' : '';
                    let bgColor = (indexRow + (indexColumn % 2)) % 2 ? 'bg-gray' : 'bg-light-silver';
                    if (move) {
                      bgColor = 'bg-light-blue pointer'; // this is an available move
                    }
                    if (squareRow === indexRow && squareColumn === indexColumn) {
                      bgColor = 'bg-blue'; // this is the selected piece
                    }
                    return (
                      <div
                        key={key}
                        onClick={() => this.clickSquare(tile, indexRow, indexColumn, move)}
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
        <div className="absolute-l top-0 left-0 pa4">
          {history.map(item => <div>{item.player}: {item.type} {item.row} {item.column}</div>)}
        </div>
      </div>
    );
  }
}

export default Grid;
