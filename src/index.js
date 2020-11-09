import "./styles.css";
import GameBoard from "./gameboard.js";
import { BOARD_SIZES } from "./gameboard.js";

document.getElementById("script_text").innerHTML = `
<p>this is the contents of the element "script_text", set to be this way from index.js</p>
`;

// Get game board
const docboard = document.getElementById("game_board");
// Give it to GameBoard object
let board = new GameBoard(docboard);
// Start new game with some board size
board.newGame(BOARD_SIZES.MEDIUM);

// TODO:
// - other board sizes (css + button functionalities)
// - selecting panels and checking matches
// - making matched panels unclickable
// - resetting board
// - timer? score? other fun stuff
