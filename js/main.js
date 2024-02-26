  /*----- constants -----*/
  const WIDTH = 10;
  const HEIGHT = 10;
  const ALPHANUMS = "abcdefghij";
  const NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const boardContainer = document.querySelector('.board-container');

  /*----- state variables -----*/
  let turns;   //Two players, two turns
  let playerBoard;  // The player's board
  let cpuBoard; // The CPU's board
  let winner = null; // The winner

  /*----- cached elements  -----*/


  /*----- event listeners -----*/


  /*----- functions -----*/

  // Render's the board at start up and at current state of game
  function render() {
    renderBoard();
    renderScores();
    renderControls();
    renderMessages();
  }

  // Renders two 10x10 board for player and CPU. Each board will have letter's A-J for each row and numbers 1-10 for each column
  function renderBoard(user) {
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
  renderBoard("player");
  renderBoard("cpu");
  // This will be the HUD for the remaining ships of both the player and CPU
  function renderScores() {

  }

  // These controls are a text box for the user to input their coordinates. Example: 'B 5'
  function renderControls() {

  }

  // Render message will log onto the screen for the user for either hit, miss, or battleship is sunk
  function renderMessages() {

  }

