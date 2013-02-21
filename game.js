td.GameState = function() {
	this.name = 'gamegamegame';
	this.towerTypes = td.TurretTypes;
	this.enemyTypes = td.EnemyTypes;
	this.map = new td.Map();
	this.emitter = new td.Emitter();
	this.bullets = new td.Bullets();
	this.turrets = new td.Turrets(this.map);
	this.enemies = new td.Enemies(this.enemyTypes);
	this.player = new td.Player();
	this.ui = new td.UI(this.turrets, this.towerTypes, this.player);
	var input = new td.Input(game);
	this.player.setUI(this.ui);
	this.maxDt = 500;
	this.timer = null;
	
	this.player.giveMoney(1000);
	this.enemies.setupWaves(this.map.waves, this.map);
};

td.GameState.prototype.enter = function() {
	if (this.timer === null) {
		console.log("play");
		this.play(Math.round(1000/60));
	} else {
		this.resume(Math.round(1000/60));
	}
};

td.GameState.prototype.resume = function(interval) {
	var ctx = this;
	ctx.startTime = new Date().valueOf() - ctx.timeStamp;
	this.timer = setInterval(function() {
		var deltaTime = new Date().valueOf() - ctx.startTime - ctx.timeStamp;
		if (deltaTime >= interval) {
			ctx.update(interval);
		}
	}, 3);	
};

td.GameState.prototype.exit = function() {
	this.pause();
};

td.GameState.prototype.play = function(interval) {
	var ctx = this;
	ctx.startTime = new Date().valueOf();
	ctx.timeStamp = 0.0;
	this.timer = setInterval(function() {
		var deltaTime = new Date().valueOf() - ctx.startTime - ctx.timeStamp;
		if (deltaTime >= interval) {
			ctx.update(interval);
		}
	}, 3);
};

td.GameState.prototype.pause = function() {
	clearInterval(this.timer);
}

td.GameState.prototype.update = function(dt) {
	if (dt < 0) {
		console.log("Can't go back in time");
	}
	if (dt > this.maxDt) {
		console.log("Can't jump so far forward in time");
		dt = this.maxDt;
	}
	this.enemies.update(dt, this.map, this.timeStamp, this.player);
	this.turrets.update(dt, this.enemies.active, this.bullets);
	this.bullets.update(dt);
	this.emitter.update(dt);
	this.timeStamp += dt;
};