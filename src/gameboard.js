// Class GameBoard that represents the game board.
// Handles panel actions and stores their states.

// Enum for board sizes (side length)
export const BOARD_SIZES = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12
};

export default class GameBoard {
  constructor(board) {
    this.board = board;
    this.panels = 16; // Default amount of panels
    this.selectedPanel = null; // Currently selected panel

    // Make game board listen to clicks
    let thisobj = this; // Workaround to allow self-reference in anon func
    this.board.addEventListener("click", function (e) {
      // e.target is the clicked element, check if it's a panel
      if (e.target && e.target.matches(".game_panel")) {
        thisobj.flipPanel(e.target.id);
      }
    });
  }

  // Resets any possible old game and sets up panels.
  newGame(size) {
    this.setupPanels(size * size);
  }

  // Adds panels to board
  setupPanels(panel_amt) {
    this.panels = panel_amt;

    for (let i = 0; i < panel_amt; i++) {
      this.addPanel("panel_" + i.toString());
    }

    // Create contents array
    this.contents = [];

    // Push each possible value in twice
    for (let i = 0; i < panel_amt / 2; i++) {
      this.contents.push(i);
      this.contents.push(i);
    }

    // Shuffle array
    this.contents = shuffle(this.contents);
  }

  // A function that adds a panel to the gameboard under the given id
  addPanel(panel_id) {
    var panel_temp = document.getElementsByTagName("template")[0];
    var panelfrag = panel_temp.content.cloneNode(true);
    var panel = panelfrag.querySelector("button");
    panel.setAttribute("id", panel_id.toString()); // Give panel its id
    this.board.appendChild(panelfrag);
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
