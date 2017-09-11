import inRange from 'lodash/inRange';
import filter from 'lodash/filter';
import flatten from 'lodash/flatten';
import every from 'lodash/every';
import find from 'lodash/find';
import { onBoard, getPiecesWithIndex } from './Helper';

function pawnMoves(piece, board, row, column) {
  const direction = piece.player === 'W' ? -1 : 1;
  const forwardRow = row + direction;
  const left = column - 1;
  const right = column + 1;
  const forwardTwo = row + (direction * 2);
  const initialPosition = !piece.history.length;
  const potentials = [];

  // one forward
  if (board[forwardRow][column].type === null) {
    potentials.push({ column: column, row: forwardRow, type: null });
  }
  // opening two space
  if (potentials.length && onBoard(forwardTwo) && !board[forwardTwo][column].type && initialPosition) {
    potentials.push({ column: column, row: forwardTwo, type: null });
  }
  // take a piece to the left
  const leftPiece = board[forwardRow][left];
  if (onBoard(left) && onBoard(forwardRow) && leftPiece.type && leftPiece.player !== piece.player) {
    potentials.push({ column: left, row: forwardRow, type: leftPiece.type });
  }
  // take a piece to the right
  const rightPiece = board[forwardRow][right];
  if (onBoard(right) && onBoard(forwardRow) && rightPiece.type && rightPiece.player !== piece.player) {
    potentials.push({ column: right, row: forwardRow, type: rightPiece.type });
  }
  return potentials;
}

function moveDirection(piece, board, row, column, dirRow, dirColumn, single) {
  const potentials = [];
  row += dirRow;
  column += dirColumn;
  while (onBoard(row) && onBoard(column)) {
    const checkSquare = board[row][column];
    // empty space
    if (!checkSquare.type) {
      potentials.push({ column: column, row: row, type: null });
      row += dirRow;
      column += dirColumn;
    }
    // piece can be taken
    else if (checkSquare.player !== piece.player) {
      potentials.push({ column: column, row: row, type: checkSquare.type });
      break;
    } else {
      break;
    }
    if (single) {
      break;
    }
  };
  return potentials;
}

function bishopMoves(piece, board, row, column) {
  const upLeft = moveDirection(piece, board, row, column, -1, -1);
  const upRight = moveDirection(piece, board, row, column, 1, -1);
  const downRight = moveDirection(piece, board, row, column, 1, 1);
  const downLeft = moveDirection(piece, board, row, column, -1, 1);
  return [
    ...upLeft,
    ...upRight,
    ...downLeft,
    ...downRight
  ];
}

function rookMoves(piece, board, row, column) {
  const up = moveDirection(piece, board, row, column, 0, -1);
  const left = moveDirection(piece, board, row, column, -1, 0);
  const right = moveDirection(piece, board, row, column, 1, 0);
  const down = moveDirection(piece, board, row, column, 0, 1);
  return [
    ...up,
    ...left,
    ...down,
    ...right
  ];
}

function knightMoves(piece, board, row, column) {
  const allMoves = [
    { column: column + 1, row: row + 2 },
    { column: column + 1, row: row - 2 },
    { column: column - 1, row: row + 2 },
    { column: column - 1, row: row - 2 },
    { column: column + 2, row: row + 1 },
    { column: column + 2, row: row - 1 },
    { column: column - 2, row: row + 1 },
    { column: column - 2, row: row - 1 }
  ];
  const boardMoves = allMoves.filter(obj => onBoard(obj.column) && onBoard(obj.row));
  const validMoves = boardMoves.filter((obj) => {
    const checkSquare = board[obj.row][obj.column];
    return checkSquare.player !== piece.player;
  });
  return validMoves.map((move) => {
    return { column: move.column, row: move.row, type: board[move.row][move.column].type }
  });
}

function kingMoves(piece, board, row, column, check) {
  const upLeft = moveDirection(piece, board, row, column, -1, -1, true);
  const upRight = moveDirection(piece, board, row, column, 1, -1, true);
  const downRight = moveDirection(piece, board, row, column, 1, 1, true);
  const downLeft = moveDirection(piece, board, row, column, -1, 1, true);
  const up = moveDirection(piece, board, row, column, 0, -1, true);
  const left = moveDirection(piece, board, row, column, -1, 0, true);
  const right = moveDirection(piece, board, row, column, 1, 0, true);
  const down = moveDirection(piece, board, row, column, 0, 1, true);
  const kingNotMoved = !piece.history.length;
  let castles = [];
  if (kingNotMoved && !check) {
    const indexBoard = getPiecesWithIndex(board);
    const playerRooks = filter(flatten(indexBoard), { player: piece.player, type: 'r' });
    playerRooks.forEach((rookObj) => {
      if (!rookObj.history.length) {
        const kingRow = indexBoard[rookObj.row];
        const rookColumn = rookObj.column;
        const itemsBetween = rookColumn === 0 ? [kingRow[1], kingRow[2], kingRow[3]] : [kingRow[5], kingRow[6]];
        if (every(itemsBetween, {type: null})) {
          castles.push({ column: rookObj.column, row: rookObj.row });
        }
      }
    });
  }
  return [
    ...up,
    ...left,
    ...down,
    ...right,
    ...upLeft,
    ...upRight,
    ...downLeft,
    ...downRight,
    ...castles
  ];
}

