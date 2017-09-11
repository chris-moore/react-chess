import React, { Component } from 'react';
import { doCastle, doMove, generateBoard, isCheck, newTile, validMoves } from '../lib/validator';
import ComputerPlayer from '../lib/computerPlayer';
import delay from 'lodash/delay';
import find from 'lodash/find';
import filter from 'lodash/filter';
import isMatch from 'lodash/isMatch';
import { v4 as uuid } from 'uuid';

class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: generateBoard(),
      check: false,
      computer: 'B',
      history: [],
      human: 'W',
      moves: null,
      selectedSquare: { column: null, row: null },
      turn: 'W',
    }
  }
  componentDidMount() {
    const { board, computer, turn } = this.state;
    if (turn === computer) {
      this.doComputerMove(board, computer, turn);
    }
  }
  doComputerMove(board, computer, turn, check = false) {
    const moveDelay = check ? 10 : 800;
    delay(() => {
      const cpMove = ComputerPlayer.makeMove(board, computer, check);
      this.movePiece(
        board,
        cpMove.currentRow,
        cpMove.currentColumn,
        cpMove.nextRow,
        cpMove.nextColumn,
        turn
      );
      this.setState({
        turn: this.state.human
      });
    }, moveDelay);
  }
  movePiece(currentBoard, currentRow, currentColumn, nextRow, nextColumn, turn) {
    const previousHistory = this.state.history;
    const piece = currentBoard[currentRow][currentColumn];
    const board = doMove(currentBoard, currentRow, currentColumn, nextRow, nextColumn);

    // check for check
    const check = isCheck(board, turn);
    const nextState = {
      board,
      check,
      history: [
        ...previousHistory,
        {
          row: nextRow,
          column: nextColumn,
          player: piece.player,
          type: piece.type
        }
      ],
      moves: null,
      selectedSquare: {
        column: null,
        row: null
      },
      turn: turn === 'W' ? 'B' : 'W',
    }

    this.setState(nextState);
    return nextState;
  }
  clickSquare(tile, clickRow, clickColumn, move) {
    const { player, type } = tile;
    const { board, computer, human, moves, selectedSquare, turn } = this.state;
    const { row, column } = selectedSquare;

    // move a piece
    if (move && selectedSquare && turn === human) {
      const nextState = this.movePiece(board, row, column, clickRow, clickColumn, turn);
      console.log('[Grid.clickSquare] nextState: ', nextState);
      // do computer move right after
      this.doComputerMove(board, computer, this.state.turn, nextState.check);
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
      moves: validMoves(tile, board, clickRow, clickColumn),
      selectedSquare: {
        column: clickColumn,
        row: clickRow
      }
    });
  }
  render() {
    const { board, check, history, human, moves, selectedSquare, turn } = this.state;
    const playerTurn = turn === 'W' ? 'White to move' : 'Black to move';
    const checkStr = check ? 'CHECK!' : null;

    return (
      <div className="grid relative">
        <h3>{playerTurn} {checkStr}</h3>
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
                        <div
                          className={`f1-l f3 mt1 mt2-l ${tile.color} icon-${tile.type}`}
                        ></div>
                      </div>
                    )}
                  )}
                </div>
              )
            })
          }
        </div>
        <div className="absolute-l top-0 left-0 pa4 code gray">
          {history.map(item => <div key={uuid()}>{item.player}: {item.type} {item.row} {item.column}</div>)}
        </div>
      </div>
    );
  }
}

export default Grid;
