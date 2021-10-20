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
  return false;
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

const printCells = (state) => {
  let coords = corners(state);
  let x_units = coords.topRight[0] - coords.bottomLeft[0] + 1;
  let y_units = coords.topRight[1] - coords.bottomLeft[1] + 1;
  const startX = coords.topRight[0] - (x_units - 1);
  const startY = coords.topRight[1];
  let x = [];
  x.push(startX)
  let y = [];
  y.push(startY);
  for (let i = 1; i < x_units; i++) {
    x.push(startX + i);
  } 
  for (let i = 1; i < y_units; i++) {
    y.push(startY - i);
  }
  let str = '';
  for (let j = 0; j < y.length; j++) {
    for (let k = 0; k < x.length; k++) {
      str += printCell([x[k],y[j]], state);
      str += ' ';
    }
    str += '\n';
  }
  return str;
};

const getNeighborsOf = ([x, y]) => {
  let xs = [];
  let ys = [];
  xs.push(x - 1);
  xs.push(x);
  xs.push(x + 1);  

  ys.push(y - 1);
  ys.push(y);
  ys.push(y + 1);

  let neighbors = [];

  for (let j = 0; j < 3; j++) {
    for (let k = 0; k < 3; k++) {
      if (xs[k] === x && ys[j] === y) continue;
      neighbors.push([xs[k], ys[j]]);
    }
  }

  return neighbors;
};

const getLivingNeighbors = (cell, state) => {
  const neighbors = getNeighborsOf(cell);
  const containsCopy = contains.bind(state);
  const livingNeighbors = neighbors.filter(neighbor => containsCopy(neighbor));
  return livingNeighbors;
};

const willBeAlive = (cell, state) => {
  let livingNeighbors = getLivingNeighbors(cell, state);
  if (contains.call(state, cell)) {
    //  The cell is alive, check for 2 living neighbors
    return livingNeighbors.length === 2 || livingNeighbors.length === 3 ? true : false;
  } else {
    //  The cell is dead, check for 3 living neighbors
    return livingNeighbors.length === 3 ? true : false;
  }
};

const calculateNext = (state) => {
  let coords = corners(state);
  let x_units = (coords.topRight[0] + 1) - (coords.bottomLeft[0] - 1) + 1; /* extend units */
  let y_units = (coords.topRight[1] + 1) - (coords.bottomLeft[1] - 1) + 1; /* extend units */
  const startX = (coords.topRight[0] + 1) - (x_units - 1);/* extend the search grid */ 
  const startY = coords.topRight[1] + 1;/* extend the search grid */
  let x = [];
  x.push(startX)
  let y = [];
  y.push(startY);
  for (let i = 1; i < x_units; i++) {
    x.push(startX + i);
  } 
  for (let i = 1; i < y_units; i++) {
    y.push(startY - i);
  }
  let willLive = [];
  for (let j = 0; j < y_units; j++) {
    for (let k = 0; k < x_units; k++) {
      if (willBeAlive([x[k], y[j]], state)) {
        willLive.push([x[k], y[j]]);
      }
    }
  }
  return willLive;
};

const iterate = (state, iterations) => {
  let gameStates = [];
  gameStates.push(state);
  let newState = [...state];
  for (let i = 0; i < iterations; i++) {
    newState = calculateNext(newState);
    gameStates.push(newState);
  }
  return gameStates;
};

const main = (pattern, iterations) => {
  const futureStates = iterate(startPatterns[pattern], iterations);
  for (let i = 0; i < futureStates.length; i++) {
      console.log(`${printCells(futureStates[i])}\n`);
  }
};

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