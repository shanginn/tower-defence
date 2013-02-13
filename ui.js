td.UI = function(turrets, towerTypes, player) {
	this.turrets = turrets;
	this.towerTypes = towerTypes;
	this.money = document.getElementById("gameMoney");
	this.gameCover = document.getElementById("gameCover");
	this.buildList = document.getElementById("gameTowerSelection");
	this.player = player;
	this.hideAll();
	this.gameCover.onclick = this.hideAll.bind(this);
	for (i in this.towerTypes) {
		var a = document.createElement("a");
		a.innerHTML = this.towerTypes[i].name;
		a.id = i;
		this.buildList.appendChild(a);
	}
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
	for (i in this.towerTypes) {
		var a = document.getElementById(i);
		if (this.player.money >= this.towerTypes[i].cost) {
			a.onclick = this.buildTower.bind(this, i);
			a.className = "";
		} else {
			a.onclick = null;
			a.className = "inactive";
		}
	}
};