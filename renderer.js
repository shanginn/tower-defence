(function(exports) {

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(/* function */ callback, /* DOMElement */ element){
		window.setTimeout(callback, 1000 / 60);
	};
})();

var Renderer = function(game) {
	this.game = game;
	this.canvas = document.getElementById('gameCanvas');
	this.canvas.width = 800;	// Lets go with a fixed canvas size
	this.canvas.height = 600;	// of 800 x 600 for now. Nothing fancy.
	this.context = this.canvas.getContext('2d');
};

Renderer.prototype.render = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	// Map - could be done on a separate layer removing the need to redraw
	this.renderMap();
	
	// Turrets
	this.renderTurrets();
	
	// Enemies
	this.renderEnemies();

	var ctx = this;
	requestAnimFrame(function() {
		ctx.render.call(ctx);
	});
};

Renderer.prototype.renderMap = function() {
	var mapLayout = this.game.map.layout;
	for (var y = 0; y < mapLayout.length; y++) {
		for (var x = 0; x < mapLayout[y].length; x++) {
			if (mapLayout[y][x] === 0) {
				this.context.fillStyle = '#888888';
			} else if (mapLayout[y][x] === 1) {
				this.context.fillStyle = '#CCCCCC';
			} else if (mapLayout[y][x] === 2) {
				this.context.fillStyle = '#FF8866';
			}
			var xGrid = x * this.game.map.gridPixelSize;
			var yGrid = y * this.game.map.gridPixelSize;
			this.context.fillRect(xGrid+1, yGrid+1, this.game.map.gridPixelSize-1,
				this.game.map.gridPixelSize-1);
			if (mapLayout[y][x] === 2) {
				this.context.font = '15pt Arial';
				this.context.textAlign = 'center';
				this.context.fillStyle = '#111111';
				this.context.fillText(this.game.map.goalHp, xGrid + this.game.map.gridPixelSize / 2,
					yGrid + this.game.map.gridPixelSize / 2 + 7);
			}
		}
	}
};

Renderer.prototype.renderTurrets = function() {
	var turretLayout = this.game.turrets.layout;
	for (var y = 0; y < turretLayout.length; y++) {
		for (var x = 0; x < turretLayout[y].length; x++) {
			if (turretLayout[y][x] === 1) {
				var xPixelPos = (x + 0.5) * this.game.map.gridPixelSize - 7;
				var yPixelPos = (y + 0.5) * this.game.map.gridPixelSize - 7;
				this.context.fillStyle = '#1050FF';
				this.context.fillRect(xPixelPos, yPixelPos, 16, 16);
			}
		}
	}
};

Renderer.prototype.renderEnemies = function() {
	var enemies = this.game.enemies.active;
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].finished === 1) {
			continue;
		}
		var xPixelPos = ((enemies[i].xGrid + (enemies[i].xGridNext - enemies[i].xGrid) *
			enemies[i].cellProgress) + 0.5) * this.game.map.gridPixelSize - 5;
		var yPixelPos = ((enemies[i].yGrid + (enemies[i].yGridNext - enemies[i].yGrid) *
			enemies[i].cellProgress) + 0.5) * this.game.map.gridPixelSize - 5;
		this.context.fillStyle = '#FF5010';
		this.context.fillRect(xPixelPos, yPixelPos, 11, 11);
	}
};

exports.Renderer = Renderer;

})(window);