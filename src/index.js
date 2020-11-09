import "./styles.css";
import GameBoard from "./gameboard.js";
import { BOARD_SIZES } from "./gameboard.js";

document.getElementById("script_text").innerHTML = `
<p>this is the contents of the element "script_text", set to be this way from index.js</p>
`;

// Add event listeners to size option buttons

// Get game board element
const boardelem = document.getElementById("game_board");
// Create GameBoard object
let board = new GameBoard(boardelem);
// Start new game with some board size
board.newGame(BOARD_SIZES.SMALL);

// TODO:
// - switching to other board sizes (button functionalities)
// - selecting panels and checking matches
// - making matched panels unclickable
// - resetting board
// - timer? score? other fun stuff
