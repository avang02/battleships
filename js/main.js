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
  let shipCounter = 0; // Counter for player ships
  let playerHits = [];  // Ships that the player hits
  let cpuHits = []; // Ships the CPU hits
  let cpuCheat = false;
  let playerCheat = false;
  let keysPressHolder = {};

  /*----- cached elements  -----*/
  const getHeader = document.querySelector('header');
  const flipButton = document.querySelector('#flip-btn');
  const showButton = document.querySelector('#show-game');
  const getHideEl = document.querySelector('.hide');
  const getGameOverScreenEl = document.querySelector('.game-over-screen');
  const getWinnerEl = document.querySelector('.winner');
  const getHomerEl = document.querySelector('#homer');
  const getBartEl = document.querySelector('#bart');
  const tryAgainBtn = document.querySelector('#try-again');
  const playerShips = document.querySelector('.player-ships section');
  const pNumContainer = document.querySelector('.player-nums');
  const cNumContainer = document.querySelector('.cpu-nums');
  const pAlphaNumContainer = document.querySelector('.player-alpha-nums');
  const cAlphaNumContainer = document.querySelector('.cpu-alpha-nums');
  const playerBoard = document.querySelector('.player-board');
  const playerCells = document.querySelectorAll('.player-board div');
  const cpuBoard = document.querySelector('.cpu-board');
  const startButton = document.querySelector('#game-start');
  const getInfoEl = document.getElementById('info');

  const playerOptionShips = Array.from(playerShips.children);
  
  /*----- event listeners -----*/

  function renderEventListeners() {
    flipButton.addEventListener('click', flip);
    startButton.addEventListener('click', startGame);
    showButton.addEventListener('click', showGame);
    tryAgainBtn.addEventListener('click', restart);
    playerOptionShips.forEach(ship=> ship.addEventListener('dragstart', dragStart));
  }
  
  /*----- Main -----*/
  render();
  renderEventListeners();
  /*----- functions -----*/

  // Render's the board at start up and at current state of game and reset the game
  function render() {
    renderNums();
    renderAlphaNums();
    renderBoard();
  }
  function showGame() {
    getHideEl.style.display = "flex";
    showButton.style.display = "none";
  }
  function restart() {
    refreshGame()
    render();
    renderEventListeners();
    hideGameover();
    showGame();
  }
  function refreshGame() {
    const cpuCells = Array.from(cpuBoard.children);
    const playerCells = Array.from(playerBoard.children);
    const newPlayerShips = Array.from(playerShips.children);
    const newPNumContainer = Array.from(pNumContainer.children);
    const newCNumContainer = Array.from(cNumContainer.children);
    const newPAlphaNumContainer = Array.from(pAlphaNumContainer.children);
    const newCAlphaNumContainer = Array.from(cAlphaNumContainer.children);
    cpuCells.forEach(cell=> cell.remove());
    playerCells.forEach(cell=> cell.remove());
    newPlayerShips.forEach(ship => ship.style.display = 'flex');
    newPNumContainer.forEach(num=> num.remove());
    newCNumContainer.forEach(num=> num.remove());
    newPAlphaNumContainer.forEach(alpha=> alpha.remove());
    newCAlphaNumContainer.forEach(alpha=> alpha.remove());
    startButton.style.display = 'flex';
    getHeader.style.display = 'flex';
    getInfoEl.innerHTML = ``;
    playerHits = [];
    cpuHits = [];
    shipCounter = 0;
  }
  function hideGameover() {
    getGameOverScreenEl.style.display = 'none';
    getHomerEl.style.display = 'none';
    getBartEl.style.display = 'none';
  }

  // Renders two 10x10 board for player and CPU. Each board will have letter's A-J for each row and numbers 1-10 for each column
  function renderBoard() {
    renderPlayerBoard();
    renderPlayerShips();
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
    playerShips.className = 'horizontal';
    const playerCells = document.querySelectorAll('.player-board div');
    playerCells.forEach(cell=> {
    cell.addEventListener('dragover', dragOver);
    cell.addEventListener('drop', shipDrop);
  })
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
      playerShips.className = 'vertical';
      playerShips.classList.add('my-ships');
      angle = 90;
    } else {
      playerShips.className = 'horizontal';
      angle = 0;
    }
    // for(let i = 0; i < pShips.length; i++) {
    //   pShips[i].style.transform = `rotate(${angle}deg)`;
    // }
    
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
  function dragStart(et) {
    dropped = false;
    draggedship = et.target;
  }
  function dragOver(et) {
    et.preventDefault();
    const ship = pShips[draggedship.id];
    addAreaHighlight(et.target.id, ship)
  }
  function shipDrop(et) {
    const pStartId = et.target.id;
    const ship = pShips[draggedship.id];
    playerShipPlacement(ship, pStartId, draggedship.id);
    if (dropped) {
      draggedship.style.display = 'none';
      shipCounter++;
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
  // Add highlighted area for player ship placement
  function addAreaHighlight(startId, ship){ 
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
    if(ship.name === 'carrier') {
      shipCells.forEach(cell => {
        cell.classList.add('chover');
        setTimeout(()=> cell.classList.remove('chover'), 1000)
      })
    } else if(ship.name === 'battleship') {
      shipCells.forEach(cell => {
        cell.classList.add('bhover');
        setTimeout(()=> cell.classList.remove('bhover'), 1000)
      })
    } else if(ship.name === 'destroyer') {
      shipCells.forEach(cell => {
        cell.classList.add('dhover');
        setTimeout(()=> cell.classList.remove('dhover'), 1000)
      })
    } else if(ship.name === 'submarine') {
      shipCells.forEach(cell => {
        cell.classList.add('shover');
        setTimeout(()=> cell.classList.remove('shover'), 1000)
      })
    } else if(ship.name === 'patrol-boat') {
      shipCells.forEach(cell => {
        cell.classList.add('phover');
        setTimeout(()=> cell.classList.remove('phover'), 1000)
      })
    }
  }



  // Starts the game and player will be able to fire shots onto enemy cells
  function startGame() {
    if(shipCounter === 5) {
      startButton.style.display = 'none';
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

  // Logic for the CPU to fire to player
  function cpuTurn() {
    if(winner === null) {
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
      } else {
        shootCell.classList.add('miss');
      }
    }
    checkWinner();
    turn = 1;
    const cpuCells = document.querySelectorAll('.cpu-board div');
    cpuCells.forEach(cell => {
      cell.style.hover
      cell.addEventListener('click', shot)
    });
  }
  function checkWinner() {
    if(playerHits.length === 17) {
      getHeader.style.display = 'none';
      getHideEl.style.display = "none";
      getGameOverScreenEl.style.display = "flex";
      getWinnerEl.style.color = 'green';
      getWinnerEl.innerHTML = `Homer WINS!`
      getHomerEl.style.display = 'flex';
    } else if(cpuHits.length === 17) {
      getHeader.style.display = 'none';
      getHideEl.style.display = "none";
      getGameOverScreenEl.style.display = "flex";
      getWinnerEl.style.color = 'red';
      getWinnerEl.innerHTML = `Bart WINS!`;
      getBartEl.style.display = 'flex';
    }
  }
  function cpuWin() {
    getHeader.style.display = 'none';
    getHideEl.style.display = "none";
    getGameOverScreenEl.style.display = "flex";
    getWinnerEl.style.color = 'red';
    getWinnerEl.innerHTML = `Bart WINS!`;
    getBartEl.style.display = 'flex';
    // getHeader.style.display = 'none';
    // getHideEl.style.display = "none";
    // getGameOverScreenEl.style.display = "flex";
    // getWinnerEl.style.color = 'green';
    // getWinnerEl.innerHTML = `Homer WINS!`
    // getHomerEl.style.display = 'flex';
  }