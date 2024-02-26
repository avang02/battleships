  /*----- constants -----*/
  const WIDTH = 10;
  const HEIGHT = 10;
  const ALPHANUMS = "abcdefghij";
  const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


  const flipButton = document.querySelector('#flip-btn');
  const playerShips = document.querySelector('.player-ships');
  const pAlphaNumContainer = document.querySelector('.player-alpha-nums');
  const cAlphaNumContainer = document.querySelector('.cpu-alpha-nums');
  const playerBoard = document.querySelector('.player-board');
  const cpuBoard = document.querySelector('.cpu-board');
  const playerCells = document.querySelectorAll('.player-board div');
  const cpuCells = document.querySelectorAll('.cpu-board div');

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
  let winner = null; // The winner
  let angle = 0;

  /*----- cached elements  -----*/


  /*----- event listeners -----*/
  flipButton.addEventListener('click', flip);

  /*----- Main -----*/
  cpuShipPlacement(destroyer);



  render();
  /*----- functions -----*/

  // Render's the board at start up and at current state of game
  function render() {
    renderBoard();
    renderAlphaNums();
  }

  // Renders two 10x10 board for player and CPU. Each board will have letter's A-J for each row and numbers 1-10 for each column
  function renderBoard(user) {
    createBoard("player", playerBoard);
    createBoard("cpu", cpuBoard);
  }

  // This will be the HUD for the remaining ships of both the player and CPU
  function createBoard(user, userBoard) {
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
        cellID += (j).toString();
        cell.id = cellID;
        cellID = cellID.slice(0, -1);
        board.append(cell);
      }
      userBoard.append(board);
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


  // Button for swapping from horizontal/vertical
  function flip() {
    const pShips = Array.from(playerShips.children);
    angle === 0 ? angle = 90 : angle = 0;
    for(let i = 0; i < pShips.length-1; i++) {
      pShips[i].style.transform = `rotate(${angle}deg)`;
    }
    
  }
  // CPU logic for placing ships
  function cpuShipPlacement(ship) {
    let randomBool = Math.random() < 0.5;
    let isHorizontal = true;
    let randomXNum = Math.floor(Math.random() * WIDTH);
    let randomYNum = Math.floor(Math.random() * HEIGHT)
    let xCoordinate = ALPHANUMS.charAt(randomXNum);
    let yCoordinate = randomYNum;
    let randStartPos = '';

    let shipCells = [];

    for(let i = 0; i < ship.length; i++) {
      if(isHorizontal) {
        randStartPos = randStartPos + ALPHANUMS.charAt(randomXNum+i) + yCoordinate;
        shipCells.push(cpuCells.getElementById(randStartPos.toString()));
        randStartPos = '';
      }
    }
    console.log(shipCells)
  //   shipCells.forEach(cell=> {
  //     cell.classList.add(ship.name);
  //   })
  }
  