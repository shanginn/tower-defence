td.UI = function(turrets, towerTypes, player) {
	this.turrets = turrets;
	this.player = player;
	this.towerTypes = towerTypes;
	this.gameDiv = document.getElementById("game");
	this.money = document.getElementById("gameMoney");
	this.gameCover = document.getElementById("gameCover");
	
	// Make the building options list
	this.buildList = document.createElement("div");
	this.buildList.id = "buildList";
	this.gameDiv.appendChild(this.buildList);
	for (i in this.towerTypes) {
		var a = document.createElement("a");
		a.innerHTML = this.towerTypes[i].name;
		a.id = i;
		this.buildList.appendChild(a);
	}
	this.buildList.height = 5 + 30 * Object.keys(this.towerTypes).length
	this.buildList.style.height = this.buildList.height + "px";
	this.buildList.width = 125;
	this.buildList.style.width = this.buildList.width + "px";
	
	this.gameCover.onclick = this.hideAll.bind(this);
	this.hideAll();
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
	var xPixPos = x * 50 + 75;
	var yPixPos = 600 - y * 50 - this.buildList.height;
	if (xPixPos > 800 - this.buildList.width - 25) {
		xPixPos = x * 50 - this.buildList.width - 25;
	}
	if (yPixPos > 600 - this.buildList.height - 25) {
		yPixPos = 600 - this.buildList.height - 25;
	} else if (yPixPos < 25) {
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