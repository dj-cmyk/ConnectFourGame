/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
const turn = document.getElementById("turn");
const winner = document.getElementById("winner");
const gameOverDiv = document.getElementById("gameover");
const restartBtn = document.getElementById("restartbtn");
//moved the htmlboard outside of the make board function so I could use it to clear the board
//in order to restart a new game after win or tie
const htmlBoard = document.getElementById("board");


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++){
    board[y] = [];
    for (let x=0; x < WIDTH; x++){
      board[y][x] = 0;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  //this is now outside the function so it can be used elsewhere
  

  // this generates the top row of the table/gameboard so the player
  // can see where they will be dropping their playing piece
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // this will give us information about which column the playing piece 
  // should be dropped into while the game is being played
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // this creates the cells of the table for the gameboard 
  // one row created for each height, one cell created for each width, all ID for each cell set
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}
//in order to restart the game I decided to completely remove the old board and create a new
//board from scratch
function clearBoard(){
  while (htmlBoard.firstChild) {
    htmlBoard.removeChild(htmlBoard.firstChild);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  //starting at the bottom of the table, loop through each column to find empty square
  for (let i = 5; i >= 0; i--){
    let square = document.getElementById(`${i}-${x}`)
    if (square.childElementCount === 0){ //it is empty + we can use that square
      return i;
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement("div");
  piece.classList.add("piece");
  if (currPlayer === 1){
    piece.classList.add("player-one");
  } else if (currPlayer === 2){
    piece.classList.add("player-two");
  }
  let td = document.getElementById(`${y}-${x}`)
  td.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  // pop up alert message - I didn't like the way the alert stopped the final piece from 
  // showing on the board so I changed it to a headline that appears when the game is over
  winner.innerText = msg;
  gameOverDiv.classList.remove("hidden");
  gameOverDiv.classList.add("gameover");
  turn.parentElement.classList.add("hidden");
  document.getElementById("column-top").removeEventListener("click", handleClick);
}

restartBtn.addEventListener("click", function(){
  clearBoard();
  makeBoard();
  makeHtmlBoard();  
  currPlayer = 1;
  turn.parentElement.classList.remove("hidden");
  turn.innerText = currPlayer;
  gameOverDiv.classList.add("hidden");
  gameOverDiv.classList.remove("gameover");
})



/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // update in-memory board
  // this has to happen before the place in table function because that function is updating
  // the current player to the next player
  board[y][x] = currPlayer;

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
      return endGame(`Congrats, Player ${currPlayer}! You won!`);
  }

  // check for tie
  if (checkForTie()){
    return endGame("It's a Tie!");
  }

  // switch players
  if (currPlayer === 1) {
    currPlayer = 2;
    turn.innerText = currPlayer;
  } else if (currPlayer === 2) {
    currPlayer = 1;
    turn.innerText = currPlayer;
  }
}




// check for tie:
function checkForTie(){
  for (row of board){
     return row.every(val => val > 0)
  }
}





/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // getting 4 cells in a row into an array, then checking each array if all 4 cells have the same player

  for (let y = 0; y < HEIGHT; y++) { //starting at the top corner of the board and checking
    for (let x = 0; x < WIDTH; x++) { //each x for every y (looping through the loop)
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //collects 4 elements in a row
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { //if any of these 4 in a row are true, someone has won
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();