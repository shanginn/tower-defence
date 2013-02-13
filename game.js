td.Game = function() {
	this.name = 'gamegamegame';
	this.towerTypes = td.TurretTypes;
	this.map = new td.Map();
	this.emitter = new td.Emitter();
	this.bullets = new td.Bullets();
	this.turrets = new td.Turrets(this.map);
	this.enemies = new td.Enemies(this.map);
	this.player = new td.Player();
	this.ui = new td.UI(this.turrets, this.towerTypes, this.player);
	var input = new td.Input(game);
	this.player.setUI(this.ui);
	this.maxDt = 500;
	
	this.player.giveMoney(1000);
	
	for (var i = 0; i < 5; i++) {
		var newEnemy = new td.Enemy(3, 0, this.map);
		this.enemies.addToQueue(newEnemy);
	}
};

td.Game.prototype.play = function(startTime, interval) {
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

td.Game.prototype.update = function(currentTime) {
	var dt = currentTime - this.timeStamp;
	if (dt < 0) {
		console.log("Can't go back in time");
	}
	if (dt > this.maxDt) {
		console.log("Can't jump so far forward in time");
		dt = this.maxDt;
	}
	
	this.enemies.update(dt, this.map, currentTime, this.player);
	this.turrets.update(dt, this.enemies.active, this.bullets);
	this.bullets.update(dt);
	this.emitter.update(dt);
	this.timeStamp += dt;
};