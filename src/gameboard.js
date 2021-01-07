// Class GameBoard that represents the game board.
// Handles panel actions and stores their states.
// Initialized with container of board.

// Enum for board sizes (side length)
export const BOARD_SIZES = {
  SMALL: 4,
  MEDIUM: 6,
  LARGE: 8
};

// Panel values for different lists
const SYMBOLS_SMALL = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SYMBOLS_MEDIUM = [
  ...SYMBOLS_SMALL,
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R"
];
const SYMBOLS_LARGE = [
  ...SYMBOLS_MEDIUM,
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "!",
  "?",
  "@",
  "&",
  "%",
  "#"
];

// Short wait time (milliseconds)
const SHORT_WAIT_TIME = 750;

export default class GameBoard {
  constructor(board) {
    this.board = board; // Board element
    this.boardsize = BOARD_SIZES.SMALL; // Default size
    this.selectedPanel = null; // Currently selected panel
    this.gameStarted = false; // If game was started or not
    // (to decide whether to make player confirm their request to start a new game)
    this.matches = 0; // How many matches player has made

    this.acceptFlips = true; // Whether flips are accepted

    // Make game board listen to clicks
    let thisobj = this; // Workaround to allow self-reference in anon func
    this.board.addEventListener("click", function (e) {
      // e.target is the clicked element, check if it's a panel
      if (e.target && e.target.matches(".game_panel")) {
        thisobj.flipPanel(e.target);
      }
    });

    // DEBUG: CHECK PANEL VALUE LIST LENGTHS
    console.log("Small list: " + SYMBOLS_SMALL.length); // 8
    console.log("Medium list: " + SYMBOLS_MEDIUM.length); // 18
    console.log("Large list: " + SYMBOLS_LARGE.length); // 32
  }

  // Sets up a new game.
  newGame(size) {
    this.gameStarted = false;
    this.matches = 0;
    this.boardsize = size;
    this.setupBoard();
    this.setupPanels();
  }

  // Modify board to apply size rules (panel arrangement)
  setupBoard() {
    console.log("setupBoard called! Board size: " + this.boardsize);
    this.board.style.gridTemplateColumns = `repeat(${this.boardsize}, 1fr)`;
  }

  // Removes any old panels and adds new ones to board
  setupPanels() {
    let panelcount = this.boardsize * this.boardsize;

    // Remove old panels
    this.removePanels();

    // Create contents array
    this.contents = [];

    // Get symbol list corresponding to board size TODO
    let symbols = this.getSymbols();

    // Assure that the charlist length * 2 matches the panel count.
    // If it does not, log error and return.
    if (symbols.length * 2 !== panelcount) {
      console.log(
        "setupPanels ERROR: Symbol list length multiplied by 2 does not equal panel count."
      );
    }

    console.log("setupPanels DEBUG: Correct amount of symbols. Good to go.");

    // Push two of each symbol into contents
    for (const symbol of symbols) {
      this.contents.push(symbol);
      this.contents.push(symbol);
    }

    // Shuffle array
    this.contents = shuffle(this.contents);

    // Create panels, give them the symbols
    for (let i = 0; i < panelcount; i++) {
      this.addPanel("panel_" + i.toString(), this.contents[i]);
    }
  }

  // Removes all panels from board
  removePanels() {
    let panels = this.board.getElementsByClassName("game_panel");
    console.log("removePanels DEBUG: Amount of panels: " + panels.length);

    while (panels[0]) {
      this.board.removeChild(panels[0]);
    }
  }

  // A function that adds a panel to the gameboard under the given id and symbol
  addPanel(panel_id, symbol) {
    // Create panel from template
    var panel_temp = document.getElementsByTagName("template")[0];
    var panelfrag = panel_temp.content.cloneNode(true);
    var panel = panelfrag.querySelector(".game_panel");

    // Set panel ID
    panel.setAttribute("id", panel_id.toString());

    // Set panel content
    panel.querySelector(".panel_text").innerHTML = symbol;

    // Set size class
    panel.classList.add(this.getPanelClass());

    // Append to board
    this.board.appendChild(panelfrag);
  }

