import inRange from 'lodash/inRange';
function onBoard(coordinate) {
  return inRange(coordinate, 0, 8);
}
function pawnMoves(piece, board, row, column) {
  const direction = piece.player === 'W' ? -1 : 1;
  const forwardY = row + direction;
  const left = column - 1;
  const right = column + 1;
  const forwardTwo = row + (direction * 2);
  const initialPosition = (piece.player === 'B' && row === 1) || (piece.player === 'W' && row === 6);
  const potentials = [];

  // one forward
  if (board[forwardY][column].type === null) {
    potentials.push({ x: column, y: forwardY });
  }
  // opening two space
  if (onBoard(forwardTwo) && !board[forwardTwo][column].type && initialPosition) {
    potentials.push({ x: column, y: forwardTwo});
  }
  // take a piece to the left
  if (onBoard(left) && onBoard(forwardY) && board[forwardY][left].type) {
    potentials.push({ x: left, y: forwardY });
  }
  // take a piece to the right
  if (onBoard(right) && onBoard(forwardY) && board[forwardY][right].type) {
    potentials.push({ x: right, y: forwardY });
  }
  return potentials;
}

function moveDirection(piece, board, row, column, dirX, dirY) {
  const potentials = [];
  row += dirY;
  column += dirX;
  while (onBoard(row) && onBoard(column)) {
    const checkSquare = board[row][column];
    // empty space
    if (!checkSquare.type) {
      potentials.push({ x: column, y: row });
      row += dirY;
      column += dirX;
    }
    // piece can be taken
    else if (checkSquare.player !== piece.player) {
      potentials.push({ x: column, y: row });
      break;
    } else {
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
  const checkMoves = [
    { x: column + 1, y: row + 2 },
    { x: column + 1, y: row - 2 },
    { x: column - 1, y: row + 2 },
    { x: column - 1, y: row - 2 },
    { x: column + 2, y: row + 1 },
    { x: column + 2, y: row - 1 },
    { x: column - 2, y: row + 1 },
    { x: column - 2, y: row - 1 }
  ];
  return checkMoves.filter(obj => onBoard(obj.x) && onBoard(obj.y));
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
