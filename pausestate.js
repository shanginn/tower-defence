td.PauseState = function(ui) {
	this.name = "pause";
	this.ui = ui;
};

td.PauseState.prototype.enter = function() {
	this.ui.pauseOn();
};

td.PauseState.prototype.exit = function() {
	this.ui.pauseOff();
};