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
  let turn;   //Two players, two turns
  let winner = null; // The winner
  let angle = 0;
  let draggedship;  // The player's ship being dragged onto board
  let dropped; // Boolean for ships being dropped

  /*----- cached elements  -----*/


  /*----- event listeners -----*/
  flipButton.addEventListener('click', flip);


  /*----- Main -----*/

  render();
  /*----- functions -----*/

  // Render's the board at start up and at current state of game
  function render() {
    renderAlphaNums();
    renderBoard();
  }

  // Renders two 10x10 board for player and CPU. Each board will have letter's A-J for each row and numbers 1-10 for each column
  function renderBoard() {
    renderPlayerBoard();
    renderCpuBoard();
  }

  // Renders the board for the CPU
  function renderCpuBoard() {
    let cellID = '';
    for(let i = 0; i < WIDTH; i++) {
      cellID = '';
      for(let j = HEIGHT+1; j > 1; j--) {
        const cell = document.createElement('div');
        cellID = (j-1).toString();
        cellID += ALPHANUMS.charAt(i);
        cell.id = cellID;
        cpuBoard.appendChild(cell);
      }
    }
    cShips.forEach(ship => {
      cpuShipPlacement(ship)
    });
  }
  // Renders the board for the player
  function renderPlayerBoard() {
    let cellID = '';
    for(let i = 0; i < WIDTH; i++) {
      cellID = '';
      cellID += ALPHANUMS.charAt(i);
      for(let j = 0; j < HEIGHT; j++) {
        const cell = document.createElement('div');
        cellID += (j+1).toString();
        cell.id = cellID;
        cellID = ALPHANUMS.charAt(i);
        playerBoard.appendChild(cell);
      }
    }
  }


// Renders the ALPHA-NUMERIC IDs of the grid
  function renderAlphaNums() {
    for(let i = 0; i < WIDTH; i++) {
      const alphaNum = document.createElement('div');
      alphaNum.innerHTML = `<h2>${NUMS[i]}</h2>`;
      pAlphaNumContainer.append(alphaNum)
    }
    for(let i = WIDTH-1; i > -1; i--) {
      const alphaNum = document.createElement('div');
      alphaNum.innerHTML = `<h2>${NUMS[i]}</h2>`;
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
    let isHorizontal = randomBool;
    let randomXNum = Math.floor(Math.random() * WIDTH + 1);
    let randomYNum = Math.floor(Math.random() * HEIGHT)
    let xCoordinate = randomXNum;
    let yCoordinate = ALPHANUMS.charAt(randomYNum);
    let randStartPos = '';
    let shipCells = [];
    
    for(let i = 0; i < ship.length; i++) {
      if(isHorizontal) {
        if(xCoordinate <= (WIDTH-ship.length+1)){
          randStartPos = randStartPos + (xCoordinate+i) + yCoordinate;
          shipCells.push(document.getElementById(`${randStartPos}`));
          randStartPos = '';
        } else {
          xCoordinate = (WIDTH-ship.length+1);
          randStartPos = randStartPos + (xCoordinate+i) + yCoordinate;
          shipCells.push(document.getElementById(`${randStartPos}`));
          randStartPos = '';
        }
      } else {
        if(randomYNum <= (HEIGHT-ship.length)){
          randStartPos = randStartPos + xCoordinate + ALPHANUMS.charAt(randomYNum+i);
          shipCells.push(document.getElementById(`${randStartPos}`));
          randStartPos = '';
        } else {
          randomYNum = (HEIGHT-ship.length);
          randStartPos = randStartPos + xCoordinate + ALPHANUMS.charAt(randomYNum+i);
          shipCells.push(document.getElementById(`${randStartPos}`));
          randStartPos = '';
        }
      }
    }
    const notTaken = shipCells.every(cell => !cell.classList.contains('taken'));

    if(notTaken){
    shipCells.forEach(cell=> {
      cell.classList.add(ship.name);
      cell.classList.add('taken');
    })
    } else {
      cpuShipPlacement(ship);
    }
  }

  // Drag Player Ships
  const playerCells = document.querySelectorAll('.player-board div');
  const playerOptionShips = Array.from(playerShips.children);
  playerCells.forEach(cell=> {
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('drop', shipDrop);
  })
  playerOptionShips.forEach(ship=> ship.addEventListener('dragstart', dragStart));
  
  function dragStart(et) {
    dropped = false;
    draggedship = et.target;
  }
  function dragOver(et) {
    et.preventDefault();
  }
  function shipDrop(et) {
    const pStartId = et.target.id;
    const ship = pShips[draggedship.id];
    playerShipPlacement(ship, pStartId, draggedship.id);
    if (dropped) {
      draggedship.remove();
    }
    console.log(playerShips.children.length);
  }

  function playerShipPlacement(ship, startId) {
    startId.toString();
    let isHorizontal = angle === 0;
    let index = ALPHANUMS.indexOf(startId[0]);
    let xCoordinate = startId.substr(1, startId.length-1);
    let yCoordinate = ALPHANUMS[index];
    let newStartId = yCoordinate + xCoordinate;
    let xIsValid = xCoordinate <= WIDTH-ship.length+1;
    let yIsValid = index <= HEIGHT-ship.length;
    let shipCells = [];

    for(let i = 0; i < ship.length; i++) {
      if(isHorizontal){
        if(xIsValid){
          newStartId = yCoordinate + (Number(xCoordinate)+i);
          shipCells.push(document.getElementById(newStartId));
        } else {
          xCoordinate = WIDTH-ship.length+1;
          newStartId = yCoordinate + (Number(xCoordinate)+i);
          shipCells.push(document.getElementById(newStartId));
        }
      } else {
        if(yIsValid){
          newStartId = (ALPHANUMS[index+i]) + xCoordinate;
          shipCells.push(document.getElementById(newStartId));
        } else {
          index = HEIGHT-ship.length;
          newStartId = (ALPHANUMS[index+i]) + xCoordinate;
          shipCells.push(document.getElementById(newStartId));
        }
      }
    }
    const notTaken = shipCells.every(cell=> !cell.classList.contains('taken'));
    if(notTaken) {
      shipCells.forEach(cell => {
        cell.classList.add(ship.name);
        cell.classList.add('taken');
        dropped = true;
      })
    } else {
      return;
    }
  }

  function startGame() {
    if(playerShips.children.length === 1) {

    } else {
      
    }
  }