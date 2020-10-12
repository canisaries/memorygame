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

    // Make game board listen to clicks
    this.board.addEventListener("click", function (e) {
      // e.target is the clicked element, check if it's a panel
      if (e.target && e.target.matches(".game_panel")) {
        this.flipPanel(e.target.id);
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
    console.log(panel_id + " flipped!");
  }
}