function filterForCheck(piece, board, moves) {
  console.log('[Validator.filterForCheck] piece: ', piece);
  console.log('[Validator.filterForCheck] board: ', board);
  console.log('[Validator.filterForCheck] moves: ', moves);
  return moves;
  const { column, row } = piece;
  const parsedMoves = [];
  moves.forEach(move => {
    const testBoard = doMove(board, row, column, move.row, move.column);
    if (!isCheck(testBoard, piece.player)) {
      parsedMoves.push(move);
    }
  });
  console.log('[Validator.filterForCheck] parsedMoves: ', parsedMoves);
  return parsedMoves;
}

export function doCastle(board, piece, currentRow, currentColumn, nextColumn, nextSquare) {
  const castleColumns = nextColumn === 0 ? { rook: 3, king: 2 } : { rook: 5, king: 6 };
  const rookHistory = nextSquare.history;
  nextSquare.history = [
    ...rookHistory,
    {
      column: castleColumns.rook,
      row: currentRow
    }
  ];
  board[currentRow][castleColumns.rook] = nextSquare;
  board[currentRow][castleColumns.king] = piece;
  board[currentRow][currentColumn] = newTile();
  board[currentRow][nextColumn] = newTile();

  return board;
}

export function generateBoard() {
  return [
    [newTile('r', 'B'), newTile('n', 'B'), newTile('b', 'B'), newTile('q', 'B'), newTile('k', 'B'), newTile('b', 'B'), newTile('n', 'B'), newTile('r', 'B')],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()],
    [newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile(), newTile()],
    [newTile('r', 'W'), newTile('n', 'W'), newTile('b', 'W'), newTile('q', 'W'), newTile('k', 'W'), newTile('b', 'W'), newTile('n', 'W'), newTile('r', 'W')]
  ];
  // standard board
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

export function isCheck(board, turn) {
  let checked = false;
  board.forEach((rowArr, row) => {
    rowArr.forEach((piece, column) => {
      if (piece.player === turn) {
        const moves = validMoves(piece, board, row, column);
        if (find(moves, { type: 'k'})) {
          checked = true;
        }
      }
    });
  })
  return checked;
}
export function doMove(board, currentRow, currentColumn, nextRow, nextColumn) {
  const piece = board[currentRow][currentColumn];
  const nextSquare = board[nextRow][nextColumn];
  const pieceHistory = piece.history;
  let boardHistoryRow = nextRow;
  let boardHistoryColumn = nextColumn;
  piece.history = [
    ...pieceHistory,
    {
      row: currentRow,
      column: currentColumn
    }
  ];
  // castling
  if (piece.type === 'k' && nextSquare.player === piece.player) {
    board = this.doCastle(board, piece, currentRow, currentColumn, nextColumn, nextSquare);
  } else {
    board[currentRow][currentColumn] = newTile();
    board[nextRow][nextColumn] = piece;
  }
  return board;
}
export function newTile(type = null, player) {
  const color = player === 'B' ? 'black' : 'white';
  return {
    color,
    type,
    player,
    history: []
  }
}
export function validMoves(piece, board, row, column, check = false) {
  let moves = null;
  switch (piece.type) {
    case 'p' :
    moves = pawnMoves(piece, board, row, column);
    break;
    case 'n' :
    moves = knightMoves(piece, board, row, column);
    break;
    case 'b' :
    moves = bishopMoves(piece, board, row, column);
    break;
    case 'r' :
    moves = rookMoves(piece, board, row, column);
    break;
    case 'k' :
    moves = kingMoves(piece, board, row, column, check);
    break;
    case 'q' :
    const rookStyle = rookMoves(piece, board, row, column);
    const bishopStyle = bishopMoves(piece, board, row, column);
    moves = [...rookStyle, ...bishopStyle];
    break;
    default :
    moves = [];
    break;
  }
  if (check) {
    return filterForCheck(piece, board, moves);
  }
  return moves;
}
