import inRange from 'lodash/inRange';

export function getPiecesWithIndex(board) {
  return board.map((row, indexY) => {
    return row.map((tile, indexX) => {
      return {
        ...tile,
        row: indexY,
        column: indexX
      }
    });
  });
}

export function onBoard(coordinate) {
  return inRange(coordinate, 0, 8);
}

export function randomize(a) {
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
