td.UI = function(turrets, towerTypes, player) {
	this.turrets = turrets;
	this.towerTypes = towerTypes;
	this.money = document.getElementById("gameMoney");
	this.gameCover = document.getElementById("gameCover");
	this.buildList = document.getElementById("gameTowerSelection");
	this.player = player;
	this.hideAll();
	this.gameCover.onclick = this.hideAll.bind(this);
};

td.UI.prototype.hideAll = function() {
	this.gameCover.style.visibility = "hidden";
	this.buildList.style.visibility = "hidden";
};

td.UI.prototype.buildTower = function(type) {
	this.player.giveMoney(-this.towerTypes[type].cost);
	this.turrets.spawn(this.x, this.y, type);
	this.gameCover.style.visibility = "hidden";
	this.buildList.style.visibility = "hidden";
};

td.UI.prototype.towerSelection = function(x, y) {
	this.x = x;
	this.y = y;
	var xPixPos = x * 50 + 75;
	var yPixPos = 600 - y * 50 - 125;
	if (xPixPos > 680) {
		xPixPos = x * 50 - 150;
	}
	if (yPixPos > 375) {
		yPixPos = 375;
	} else if (yPixPos < 0) {
		yPixPos = 25;
	}
	this.buildList.style.left = xPixPos + "px";
	this.buildList.style.bottom = yPixPos + "px";
	
	this.gameCover.style.visibility = "visible";
	this.buildList.style.visibility = "visible";
};

td.UI.prototype.updateMoney = function() {
	this.money.innerHTML = "Money: " + this.player.money.toString();
	if (this.player.money >= this.towerTypes["gun"].cost) {
		document.getElementById("gun").onclick = this.buildTower.bind(this, "gun");
	} else {
		document.getElementById("gun").onclick = null;
	}
	if (this.player.money >= this.towerTypes["art"].cost) {
		document.getElementById("art").onclick = this.buildTower.bind(this, "art");
	} else {
		document.getElementById("art").onclick = null;
	}
};