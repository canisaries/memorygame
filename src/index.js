import "./styles.css";

document.getElementById("script_text").innerHTML = `
<p>this is the contents of the element "script_text", set to be this way from index.js</p>
`;

// Get game board
const gameboard = document.getElementById("game_board");

// A function that adds a button to the gameboard under the given id

function addButton(button_id) {
  var button_temp = document.getElementsByTagName("template")[0];
  var button = button_temp.content.cloneNode(true);
  button.id = button_id;
  gameboard.appendChild(button);
}

var panel_amt = 16;

for (var i = 0; i < panel_amt; i++) {
  addButton("panel_" + i.toString());
}
