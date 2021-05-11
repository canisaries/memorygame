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

// Chosen size (toggled by size option buttons)
let chosenSize = null;

// Get size option buttons and add event listeners to them
let sizebuttons = document.getElementsByClassName("size_option_button");
for (const btn of sizebuttons) {
  btn.addEventListener("click", (e) => {
    chosenSize = getSizeFromButtonID(e.target.id);
    restartWithChosenSize();
  });
}

// Add event listener to win button (debug only)
let winbutton = document.getElementById("win_button");
winbutton.addEventListener("click", () => {
  gameboard.win();
});

// Whether user has confirmed they want to start a new game
// (required if user wants to start a new game while there is
// an ongoing game)
let restartConfirmed = false;

// Get restart confirmation notification and its yes- and no-buttons
let confirmRestartNotif = document.getElementById("confirm-restart");
let confirmRestartYesBtn = document.getElementById("confirm-restart-yes");
let confirmRestartNoBtn = document.getElementById("confirm-restart-no");

// Add event listeners to restart confirmation buttons

// The Yes button requests to restart the game with the
// currently chosen side and hides the notification
confirmRestartYesBtn.addEventListener("click", () => {
  console.log("YES BUTTON CLICKED");

  showNotification(confirmRestartNotif, false);

  restartConfirmed = true;
  restartWithChosenSize();
});

// The No button hides the notification
confirmRestartNoBtn.addEventListener("click", () => {
  console.log("NO BUTTON CLICKED");
  showNotification(confirmRestartNotif, false);
});

// Executable script ends here.

// TODO-LIST:
// - score (pairs)
// - prevent hover and click effects when showing if pair is correct
// - timer
// - color change for matching and non matching pairs?

// Function definitions begin here.

// Function to toggle the visibility of a notification element
function showNotification(notif, visible = true) {
  if (visible) {
    notif.classList.remove("hidden");
  } else {
    notif.classList.add("hidden");
  }
}

function getSizeFromButtonID(btn_id) {
  switch (btn_id) {
    case "size_option_small":
      return BOARD_SIZES.SMALL;
    case "size_option_medium":
      return BOARD_SIZES.MEDIUM;
    case "size_option_large":
      return BOARD_SIZES.LARGE;
    default:
      console.log(
        "getSizeFromButtonID WARNING: ID not recognized. Returning null."
      );
      return null;
  }
}

// Restarts the game with
// If there is an ongoing game and the user
// has not confirmed the decision to restart, ask for confirmation
function restartWithChosenSize() {
  if (chosenSize === null) {
    console.log("restartWithChosenSize ERROR: No chosen size. Returning.");
    return;
  }

  console.log(
    "Game in progress: " +
      gameboard.gameInProgress() +
      ", restart confirmed: " +
      restartConfirmed
  );

  // If the game has already been started and user has not
  // confirmed the decision, display notification
  // asking for confirmation on starting a new game.
  if (gameboard.gameInProgress() && !restartConfirmed) {
    console.log(
      "changeBoardSize DEBUG: Game in progress. Must confirm decision."
    );
    showNotification(confirmRestartNotif);
    return;
  }

  // Reset restart confirmation
  restartConfirmed = false;

  // Start new game
  gameboard.newGame(chosenSize);
}
