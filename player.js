td.Player = function() {
	this.money = 0;
	this.ui = null;
};

td.Player.prototype.setUI = function(ui) {
	this.ui = ui;
};

td.Player.prototype.giveMoney = function(val, ui) {
	this.money += val;
	this.ui.updateMoney(this.money);
};