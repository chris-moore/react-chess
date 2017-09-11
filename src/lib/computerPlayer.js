import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import { validMoves } from './validator';
import { randomize, getPiecesWithIndex } from './Helper';

function makeDumbMove(board, player, check = false) {
  console.log('[ComputerPlayer.makeDumbMove] board: ', board);
  console.log('[ComputerPlayer.makeDumbMove] player: ', player);
  const piecesWithIndex = getPiecesWithIndex(board);
  const pieces = filter(flatten(piecesWithIndex), { player });
  console.log('[ComputerPlayer.makeDumbMove] pieces: ', randomize(pieces));
  const totalPieces = pieces.length;
  let currentIndex = 0;
  let validMove = null;
  let currentPiece = null;

  do {
    currentPiece = pieces[currentIndex];
    const { row, column } = currentPiece;
    const moves = validMoves(currentPiece, board, row, column, check);
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
  static makeMove(board, player, check) {

    // Phase 1: select a random piece with moves, do one
    // Phase 2: find all moves for all pieces, do one
    // Phase 3: phase two, then take a piece, if available
    // Phase 4: phase two, then take higher ranked piece, otherwise defend by moving away

    return makeDumbMove(board, player, check);
  }
}
