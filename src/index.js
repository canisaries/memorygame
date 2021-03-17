import "./styles.css";
import GameBoard from "./gameboard.js";
import { BOARD_SIZES } from "./gameboard.js";

// Get overlay
let overlay = document.getElementById("game_overlay");

// Get game board element
const boardelem = document.getElementById("game_board");
// Create GameBoard object
let gameboard = new GameBoard(boardelem, overlay);
// Start new game with some board size
gameboard.newGame(BOARD_SIZES.SMALL);

// Add event listeners to size option buttons
let sizebuttons = document.getElementsByClassName("size_option_button");
for (const btn of sizebuttons) {
  btn.addEventListener("click", (e) => {
    changeBoardSize(e.target.id, gameboard);
  });
}

// Add event listener to win button TODO

// Executable script ends here.

// TODO-LIST:
// - clicking overlay after winning actually restarts the game like it says
// - confirming decision to start new game if old game already started
// - score (pairs)
// - prevent hover and click effects when showing if pair is correct
// - timer
// - color change for matching and non matching pairs?

// Function definitions begin here.

function changeBoardSize(btn_id, board) {
  let size = null;

  // Get size from button
  switch (btn_id) {
    case "size_option_small":
      size = BOARD_SIZES.SMALL;
      break;
    case "size_option_medium":
      size = BOARD_SIZES.MEDIUM;
      break;
    case "size_option_large":
      size = BOARD_SIZES.LARGE;
      break;
    default:
      break;
  }

  // If id wasn't recognized, return
  if (size === null) {
    console.log("changeBoardSize ERROR: Called with unrecognized ID.");
    return;
  }

  // If the game has already been started, ask user for confirmation on
  // starting a new game
  if (board.gameInProgress) {
    // TODO
    console.log(
      "changeBoardSize DEBUG: Game already started, but confirmation has not yet been implemented."
    );
  }

  // DEBUG
  console.log(
    "changeBoardSize DEBUG: Starting new game per request. Size: " + size
  );

  // Start new game
  board.newGame(size);
}
