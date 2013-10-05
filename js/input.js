td.Input = function() {
	var ctx = this;
	
	// Mouse
	var canvas = document.getElementById('gameCanvas');
	canvas.addEventListener('click', function(e) {
		ctx.onClick.call(ctx, e);
	});
	
	// Pause while window doesnt have focus
	window.onblur = function() {
		if (window.fsm.getName() === "gamegamegame") {
			window.fsm.changeState(window.pause);
		}
	}.bind(this);

};

td.Input.prototype.onClick = function(event) {
	// mcX and mcY are x and y positions of the click
	var mcX = event.clientX - event.target.getBoundingClientRect().left;
	var mcY = event.clientY - event.target.getBoundingClientRect().top;
	
	// Find which cell on the map.layout they clicked
	var xCell = Math.floor(mcX / window.game.map.gridPixelSize);
	var yCell = Math.floor(mcY / window.game.map.gridPixelSize);
	
	// If the cell is empty terrain (== 0 in map.layout array) and 
	// has no turret already then put a turret there
	if (window.game.map.layout[yCell][xCell] === 0 && window.game.turrets.layout[yCell][xCell] == 0) {
		window.game.ui.towerSelection(xCell, yCell);
	}
};