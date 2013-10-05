td.MainMenu = function(canvas) {
	this.name = "mainMenu";
	this.canvas = canvas;
	this.canvas.width = 800;
	this.canvas.height = 600;
	this.ctx = window.canvas.getContext("2d");
	this.ctxWidth = this.canvas.width;
	this.ctxHeight = this.canvas.height;
	this.boundStartGame = this.startGame.bind(this);
};

td.MainMenu.prototype.enter = function() {
	this.ctx.clearRect(0, 0, this.ctxWidth, this.ctxHeight);
	this.ctx.fillStyle = '#111111';
	this.ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
	this.ctx.font = '40pt Arial';
	this.ctx.textAlign = 'center';
	this.ctx.fillStyle = '#FFFFFF';
	this.ctx.fillText("A Tower Defence Game", this.ctxWidth / 2, this.ctxHeight / 2);
	this.setListeners();
};

td.MainMenu.prototype.exit = function() {
	this.removeListeners();
};

td.MainMenu.prototype.setListeners = function() {
	this.canvas.addEventListener("click", this.boundStartGame, false);
};

td.MainMenu.prototype.removeListeners = function() {
	this.canvas.removeEventListener("click", this.boundStartGame, false);
};

td.MainMenu.prototype.startGame = function() {
	window.fsm.changeState(window.pause);
};