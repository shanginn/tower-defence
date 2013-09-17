td.Player = function() {
	this.money = 0;
	this.lvl = 0;
	this.moneyInterval = 1000;
	this.exp = 0;
	this.lvls = [0];
	for(var i = 6; i < 20; i++)
		this.lvls[i-5] = Math.floor(Math.exp(i));
};

td.Player.prototype.giveMoney = function(val) {
	this.money += val;
	gameMoney.textContent = this.money;
};

td.Player.prototype.lvlUp = function() {
	this.lvl++;
	gameLvl.textContent = (this.lvl + 1);
};

td.Player.prototype.giveExp = function(exp) {
	this.exp += exp;
	if(this.exp > this.lvls[this.lvl+1]){
		this.lvlUp();
		this.exp -= this.lvls[this.lvl];
		console.log(this.exp,this.lvls[this.lvl],this.lvl);
	}
	gameExp.textContent = this.exp + "/" + this.lvls[this.lvl+1];
}
