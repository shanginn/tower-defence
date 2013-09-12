// shim layer with setTimeout fallback

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
} )();

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

td.Renderer = function(canvas, game) {
	this.game = game;
	this.canvas = canvas;
	this.ctx = this.canvas.getContext('2d');
	this.raf = null;
};

td.Renderer.prototype.startRendering = function() {
	var _this = this;
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	this.renderMap();
	this.renderTurrets();
	this.renderEnemies();
	this.renderTracers();
	this.renderBullets();
	this.game.ui.render(this.ctx);
	
	this.raf = requestAnimFrame(function() {
		_this.startRendering();
	}, this.ctx);
};

td.Renderer.prototype.stopRendering = function() {
	cancelRequestAnimFrame(this.raf);
};
td.Renderer.prototype.setCell = function (cellX,cellY,arg) {
	this.game.map.layout[cellX][cellY] = arg;
}

td.Renderer.prototype.renderMap = function() {
	var mapLayout = this.game.map.layout;
	for (var y = 0; y < mapLayout.length; y++) {
		for (var x = 0; x < mapLayout[y].length; x++) {
			if (mapLayout[y][x] === 0) {
				this.ctx.fillStyle = '#888888';
			} else if (mapLayout[y][x] === 1) {
				this.ctx.fillStyle = '#CCCCCC';
			} else if (mapLayout[y][x] === 2) {
				this.ctx.fillStyle = '#FF8866';
			}/* else if (mapLayout[y][x] === 3) {
				this.ctx.fillStyle = "rgba(0.7, 0.1, 0.3, 0.2)";;
			}*/
			var xGrid = x * this.game.map.gridPixelSize;
			var yGrid = y * this.game.map.gridPixelSize;
			this.ctx.fillRect(xGrid+1, yGrid+1, this.game.map.gridPixelSize-1,
				this.game.map.gridPixelSize-1);
/* хп на последней клетке
			if (mapLayout[y][x] === 2) {
				this.ctx.font = '10pt Arial';
				this.ctx.textAlign = 'center';
				this.ctx.fillStyle = '#111111';
				this.ctx.fillText(this.game.map.goalHp, xGrid + this.game.map.gridPixelSize / 2,
					yGrid + this.game.map.gridPixelSize / 2 + 5);
			}
*/			
		}
	}
};

td.Renderer.prototype.renderTurrets = function() {
	var turrets = this.game.turrets.active;
	for (var i = 0; i < turrets.length; i++) {
		var xPixelPos = (turrets[i].xGrid + 0.5) * this.game.map.gridPixelSize;
		var yPixelPos = (turrets[i].yGrid + 0.5) * this.game.map.gridPixelSize;
		var color = "#1050FF";
		var halfSize = 5;
		this.ctx.beginPath();
		this.ctx.fillStyle = turrets[i].color;
		//console.log(turrets[i].halfSize);
		this.ctx.fillRect(xPixelPos - turrets[i].halfSize, yPixelPos - turrets[i].halfSize, 2 * turrets[i].halfSize, 2 * turrets[i].halfSize);
		this.ctx.fill();
		this.ctx.closePath();		
	}	
};

td.Renderer.prototype.renderEnemies = function() {
	var enemies = this.game.enemies.active;
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].finished === 1) {
			continue;
		}
		var xPixelPos = ((enemies[i].xGrid + (enemies[i].xGridNext - enemies[i].xGrid) *
			enemies[i].cellProgress) + 0.5) * this.game.map.gridPixelSize;
		var yPixelPos = ((enemies[i].yGrid + (enemies[i].yGridNext - enemies[i].yGrid) *
			enemies[i].cellProgress) + 0.5) * this.game.map.gridPixelSize;
		var color = "#FF5010";
		var halfSize = 5;
		switch (enemies[i].name) {
			case "scout":
				color = "#FF5010";
				halfSize = 4;
				break;
			case "heavy":
				color = "#721F00";
				halfSize = 7;
				break;
			case "soldier":
				color = "#C13400";
				halfSize = 5;
				break;
		}
		this.ctx.fillStyle = color;
		this.ctx.fillRect(xPixelPos - halfSize, yPixelPos - halfSize, 2 * halfSize, 2 * halfSize);

		this.ctx.fillStyle = "#a5260a";
		this.ctx.fillRect(xPixelPos - halfSize, yPixelPos - 5 - halfSize, enemies[i].hp/5, 3);
		//this.ctx.fillStyle = "#af4035";
		//this.ctx.fillRect(xPixelPos - halfSize, yPixelPos - 10 - halfSize, enemies[i].hp, 2);

	}
};

td.Renderer.prototype.renderTracers = function() {
	for (var i = 0; i < this.game.emitter.liveTracers; i++) {
		var xPixelStart = (this.game.emitter.tracerPool[i].xStart + 0.5) * this.game.map.gridPixelSize;
		var yPixelStart = (this.game.emitter.tracerPool[i].yStart + 0.5) * this.game.map.gridPixelSize;
		var xPixelEnd = (this.game.emitter.tracerPool[i].xEnd + 0.5) * this.game.map.gridPixelSize;
		var yPixelEnd = (this.game.emitter.tracerPool[i].yEnd + 0.5) * this.game.map.gridPixelSize;
		this.ctx.strokeStyle = this.game.emitter.tracerPool[i].color;
		this.ctx.lineWidth = 4;
		this.ctx.beginPath();
		this.ctx.moveTo(xPixelStart, yPixelStart);
		this.ctx.lineTo(xPixelEnd, yPixelEnd);
		this.ctx.stroke();
		this.ctx.closePath();
	}
};

td.Renderer.prototype.renderBullets = function() {
	var bulletList = this.game.bullets.active;
	var liveNum = this.game.bullets.liveBullets;
	for (var i = 0; i < liveNum; i++) {
		var xPixel = (bulletList[i].xGrid + 0.5) * this.game.map.gridPixelSize;
		var yPixel = (bulletList[i].yGrid + 0.5) * this.game.map.gridPixelSize;
		this.ctx.strokeStyle = "#341242";
		this.ctx.fillStyle = '#C81414';
		this.ctx.lineWidth = 4;
		this.ctx.beginPath();
		this.ctx.arc(xPixel, yPixel, 2, 0, 2*Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}
};