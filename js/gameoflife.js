function seed() {
  let array = [];
  for(let i = 0; i < arguments.length; i++) {
    array.push(arguments[i]);
  }
  return array;
}

function same([x, y], [j, k]) {
  let cell1 = [x, y].join('');
  let cell2 = [j, k].join('');
  return cell1 === cell2 ? true:false;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  let cellCoordinatesMatch = 0;
  for (let i = 0; i < this.length; i++) {
    for (let j = 0; j < 2; j++) {
      if (cell[j] === this[i][j]) {
        cellCoordinatesMatch++;
      }
    }
    if (cellCoordinatesMatch === 2) return true; // x & y match
    cellCoordinatesMatch = 0; //  reset
  }
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3':'\u25A2';
};

const corners = (state = []) => {
  let allLivingCells = {
    topRight: [ 0, 0 ],
    bottomLeft: [ 0, 0 ]
  };
  //  calculate the top-right and bottom-left coordinates of the smallest rectangle that contains all living cells
  if (state.length > 0) {
    // extract xs and ys
    let xs = state.map(([x, _]) => x);
    let ys = state.map(([_, y]) => y);
    allLivingCells.topRight = [Math.max(...xs), Math.max(...ys)];
    allLivingCells.bottomLeft = [Math.min(...xs), Math.min(...ys)];
  }
  return  allLivingCells;
};

const printCells = (state) => {};

const getNeighborsOf = ([x, y]) => {};

const getLivingNeighbors = (cell, state) => {};

const willBeAlive = (cell, state) => {};

const calculateNext = (state) => {};

const iterate = (state, iterations) => {};

const main = (pattern, iterations) => {};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;