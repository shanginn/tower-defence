td.PauseState = function(canvas) {
	this.name = "pause";
	this.canvas = canvas;
	this.canvas.width = 600;
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
	document.getElementById('restart').style.display = 'block';
	document.getElementById('resume').style.display = 'block';
};

td.PauseState.prototype.exit = function() {
	this.removeListeners();
};

td.PauseState.prototype.resume = function() {
	document.getElementById('restart').style.display = 'none';
	document.getElementById('resume').style.display = 'none';
	window.fsm.gotoPrevState();
};

td.PauseState.prototype.setListeners = function() {
	this.canvas.addEventListener("click", this.boundResume, false);
};

td.PauseState.prototype.removeListeners = function() {
	this.canvas.removeEventListener("click", this.boundResume, false);
};

td.Dead = function(canvas){
	this.name = "dead";
	this.canvas = canvas;
	this.canvas.width = 600;
	this.canvas.height = 600;
	this.ctx = window.canvas.getContext("2d");
	this.ctxWidth = this.canvas.width;
	this.ctxHeight = this.canvas.height;
	//this.boundResume = this.resume.bind(this);
}

td.Dead.prototype.enter = function() {
	this.ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
	this.ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
	this.ctx.font = '40pt Arial';
	this.ctx.textAlign = 'center';
	this.ctx.fillStyle = '#AA2200';
	this.ctx.fillText("Fail!", this.ctxWidth / 2, this.ctxHeight / 2);
	this.setListeners();
	document.getElementById('restart').style.display = 'block';
};

td.Dead.prototype.exit = function() {
	this.removeListeners();
};

td.Dead.prototype.resume = function() {
	window.fsm.gotoPrevState();
};

td.Dead.prototype.setListeners = function() {
	this.canvas.addEventListener("click", this.boundResume, false);
};

td.Dead.prototype.removeListeners = function() {
	this.canvas.removeEventListener("click", this.boundResume, false);
};

td.Win = function(canvas){
	this.name = "win";
	this.canvas = canvas;
	this.canvas.width = 600;
	this.canvas.height = 600;
	this.ctx = window.canvas.getContext("2d");
	this.ctxWidth = this.canvas.width;
	this.ctxHeight = this.canvas.height;
	//this.boundResume = this.resume.bind(this);
}

td.Win.prototype.enter = function() {
	this.ctx.fillStyle = 'rgba(50, 50, 50, 0.9)';
	this.ctx.fillRect(0, 0, this.ctxWidth, this.ctxHeight);
	this.ctx.font = '40pt Arial';
	this.ctx.textAlign = 'center';
	this.ctx.fillStyle = '#adff2f';
	this.ctx.fillText("You win!", this.ctxWidth / 2, this.ctxHeight / 2);
	this.setListeners();
	document.getElementById('restart').style.display = 'block';
};

td.Win.prototype.exit = function() {
	this.removeListeners();
};

td.Win.prototype.resume = function() {
	window.fsm.gotoPrevState();
};

td.Win.prototype.setListeners = function() {
	this.canvas.addEventListener("click", this.boundResume, false);
};

td.Win.prototype.removeListeners = function() {
	this.canvas.removeEventListener("click", this.boundResume, false);
};