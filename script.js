const winningMatrix = {
  0: [
    [1, 2],
    [3, 6],
    [4, 8],
  ],
  1: [
    [0, 2],
    [4, 7],
  ],
  2: [
    [0, 1],
    [5, 8],
    [4, 6],
  ],
  3: [
    [0, 6],
    [4, 5],
  ],
  4: [
    [2, 6],
    [3, 5],
    [1, 7],
    [0, 8],
  ],
  5: [
    [3, 4],
    [2, 8],
  ],
  6: [
    [7, 8],
    [0, 3],
    [2, 4],
  ],
  7: [
    [6, 8],
    [1, 4],
  ],
  8: [
    [6, 7],
    [2, 5],
    [0, 4],
  ],
};

const className = {
  cell: "cell",
  cellContent: "cell-content",
  populated: "populated",
  winner: "winner",
};

//users of the game
const user = {
  x: "X",
  o: "O",
};
const winnerType = {
  tie: "tie",
};

let cellValues = ["", "", "", "", "", "", "", "", ""];
let xIsNext = true;
let winningUser;
let numberOfTurnsLeft = 9;
let winningCombination = [];

const cells = document.querySelectorAll(`.${className.cell}`);
const modalOverlay = document.querySelector("#modal-overlay");
const winnerDetails = document.querySelector("#winner-container > span");
const newGameButton = document.querySelector("#new-game-button");

const calculateWinner = (chosenIndex) => {
  const winningRanges = winningMatrix[chosenIndex];

  for (let i = 0; i < winningRanges.length; i++) {
    const currentEntry = cellValues[chosenIndex];
    const firstOption = cellValues[winningRanges[i][0]];
    const secondOption = cellValues[winningRanges[i][1]];

    if (currentEntry === firstOption && firstOption === secondOption) {
      winningUser = currentEntry;
      winningCombination = [
        chosenIndex,
        winningRanges[i][0],
        winningRanges[i][1],
      ];
      return true;
    }
  }
  if (numberOfTurnsLeft === 0) {
    winningUser = winnerType.tie;
    winningCombination = [];
    return true;
  }
  return false;
};

const showModal = () => {
  if (winningUser === winnerType.tie) {
    winnerDetails.innerHTML = `It was a tie.`;
  } else {
    winnerDetails.innerHTML = `Winner is ${winningUser}`;
  }
  modalOverlay.style.display = "flex";
};

const highlightWinningCells = () => {
  cells[winningCombination[0]].classList.add(className.winner);
  cells[winningCombination[1]].classList.add(className.winner);
  cells[winningCombination[2]].classList.add(className.winner);
};

// restart game

const startGame = () => {
  cellValues = ["", "", "", "", "", "", "", "", ""];
  xIsNext = true;
  winningUser = undefined;
  numberOfTurnsLeft = 9;
  winningCombination = [];
  cells.forEach((c, i) => {
    const cellContent = c.querySelector(`.${className.cellContent}`);
    cellContent.innerHTML = cellValues[i];
    cellContent.classList.remove(className.populated);
    c.classList.remove(className.winner);
  });

  modalOverlay.style.display = "none";
};
newGameButton.addEventListener("click", () => {
  startGame();
});

cells.forEach((c, i) => {
  c.addEventListener("click", () => {
    if (!cellValues[i]) {
      cellValues[i] = xIsNext ? user.x : user.o;
      xIsNext = !xIsNext;
      numberOfTurnsLeft--;

      if (calculateWinner(i)) {
        if (winningUser !== winnerType.tie) {
          highlightWinningCells();
        }
        showModal();
      }

      const cellContent = c.querySelector(`.${className.cellContent}`);
      cellContent.innerHTML = cellValues[i];
      cellContent.classList.add(className.populated);
    }
  });
});
