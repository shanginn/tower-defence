td.PauseState = function(canvas) {
	this.name = "pause";
	this.canvas = canvas;
	this.canvas.width = 800;
	this.canvas.height = 600;
	this.ctx = window.canvas.getContext("2d");
	this.ctxWidth = this.canvas.width;
	this.ctxHeight = this.canvas.height;
	this.boundResume = this.resume.bind(this);
};

td.PauseState.prototype.enter = function() {
	this.ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
	this.ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
	this.ctx.font = '40pt Arial';
	this.ctx.textAlign = 'center';
	this.ctx.fillStyle = '#FFFFFF';
	this.ctx.fillText("Paused", this.ctxWidth / 2, this.ctxHeight / 2);
	this.setListeners();
};

td.PauseState.prototype.exit = function() {
	this.removeListeners();
};

td.PauseState.prototype.resume = function() {
	window.fsm.gotoPrevState();
};

td.PauseState.prototype.setListeners = function() {
	this.canvas.addEventListener("click", this.boundResume, false);
};

td.PauseState.prototype.removeListeners = function() {
	this.canvas.removeEventListener("click", this.boundResume, false);
};