import "./styles.css";

document.getElementById("script_text").innerHTML = `
<p>this is the contents of the element "script_text", set to be this way from index.js</p>
`;

// Get game board
const gameboard = document.getElementById("game_board");

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
  panel.setAttribute("onclick", "console.log(this.id)"); // Give panel its functionality
  gameboard.appendChild(panelfrag);
}

// A function that flips the panel
function flipPanel(panel_id) {
  console.log(panel_id + "flipped!");
}
