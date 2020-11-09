// Class GameBoard that represents the game board.
// Handles panel actions and stores their states.

// Enum for board sizes (side length)
export const BOARD_SIZES = {
  SMALL: 4,
  MEDIUM: 6,
  LARGE: 8
};

export default class GameBoard {
  constructor(board) {
    this.board = board;
    this.boardsize = BOARD_SIZES.SMALL; // Default size
    this.selectedPanel = null; // Currently selected panel
    this.gameStarted = false; // If game was started or not
    // (to decide whether to make player confirm their request to start a new game)

    // Make game board listen to clicks
    let thisobj = this; // Workaround to allow self-reference in anon func
    this.board.addEventListener("click", function (e) {
      // e.target is the clicked element, check if it's a panel
      if (e.target && e.target.matches(".game_panel")) {
        thisobj.flipPanel(e.target.id);
      }
    });
  }

  // Sets up a new game.
  newGame(size) {
    this.gameStarted = false;
    this.boardsize = size;
    this.updateBoardCSS();
    this.setupPanels();
  }

  // Updates board CSS according to current size.
  updateBoardCSS() {
    // DEBUG
    console.log("updateBoardCSS called! Board size: " + this.boardsize);
    this.board.setAttribute(
      "grid-template-columns",
      `repeat(${this.boardsize}, 1fr)`
    );
    // DEBUG
    console.log(
      "updateBoardCSS called! Board size: " +
        this.board.getAttribute("grid-template-columns")
    );
  }

  // Returns panel padding according to current board size.
  getPanelPadding() {
    switch (this.boardsize) {
      case BOARD_SIZES.SMALL:
        return "0.5em";
      case BOARD_SIZES.MEDIUM:
        return "0.2em";
      case BOARD_SIZES.LARGE:
        return "0.1em";
      default:
        return "0.5em";
    }
  }

  // Removes any old panels and adds new ones to board
  // NOTE: do not call outside GameBoard! Use newGame instead.
  setupPanels() {
    let panelcount = this.boardsize * this.boardsize;

    this.removePanels();

    for (let i = 0; i < panelcount; i++) {
      this.addPanel("panel_" + i.toString());
    }

    // Create contents array
    this.contents = [];

    // Push each possible value in twice
    for (let i = 0; i < panelcount / 2; i++) {
      this.contents.push(i);
      this.contents.push(i);
    }

    // Shuffle array
    this.contents = shuffle(this.contents);
  }

  // Removes all panels from board
  removePanels() {
    let board = this.board; // To make sure no this-confusion happens in lambda
    let panels = this.board.getElementsByClassName("game_panel");
    for (const panel of panels) {
      board.removeChild(panel);
    }
  }

  // A function that adds a panel to the gameboard under the given id
  addPanel(panel_id) {
    var panel_temp = document.getElementsByTagName("template")[0];
    var panelfrag = panel_temp.content.cloneNode(true);
    var panel = panelfrag.querySelector("button");
    panel.setAttribute("id", panel_id.toString()); // Give panel its
    panel.classList.add(this.getPanelClass()); // Size class
    this.board.appendChild(panelfrag);
  }

  // Returns correct panel class for the current board size.
  // If no board size is defined, default to small.
  getPanelClass() {
    switch (this.boardsize) {
      case BOARD_SIZES.SMALL:
        return ".small";
      case BOARD_SIZES.MEDIUM:
        return ".medium";
      case BOARD_SIZES.LARGE:
        return ".large";
      default:
        return ".small";
    }
  }

  flipPanel(panel_id) {
    // Handle panel selection and functionality

    if (this.selectedPanel === panel_id) {
      // If this panel already selected, ignore
      return;
    } else if (this.selectedPanel === null) {
      // If this is the first panel to be selected
      this.selectedPanel = panel_id;
      console.log(
        "First panel flipped! Its value was " + this.getPanelValue(panel_id)
      );
      // Mark game as started if it's not already
      if (!this.gameStarted) {
        this.gameStarted = true;
      }
    } else {
      // If this is the second panel to be selected
      console.log(
        "Second panel flipped! Its value was " + this.getPanelValue(panel_id)
      );

      // Check whether values match and act accordingly
      this.checkMatch(this.selectedPanel, panel_id);

      this.selectedPanel = null; // Reset selection regardless of match
    }
  }

  // Check whether given panels match, act accordingly
  checkMatch(panel1, panel2) {
    // TODO ANIMATION OR WHATEVER AND DISABLING BUTTONS
    if (this.getPanelValue(panel1) === this.getPanelValue(panel2)) {
      console.log("Match found!");
    } else {
      console.log("No match. Try again.");
    }
  }

  getPanelValue(panel_id) {
    let i = this.panelIndexFromID(panel_id);
    return this.contents[i];
  }

  // Simple help function that parses the index of the panel from
  // its string-form ID. If parsing fails, returns 0.
  panelIndexFromID(panel_id) {
    let i = 0;
    try {
      i = parseInt(panel_id.split("_")[1], 10);
    } catch (err) {
      console.log("Error in panelIndexFromID, returning 0");
    }
    return i;
  }
}

// Shuffle function provided by
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
