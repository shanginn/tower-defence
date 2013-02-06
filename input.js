(function(exports) {

var Input = function(game) {
	this.game = game;
	var ctx = this;
	
	// Mouse
	var canvas = document.getElementById('gameCanvas');
	canvas.addEventListener('click', function(e) {
		ctx.onClick.call(ctx, e);
	});
};

Input.prototype.onClick = function(event) {
	// mcX and mcY are x and y positions of the click
	var mcX = event.clientX - event.target.getBoundingClientRect().left;
	var mcY = event.clientY - event.target.getBoundingClientRect().top;
	
	// Find which cell on the map.layout they clicked
	var xCell = Math.floor(mcX / this.game.map.gridPixelSize);
	var yCell = Math.floor(mcY / this.game.map.gridPixelSize);
	
	// If the cell is empty terrain (== 0 in map.layout array) and 
	// has no turret already then put a turret there
	if (this.game.map.layout[yCell][xCell] === 0) {
		this.game.ui.towerSelection(xCell, yCell);
	}
};

exports.Input = Input;

})(window);