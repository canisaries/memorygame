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

// Enum for game states
const GAMESTATE = {
  NOT_STARTED: 0,
  ONGOING: 1,
  WIN: 2
};

// Short wait time (milliseconds)
const SHORT_WAIT_TIME = 750;

// Long wait time (milliseconds)
const LONG_WAIT_TIME = 1250;

export default class GameBoard {
  constructor(board) {
    this.board = board; // Board element
    this.overlay = null; // Overlay element
    this.stats = null; // Status element

    this.boardsize = BOARD_SIZES.SMALL; // Default size

    this.gamestate = GAMESTATE.NOT_STARTED;

    this.selectedPanel = null; // Currently selected panel

    this.matches = 0; // How many matches player has made
    this.totalmatches = 0; // How many matches there are to find
    this.mistakes = 0; // How many mistakes player has made

    this.acceptFlips = false; // Whether flips are accepted

    // Variable that unambiguously points to the board,
    // used in event handler anon funcs
    let thisobj = this;

    // Make game board listen to clicks
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

  // Function to pass overlay element to gameboard
  setOverlay(overlay) {
    this.overlay = overlay;

    // Variable that unambiguously points to this
    let thisobj = this;

    // Make overlay listen to clicks
    this.overlay.addEventListener("click", () => {
      thisobj.overlayClicked();
    });
  }

  // Function to pass status area element to gameboard
  setStats(stats) {
    this.stats = stats;
  }

  // The function called when the overlay is clicked.
  overlayClicked() {
    // console.log("Overlay clicked!");

    // If the overlay can't be clicked away, return without change
    if (!this.overlay.classList.contains("clickaway")) {
      return;
    }

    // Functiionality based on game state
    if (this.gamestate === GAMESTATE.NOT_STARTED) {
      // If this is the "Click to Begin" overlay, start the game
      this.start();
    } else if (this.gamestate === GAMESTATE.WIN) {
      // If this is the "Click to Play Again" overlay, start a new game
      this.newGame(this.boardsize);
    } else {
      console.log(
        "overlayClicked ERROR: Called in unsupported game state. Returning."
      );
      return;
    }

    // Hide overlay
    this.showOverlay(false);
  }

  // Sets up a new game in a pre-start state.
  newGame(size) {
    this.gamestate = GAMESTATE.NOT_STARTED;

    this.boardsize = size;

    this.setupBoard();
    this.setupPanels();

    this.matches = 0;
    this.totalmatches = (size * size) / 2;
    this.mistakes = 0;
    this.updateMatchCount();
    this.updateMistakeCount();

    // If there is no overlay, start the game right away
    if (this.overlay === null) {
      this.start();
      return;
    }

    // If there is an overlay, set it to show. Clicking it
    // will start the game
    this.showOverlay(true, "Click to Begin");
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

  // Start the game aka change to ONGOING state,
  // enable flips and start the timer.
  start() {
    this.gamestate = GAMESTATE.ONGOING;
    this.acceptFlips = true;
    // TODO start timer!
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
      console.log("Flips aren't accepted yet.");
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
    } else {
      // If this is the second panel to be selected
      console.log(
        "Second panel flipped! Its value was " + this.getPanelValue(panel.id)
      );

      // Mark panel as opened
      panel.classList.add("opened");

      // DO NOT ACCEPT PANEL FLIPS WHILE CHECK IN PROGRESS
      this.acceptFlips = false;
      // TODO: make this also stop hover and click effects

      // If there is no match, keep buttons open for a while and then close.
      // If there is a match, mark a match and disable both buttons.
      // They will remain open. If the game is won, show win message.
      if (!this.checkMatch(this.selectedPanel.id, panel.id)) {
        // Set timeout for short wait time, when time is up close panels
        // and accept flips again

        // Mark a mistake, update stats
        this.mistakes++;
        this.updateMistakeCount();

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
        // Mark a match, update stats
        this.matches++;
        this.updateMatchCount();

        // Disable both buttons (they will remain open)
        this.selectedPanel.disabled = true;
        panel.disabled = true;

        // Accept flips
        this.acceptFlips = true;
      }

      this.selectedPanel = null; // Reset selection regardless of match

      // Check win condition
      if (this.matches === this.totalmatches) {
        console.log("CURRENT MATCHES, TOTAL MATCHES:");
        console.log(this.matches);
        console.log(this.totalmatches);

        console.log("All matches found!");

        // Win
        this.win();
      }
    }
  }

  win() {
    // Set game to Win state
    this.gamestate = GAMESTATE.WIN;

    // If there is no overlay, do nothing
    if (this.overlay === null) {
      return;
    }

    // Show win message
    this.showOverlay(true, "You Won!");
    // Disable clicking away overlay
    this.setOverlayClickaway(false);

    // Show retry message after a while
    setTimeout(() => {
      // Show retry message
      this.setOverlayMessage("Click to Play Again");
      // Enable clicking away overlay
      this.setOverlayClickaway(true);
    }, LONG_WAIT_TIME);
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

  // Show or hide overlay. If message included, update it
  showOverlay(show = true, message = null) {
    if (this.overlay === null) {
      return;
    }

    if (show) {
      this.overlay.classList.remove("hidden");
    } else {
      this.overlay.classList.add("hidden");
    }

    if (message !== null) {
      this.setOverlayMessage(message);
    }
  }

  // Set the message text on the overlay.
  // Does not change overlay visibility.
  setOverlayMessage(message) {
    if (this.overlay === null) {
      return;
    }

    // Get overlay message container
    let msg_container = this.overlay.querySelector("#overlay_message");
    if (msg_container === null || msg_container === undefined) {
      console.log(
        "setOverlayMessage ERROR: Message container was not found. Returning."
      );
      return;
    }

    // Set overlay message
    msg_container.innerHTML = message;
  }

  // Toggle overlay's clickaway functionality
  setOverlayClickaway(clickaway) {
    if (this.overlay === null) {
      return;
    }

    if (clickaway) {
      this.overlay.classList.add("clickaway");
    } else {
      this.overlay.classList.remove("clickaway");
    }
  }

  // Update the count of matches in the stats area
  updateMatchCount() {
    console.log("updateMatchCount called!");
    console.log("Matches: " + this.matches);

    // If there is no (defined) stats area, return
    if (this.stats === null) {
      console.log("updateMistakeCount ERROR: Stats element is null.");
      return;
    }

    let matchDisplay = this.stats.querySelector("#matches");

    if (matchDisplay === null) {
      console.log("updateMatchCount ERROR: Could not find match field.");
      return;
    }

    matchDisplay.innerHTML = this.matches + " / " + this.totalmatches;
  }

  // Update the count of pairs in the stats area
  updateMistakeCount() {
    console.log("updateMistakeCount called!");
    console.log("Mistakes: " + this.mistakes);

    // If there is no (defined) stats area, return
    if (this.stats === null) {
      console.log("updateMistakeCount ERROR: Stats element is null.");
      return;
    }

    let mistakeDisplay = this.stats.querySelector("#mistakes");

    if (mistakeDisplay === null) {
      console.log("updateMistakeCount ERROR: Could not find mistake field.");
      return;
    }

    mistakeDisplay.innerHTML = this.mistakes;
  }

  // Return whether there is a game in progress
  gameInProgress() {
    if (this.gamestate === GAMESTATE.ONGOING) {
      return true;
    } else {
      return false;
    }
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
