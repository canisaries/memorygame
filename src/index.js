import "./styles.css";
import GameBoard from "./gameboard.js";
import { BOARD_SIZES } from "./gameboard.js";

document.getElementById("script_text").innerHTML = `
<p>this is the contents of the element "script_text", set to be this way from index.js</p>
`;

// Add event listeners to size option buttons
let sizebuttons = document.getElementsByClassName("size_option_button");
for (const btn of sizebuttons) {
  btn.addEventListener("click", (e) => {
    changeBoardSize(e.target.id);
  });
}

// Get game board element
const boardelem = document.getElementById("game_board");
// Create GameBoard object
let board = new GameBoard(boardelem);
// Start new game with some board size
board.newGame(BOARD_SIZES.SMALL);

// Executable script ends here.

// TODO-LIST:
// - confirming decision to start new game if old game already started
// - showing panel value when clicked (hold a bit on second before advancing!)
// - making matched panels unclickable (and showing their values permanently)
// - timer? score? other fun stuff
// - fancier graphics

// Function definitions begin here.

function changeBoardSize(btn_id) {
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
  if (board.gameStarted) {
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
