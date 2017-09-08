import inRange from 'lodash/inRange';
function onBoard(coordinate) {
  return inRange(coordinate, 0, 8);
}
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
    potentials.push({ column: column, row: forwardRow });
  }
  // opening two space
  if (potentials.length && onBoard(forwardTwo) && !board[forwardTwo][column].type && initialPosition) {
    potentials.push({ column: column, row: forwardTwo});
  }
  // take a piece to the left
  const leftPiece = board[forwardRow][left];
  if (onBoard(left) && onBoard(forwardRow) && leftPiece.type && leftPiece.player !== piece.player) {
    potentials.push({ column: left, row: forwardRow });
  }
  // take a piece to the right
  const rightPiece = board[forwardRow][right];
  if (onBoard(right) && onBoard(forwardRow) && rightPiece.type && rightPiece.player !== piece.player) {
    potentials.push({ column: right, row: forwardRow });
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
      potentials.push({ column: column, row: row });
      row += dirRow;
      column += dirColumn;
    }
    // piece can be taken
    else if (checkSquare.player !== piece.player) {
      potentials.push({ column: column, row: row });
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
  return validMoves;
}

function kingMoves(piece, board, row, column) {
  const upLeft = moveDirection(piece, board, row, column, -1, -1, true);
  const upRight = moveDirection(piece, board, row, column, 1, -1, true);
  const downRight = moveDirection(piece, board, row, column, 1, 1, true);
  const downLeft = moveDirection(piece, board, row, column, -1, 1, true);
  const up = moveDirection(piece, board, row, column, 0, -1, true);
  const left = moveDirection(piece, board, row, column, -1, 0, true);
  const right = moveDirection(piece, board, row, column, 1, 0, true);
  const down = moveDirection(piece, board, row, column, 0, 1, true);
  return [
    ...up,
    ...left,
    ...down,
    ...right,
    ...upLeft,
    ...upRight,
    ...downLeft,
    ...downRight
  ];
}

export default class Validator {
  static validMoves(piece, board, row, column) {
    //console.log('[Validator.validMoves] row: ' + row + ' column: ' + column + ' board: ', board);
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
      moves = kingMoves(piece, board, row, column);
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
    return moves;
  }
}
