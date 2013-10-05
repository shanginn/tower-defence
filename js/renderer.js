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
	this.tails = td.Wang(10);
	this.edge = 62;
	this.bg = document.getElementById('bg');

	var n = 0;
	var titles = [];
	for(var i = 1; i <= 4; i++){
		for(var j=1; j <= 4; j++){
			titles[n++] = {
				x: 2+(this.edge+2)*(j-1),
				y: 2+(this.edge+2)*(i-1),
			};
		}
	}
	for(var y in this.tails) {
		for(var x in this.tails[y]) {
			this.ctx.drawImage(bg,
				titles[this.tails[y][x]].x,
				titles[this.tails[y][x]].y,
				this.edge, this.edge, x*this.edge/5, y*this.edge/5, this.edge/5,this.edge/5);
		}
	}
	this.bg.src=this.canvas.toDataURL("image/png");

};

td.Renderer.prototype.startRendering = function() {
	var _this = this;
	var Range;
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
	this.ctx.drawImage(this.bg,0,0);
	var mapLayout = this.game.map.layout;
	for (var y = 0; y < mapLayout.length; y++) {
		for (var x = 0; x < mapLayout[y].length; x++) {
			if (mapLayout[y][x] === 0) {
				this.ctx.fillStyle = 'rgba(1,1,1,0)';
			} else if (mapLayout[y][x] === 1) {
				this.ctx.fillStyle = '#CCCCCC';
			} else if (mapLayout[y][x] === 2) {
				this.ctx.fillStyle = '#FF8866';
			}
			var xGrid = x * this.game.map.gridPixelSize;
			var yGrid = y * this.game.map.gridPixelSize;
			this.ctx.fillRect(xGrid+1, yGrid+1, this.game.map.gridPixelSize-1,
				this.game.map.gridPixelSize-1);
		}
	}
};

td.Renderer.prototype.renderTurrets = function() {
	var turrets = this.game.turrets.active;
	function shadeColor(color, percent) {
		//console.log(color);
		var num = parseInt(color.substring(1),16),
		amt = Math.round(2.55 * percent),
		R = (num >> 16) + amt,
		B = (num >> 8 & 0x00FF) + amt,
		G = (num & 0x0000FF) + amt;
		return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
	}
	for (var i = 0; i < turrets.length; i++) {
		if(turrets[i]){
			var xPixelPos = (turrets[i].xGrid + 0.5) * this.game.map.gridPixelSize;
			var yPixelPos = (turrets[i].yGrid + 0.5) * this.game.map.gridPixelSize;
			var color = turrets[i].color;
			var halfSize = turrets[i].halfSize;
			var lvl = turrets[i].lvl;
			this.ctx.beginPath();
			color = shadeColor(color,(lvl)*15);
			this.ctx.fillStyle = color;
			this.ctx.fillRect(xPixelPos - halfSize*(1/(i+1)), yPixelPos - halfSize*(1/(i+1)), 2 * halfSize*(1/(i+1)), 2 * halfSize*(1/(i+1)));
			this.ctx.fillRect(xPixelPos - halfSize, yPixelPos - halfSize, 2 * halfSize, 2 * halfSize);			
			this.ctx.fill();
			this.ctx.closePath();
		}
	}	
};

td.Renderer.prototype.renderEnemies = function(isRange) {
	var enemies = this.game.enemies.active;
	
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].finished === 1) {
			continue;
		}
		var xPixelPos = ((enemies[i].xGrid + (enemies[i].xGridNext - enemies[i].xGrid) *
			enemies[i].cellProgress) + 0.5) * this.game.map.gridPixelSize;
		var yPixelPos = ((enemies[i].yGrid + (enemies[i].yGridNext - enemies[i].yGrid) *
			enemies[i].cellProgress) + 0.5) * this.game.map.gridPixelSize;
		var color = enemies[i].color;
		var halfSize = enemies[i].size/5;
		
		if(enemies[i].isFly){
			this.ctx.fillStyle = "rgba(0, 1, 1, 0.15)";
			this.ctx.fillRect(xPixelPos - halfSize - 5, yPixelPos - halfSize + 5, 2 * halfSize, 2 * halfSize);	
		}

		var atEnemy = this.game.mouseX > xPixelPos - halfSize && this.game.mouseX < xPixelPos + halfSize &&
			this.game.mouseY > yPixelPos - halfSize && this.game.mouseY < yPixelPos + halfSize;
		if( typeof td.Renderer.range != 'undefined' )
			var	inCircle = (xPixelPos - td.Renderer.range.x0)*(xPixelPos - td.Renderer.range.x0) +
				(yPixelPos - td.Renderer.range.y0)*(yPixelPos - td.Renderer.range.y0) < td.Renderer.range.r*td.Renderer.range.r;
		if(atEnemy && inCircle){
			//Обводка противника под мышкой
			this.ctx.strokeStyle = "rgba(200,0,10,0.4)"
			this.ctx.lineWidth = 2;
			this.ctx.strokeRect(xPixelPos - halfSize, yPixelPos - halfSize, 2 * halfSize, 2 * halfSize);
		}

		this.ctx.fillStyle = color;
		this.ctx.fillRect(xPixelPos - halfSize, yPixelPos - halfSize, 2 * halfSize, 2 * halfSize);

		this.ctx.fillStyle = "rgba(1,0,0,0.2);";
		this.ctx.fillRect(xPixelPos - halfSize, yPixelPos - 5 - halfSize, halfSize*2, 3);

		this.ctx.fillStyle = "#a5260a";
		this.ctx.fillRect(xPixelPos - halfSize, yPixelPos - 5 - halfSize, (enemies[i].hp/enemies[i].maxHp)*halfSize*2, 3);

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
		//this.ctx.strokeStyle = bulletList[i].color;
		this.ctx.fillStyle = bulletList[i].color;
		//console.log(bulletList[i].color);
		this.ctx.lineWidth = 4;
		this.ctx.beginPath();
		this.ctx.arc(xPixel, yPixel, 2, 0, 2*Math.PI);
		this.ctx.fill();
		this.ctx.closePath();
	}
};