  /*----- constants -----*/
  const WIDTH = 10;
  const HEIGHT = 10;

  const ALPHANUMS = "abcdefghij";
  const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const boardContainer = document.querySelector('.board-container');
  const pAlphaNumContainer = document.querySelector('.player-alpha-nums');
  const cAlphaNumContainer = document.querySelector('.cpu-alpha-nums');

  // Class to construct ships
  class Ship {
    constructor(name, length) {
      this.name = name;
      this.length = length;
    }
  }
  const carrier = new Ship('carrier', 5);
  const battleship = new Ship('battleship', 4);
  const destroyer = new Ship('destroyer', 3);
  const submarine = new Ship('submarine', 3);
  const patrolBoat = new Ship('patrol-boat', 2);

  const pShips = [carrier, battleship,  destroyer, submarine, patrolBoat];
  const cShips = [carrier, battleship,  destroyer, submarine, patrolBoat];

  /*----- state variables -----*/
  let turns;   //Two players, two turns
  let playerBoard;  // The player's board
  let cpuBoard; // The CPU's board
  let winner = null; // The winner

  /*----- cached elements  -----*/


  /*----- event listeners -----*/


  /*----- Main -----*/
  render();




  /*----- functions -----*/

  // Render's the board at start up and at current state of game
  function render() {
    renderBoard();
    renderAlphaNums();
  }

  // Renders two 10x10 board for player and CPU. Each board will have letter's A-J for each row and numbers 1-10 for each column
  function renderBoard(user) {
    createBoard("player");
    createBoard("cpu")
  }


  // This will be the HUD for the remaining ships of both the player and CPU
  function createBoard(user) {
    const board = document.createElement('div');
    board.classList.add('game-board');
    board.id = user;

    let cellID = '';
    for(let i = 0; i < WIDTH; i++) {
      cellID = '';
      cellID += ALPHANUMS.charAt(i);
      for(let j = 0; j < HEIGHT; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell')
        cellID += (j+1).toString();
        cell.id = cellID;
        cellID = cellID.slice(0, -1);
        board.append(cell);
      }
      boardContainer.append(board);
    }
  }

// Renders the ALPHA-NUMERIC IDs of the grid
  function renderAlphaNums() {
    for(let i = 0; i < WIDTH; i++) {
      const alphaNum = document.createElement('div');
      alphaNum.innerHTML = `<h2>${ALPHANUMS.charAt(i).toUpperCase()}</h2>`
      pAlphaNumContainer.append(alphaNum)
    }
    for(let i = WIDTH-1; i > -1; i--) {
      const alphaNum = document.createElement('div');
      alphaNum.innerHTML = `<h2>${ALPHANUMS.charAt(i).toUpperCase()}</h2>`
      cAlphaNumContainer.append(alphaNum)
    }
  }

  