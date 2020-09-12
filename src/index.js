import "./styles.css";

document.getElementById("script_text").innerHTML = `
<p>this is the contents of the element "script_text", set to be this way from index.js</p>
`;

// Get game board
const gameboard = document.getElementById("game_board");

// Make game board listen to clicks
gameboard.addEventListener("click", function (e) {
  // e.target is the clicked element, check if it's a panel
  if (e.target && e.target.matches(".game_panel")) {
    flipPanel(e.target.id);
  }
});

var panel_amt = 16;

for (var i = 0; i < panel_amt; i++) {
  addPanel("panel_" + i.toString());
}

// A function that adds a panel to the gameboard under the given id
function addPanel(panel_id) {
  var panel_temp = document.getElementsByTagName("template")[0];
  var panelfrag = panel_temp.content.cloneNode(true);
  var panel = panelfrag.querySelector("button");
  panel.setAttribute("id", panel_id.toString()); // Give panel its id
  //panel.setAttribute("onclick", "flipPanel(this.id)"); // Give panel its id
  gameboard.appendChild(panelfrag);
}

// A function that flips the panel
// (TODO proper functionality)
function flipPanel(panel_id) {
  console.log(panel_id + " flipped!");
}
