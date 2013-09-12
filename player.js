td.Player = function() {
	this.money = 0;
	//this.setUI('gameStats')
};

/*td.Player.prototype.setUI = function(ui) {
	this.ui = ui;
};
*/
td.Player.prototype.giveMoney = function(val) {
	this.money += val;
	this.updateMoney(this.money);
};

td.Player.prototype.updateMoney = function(mon) {
	gameMoney.textContent = mon;
}