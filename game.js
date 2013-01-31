(function(exports) {

var Game = function() {
	this.name = 'gamegamegame';
	this.map = new Map();
	this.turrets = new Turrets(this.map);
	this.enemies = new Enemies(this.map);
	this.maxDt = 500;
	
	for (var i = 0; i < 5; i++) {
		var newEnemy = new Enemy(3,0);
		this.enemies.addToQueue(newEnemy);
	}
};

Game.prototype.play = function(startTime, interval) {
	var ctx = this;
	ctx.startTime = startTime;
	ctx.timeStamp = new Date().valueOf() - ctx.startTime;
	this.timer = setInterval(function() {
		var currentTime = new Date().valueOf() - ctx.startTime;
		if (currentTime - ctx.timeStamp >= interval) {
			ctx.update(currentTime);
		}
	}, 1);
};

Game.prototype.update = function(currentTime) {
	var dt = currentTime - this.timeStamp;
	if (dt < 0) {
		console.log("Can't go back in time");
	}
	if (dt > this.maxDt) {
		// If this happens we're going to need to get a new snapshot
		// from the server to catch up.
		console.log("Can't jump so far forward in time");
		dt = this.maxDt;
	}
	
	this.enemies.update(dt, this.map, currentTime);
	this.turrets.update(dt, this.enemies.active);
	this.timeStamp += dt;
};

exports.Game = Game;

})(window);