  /*----- constants -----*/
  const WIDTH = 10;
  const HEIGHT = 10;
  const ALPHANUMS = "abcdefghij";
  const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
  let angle = 0; // Direction of player's ship facing
  let draggedship;  // The player's ship being dragged onto board
  let dropped; // Boolean for ships being dropped
  let playerHits = [];  // Ships that the player hits
  let cpuHits = []; // Ships the CPU hits

  /*----- cached elements  -----*/
  const flipButton = document.querySelector('#flip-btn');
  const showButton = document.querySelector('#show-game');
  const getHideEl = document.querySelector('.hide');
  const getPlayerShipEl = document.querySelector('.player-ships section');
  const playerShips = document.querySelector('.player-ships');
  const pNumContainer = document.querySelector('.player-nums');
  const cNumContainer = document.querySelector('.cpu-nums');
  const pAlphaNumContainer = document.querySelector('.player-alpha-nums');
  const cAlphaNumContainer = document.querySelector('.cpu-alpha-nums');
  const playerBoard = document.querySelector('.player-board');
  const cpuBoard = document.querySelector('.cpu-board');
  const startButton = document.querySelector('#game-start');
  const getInfoEl = document.getElementById('info');

  /*----- event listeners -----*/
  flipButton.addEventListener('click', flip);
  startButton.addEventListener('click', startGame)
  showButton.addEventListener('click', render);

  /*----- Main -----*/

  /*----- functions -----*/

  // Render's the board at start up and at current state of game
  function render() {
    getHideEl.style.display = "flex";
    showButton.style.display = "none";
    renderNums();
    renderAlphaNums();
    renderBoard();
  }

  // Renders two 10x10 board for player and CPU. Each board will have letter's A-J for each row and numbers 1-10 for each column
  function renderBoard() {
    renderPlayerShips();
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
  function renderPlayerShips(){
    getPlayerShipEl.className = 'horizontal';
  }


// Renders the ALPHA-NUMERIC IDs of the grid
  function renderNums() {
    for(let i = 0; i < WIDTH; i++) {
      const num = document.createElement('div');
      num.innerHTML = `<h2>${NUMS[i]}</h2>`;
      pNumContainer.append(num);
    }
    for(let i = WIDTH-1; i > -1; i--) {
      const num = document.createElement('div');
      num.innerHTML = `<h2>${NUMS[i]}</h2>`;
      cNumContainer.append(num);
    }
  }
  function renderAlphaNums() {
    for(let i = 0; i < HEIGHT; i++) {
      const num = document.createElement('div');
      num.innerHTML = `<h2>${ALPHANUMS.charAt(i).toUpperCase()}</h2>`
      pAlphaNumContainer.append(num);
    }
    for(let i = 0; i < HEIGHT; i++) {
      const num = document.createElement('div');
      num.innerHTML = `<h2>${ALPHANUMS.charAt(i).toUpperCase()}</h2>`
      cAlphaNumContainer.append(num);
    }
  }


  // Button for swapping from horizontal/vertical
  function flip() {
    const pShips = Array.from(playerShips.children);
    if(angle === 0) {
      getPlayerShipEl.className = 'vertical';
      angle = 90;
    } else {
      getPlayerShipEl.className = 'horizontal';
      angle = 0;
    }
    console.log(angle);
    for(let i = 1; i < pShips.length; i++) {
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
    if(getPlayerShipEl.children.length === 0) {
      const cpuCells = document.querySelectorAll('.cpu-board div');
      cpuCells.forEach(cell => cell.addEventListener('click', shot));
    } else {
      return;
    }
  }
  function shot(et) {
    if(winner === null) {
      if(et.target.classList.contains('hit') || et.target.classList.contains('miss')){
        et.target.removeEventListener('click', shot);
        return;
      } else if(et.target.classList.contains('taken')) {
        et.target.classList.add('hit');
        let hitCpuShips = Array.from(et.target.classList);
        hitCpuShips = hitCpuShips.filter(hit => hit !== 'hit');
        hitCpuShips = hitCpuShips.filter(taken => taken !== 'taken');
        playerHits.push(hitCpuShips);
        console.log(playerHits.length);
      }
      if(!et.target.classList.contains('taken')) {
        et.target.classList.add('miss');
      }
    }
    checkWinner();
    turn = -1;
    const cpuCells = document.querySelectorAll('.cpu-board div');
    cpuCells.forEach(cell => cell.removeEventListener('click', shot));
    setTimeout(cpuTurn, 250)
  }

  function cpuTurn() {
    if(winner === null) {
      const playerCells = document.querySelectorAll('.player-board div');
      let randomXNum = Math.floor(Math.random() * WIDTH + 1);
      let randomYNum = Math.floor(Math.random() * HEIGHT)
      let xCoordinate = randomXNum;
      let yCoordinate = ALPHANUMS.charAt(randomYNum);
      let randStartPos = yCoordinate + xCoordinate;
      const shootCell = document.getElementById(randStartPos);

      if(shootCell.classList.contains('miss') || shootCell.classList.contains('hit')) {
        cpuTurn()
      } else if(shootCell.classList.contains('taken') && !shootCell.classList.contains('hit')) {
        shootCell.classList.add('hit');
        let hitPlayerShips = Array.from(shootCell.classList);
        hitPlayerShips = hitPlayerShips.filter(hit => hit !== 'hit');
        hitPlayerShips = hitPlayerShips.filter(taken => taken !== 'taken');
        cpuHits.push(hitPlayerShips);
        console.log(cpuHits.length);
      } else {
        shootCell.classList.add('miss');
      }
    }
    checkWinner();
    turn = 1;
    const cpuCells = document.querySelectorAll('.cpu-board div');
    cpuCells.forEach(cell => cell.addEventListener('click', shot));
  }
  function checkWinner() {
    if(playerHits.length === 17) {
      getInfoEl.innerText = "Player is the winner!" ;
    } else if(cpuHits.length === 17) {
      getInfoEl.innerText = "CPU is the winner!";
    }
  }