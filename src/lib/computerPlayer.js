import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import Validator from './validator';

function randomize(a) {
	let i = a.length;
	if (i == 0) {
		return null;
	}
	while (--i) {
		let j = Math.floor(Math.random() * (i + 1));
		let tmp1 = a[i];
		let tmp2 = a[j];
		a[i] = tmp2;
		a[j] = tmp1;
	}
	return a;
}

function makeDumbMove(board, player) {
  console.log('[ComputerPlayer.makeDumbMove] board: ', board);
  console.log('[ComputerPlayer.makeDumbMove] player: ', player);
  const piecesWithIndex = board.map((row, indexY) => {
    return row.map((tile, indexX) => {
      return {
        ...tile,
        row: indexY,
        column: indexX
      }
    });
  });
  const pieces = filter(flatten(piecesWithIndex), { player });
  console.log('[ComputerPlayer.makeDumbMove] pieces: ', randomize(pieces));
  const totalPieces = pieces.length;
  let currentIndex = 0;
  let validMove = null;
  let currentPiece = null;

  do {
    currentPiece = pieces[currentIndex];
    const { row, column } = currentPiece;
    const moves = Validator.validMoves(currentPiece, board, row, column);
    if (moves.length) {
      console.log('[ComputerPlayer.makeDumbMove] currentPiece: ', currentPiece);
      validMove = moves[0];
      break;
    }
    currentIndex++;
  }
  while(currentIndex < totalPieces || !validMove);
  console.log('[ComputerPlayer.makeDumbMove] validMove: ', validMove);
  return {
    currentRow: currentPiece.row,
    currentColumn: currentPiece.column,
    nextRow: validMove.row,
    nextColumn: validMove.column
  };
}

export default class ComputerPlayer {
  static makeMove(board, player) {

    // Phase 1: select a random piece with moves, do one
    // Phase 2: find all moves for all pieces, do one
    // Phase 3: phase two, then take a piece, if available
    // Phase 4: phase two, then take higher ranked piece, otherwise defend by moving away

    return makeDumbMove(board, player);
  }
}
