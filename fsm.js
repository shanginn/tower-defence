td.FSM = function() {
	this.currentState = null;
	this.prevState = null;
};

td.FSM.prototype.getName = function() {
	return this.currentState.name;
};

td.FSM.prototype.setInitialState = function(aState) {
	this.currentState = aState;
	this.currentState.enter();
};

td.FSM.prototype.changeState = function(aState) {
	this.currentState.exit();
	this.prevState = this.currentState;
	this.currentState = aState;
	this.currentState.enter();
};

td.FSM.prototype.gotoPrevState = function() {
	this.currentState.exit();
	this.currentState = this.prevState;
	this.currentState.enter();
};

td.FSM.prototype.update = function() {
	if (this.currentState) {
		this.currentState.update();
	}
};

td.FSM.prototype.stopState = function() {
	this.currentState.exit();
};

td.FSM.prototype.startState = function() {
	this.currentState.enter();
};