  // Returns correct panel class for the current board size.
  // If no board size is defined, default to small.
  getPanelClass() {
    switch (this.boardsize) {
      case BOARD_SIZES.SMALL:
        return "small";
      case BOARD_SIZES.MEDIUM:
        return "medium";
      case BOARD_SIZES.LARGE:
        return "large";
      default:
        return "small";
    }
  }

  // Returns correct symbol list for the current board size.
  // If no board size is defined, default to small.
  getSymbols() {
    switch (this.boardsize) {
      case BOARD_SIZES.SMALL:
        return SYMBOLS_SMALL;
      case BOARD_SIZES.MEDIUM:
        return SYMBOLS_MEDIUM;
      case BOARD_SIZES.LARGE:
        return SYMBOLS_LARGE;
      default:
        return SYMBOLS_SMALL;
    }
  }

  async flipPanel(panel) {
    if (!this.acceptFlips) {
      console.log("Too quick!");
      return;
    }

    // If panel faulty, return without change
    if (panel === null || panel === undefined) {
      return;
    }

    // Handle panel selection and functionality

    if (this.selectedPanel === panel || panel.classList.contains("opened")) {
      // If this panel already selected or open, ignore
      return;
    } else if (this.selectedPanel === null) {
      // If this is the first panel to be selected

      // Mark panel as selected
      this.selectedPanel = panel;

      // Mark panel as opened
      panel.classList.add("opened");

      console.log(
        "First panel flipped! Its value was " + this.getPanelValue(panel.id)
      );

      // Mark game as started if it's not already
      if (!this.gameStarted) {
        this.gameStarted = true;
      }
    } else {
      // If this is the second panel to be selected
      console.log(
        "Second panel flipped! Its value was " + this.getPanelValue(panel.id)
      );

      // Mark panel as opened
      panel.classList.add("opened");

      // DO NOT ACCEPT PANEL FLIPS WHILE CHECK IN PROGRESS
      this.acceptFlips = false;

      // If there is no match, keep buttons open for a while and then close.
      // If there is a match, mark a match and disable both buttons. They will remain open.
      if (!this.checkMatch(this.selectedPanel.id, panel.id)) {
        // Set timeout for short wait time, when time is up close panels
        // and accept flips again

        // Alias parameter to avoid this-confusion
        let selpanel = this.selectedPanel;

        setTimeout(() => {
          // Close both panels
          selpanel.classList.remove("opened");
          panel.classList.remove("opened");

          // Accept flips again
          this.acceptFlips = true;
        }, SHORT_WAIT_TIME);
      } else {
        // Mark a match
        this.matches++;

        // Disable both buttons (they will remain open)
        this.selectedPanel.disabled = true;
        panel.disabled = true;

        // Accept flips
        this.acceptFlips = true;
      }

      this.selectedPanel = null; // Reset selection regardless of match

      // Check win condition
      if (this.matches === (this.boardsize * this.boardsize) / 2) {
        console.log("CURRENT MATCHES, TOTAL MATCHES:");
        console.log(this.matches);
        console.log((this.boardsize * this.boardsize) / 2);

        console.log("All matches found!");
        // TODO something else
      }
    }
  }

  // Check whether given panels match
  checkMatch(panel1, panel2) {
    if (this.getPanelValue(panel1) === this.getPanelValue(panel2)) {
      console.log("Match found!");
      return true;
    } else {
      console.log("No match. Try again.");
      return false;
    }
  }

  getPanelValue(panel_id) {
    let i = this.panelIndexFromID(panel_id);
    return this.contents[i];
  }

  // Simple help function that parses the index of the panel from
  // its string-form ID. If parsing fails, returns null.
  panelIndexFromID(panel_id) {
    let i = 0;
    try {
      i = parseInt(panel_id.split("_")[1], 10);
    } catch (err) {
      console.log("Error in panelIndexFromID, returning null");
      return null;
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
