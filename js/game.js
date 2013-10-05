td.GameState = function(canvas) {
	this.name = 'gamegamegame';
	this.towerTypes = null;
	this.enemyTypes = null;
	this.map = null;
	this.emitter = null;
	this.bullets = null;
	this.turrets = null;
	this.enemies = null;
	this.player = null;
	this.ui = null;
	
	this.canvas = canvas;
	this.canvas.width = 600;
	this.canvas.height = 600;
	this.ctx = window.canvas.getContext("2d");

	self = this;
	this.canvas.addEventListener('mousemove',function(e){
		self.mouseX = e.offsetX;
		self.mouseY = e.offsetY;
	},false);

	this.renderer = new td.Renderer(this.canvas, this);
	this.ui = new td.UI();
	this.emitter = new td.Emitter();
	
	this.timer = null;
	
	this.setup();
	this.boundClickHandler = this.clickHandler.bind(this);
	this.boundBlur = this.onBlur.bind(this);
};

td.GameState.prototype.setup = function() {
	this.enemyTypes = td.EnemyTypes;
	this.towerTypes = td.TurretTypes;
	this.map = new td.Map();
	this.bullets = new td.Bullets();
	this.turrets = new td.Turrets(this.map);
	this.enemies = new td.Enemies(this.enemyTypes);
	this.player = new td.Player();
	this.ui.setup(this.turrets, this.towerTypes, this.player, this.map, this);
	this.turrets.setup(this.player);
	this.player.giveMoney(600);
	user = this.player;
	this.moneyIntervalId = setInterval(function(){ user.giveMoney(1);},this.player.moneyInterval);
	this.enemies.setupWaves(this.map.waves, this.map);
};

td.GameState.prototype.enter = function() {
	if (this.timer === null) {
		this.play(Math.round(1000/60));
	} else {
		this.resume(Math.round(1000/60));
	}
	this.addClickListener();
	this.renderer.startRendering();
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
	user = this.player;
	this.moneyIntervalId = setInterval(function(){ user.giveMoney(1);},this.player.moneyInterval);	
};

td.GameState.prototype.exit = function() {
	this.pause();
	this.removeClickListener();
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
	clearInterval(this.moneyIntervalId);
	this.renderer.stopRendering();
}

td.GameState.prototype.dead = function() {
	clearInterval(this.timer);
	this.renderer.stopRendering();
}

td.GameState.prototype.update = function(dt) {
	this.enemies.update(dt, this.map, this.timeStamp, this.player);
	this.turrets.update(dt, this.enemies.active, this.bullets);
	this.bullets.update(dt);
	this.emitter.update(dt);
	this.timeStamp += dt;
};

td.GameState.prototype.addClickListener = function() {
	this.canvas.addEventListener("click", this.boundClickHandler, false);
	window.addEventListener("blur", this.boundBlur, false);
};

td.GameState.prototype.removeClickListener = function() {
	this.canvas.removeEventListener("click", this.boundClickHandler, false);
	window.removeEventListener("blur", this.boundBlur, false);
};

td.GameState.prototype.clickHandler = function(evt) {
	var mcX = evt.clientX - evt.target.getBoundingClientRect().left;
	var mcY = evt.clientY - evt.target.getBoundingClientRect().top;
	this.ui.click(mcX, mcY);
};

td.GameState.prototype.onBlur = function() {
	window.fsm.changeState(window.pause);
};
