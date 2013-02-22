td.UI = function() {
	this.gameDiv = document.getElementById("game");
	this.money = document.getElementById("gameMoney");
	this.gameCover = document.getElementById("gameCover");
	this.pauseCover = document.getElementById("pauseCover");
	this.gameStats = document.getElementById("gameStats");
};

td.UI.prototype.setup = function(turrets, towerTypes, player) {
	this.turrets = turrets;
	this.player = player;
	this.towerTypes = towerTypes;
	
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
	this.buildList.height = 5 + 35 * Object.keys(this.towerTypes).length;
	this.buildList.width = 125;
	this.buildList.style.height = this.buildList.height + "px";
	this.buildList.style.width = this.buildList.width + "px";
	
	// Make the tower statistics box
	this.towerStats = document.createElement("div");
	this.towerStats.id = "towerStats";
	this.gameDiv.appendChild(this.towerStats);
	this.towerStats.height = 200;
	this.towerStats.width = 225;
	this.towerStats.style.height = this.towerStats.height + "px";
	this.towerStats.style.width = this.towerStats.width + "px";
	this.towerStats.rangeTitle = document.createElement("div");
	this.towerStats.rangeTitle.id = "statTitle";
	this.towerStats.rangeTitle.style.left = "20px";
	this.towerStats.rangeTitle.style.top = "10px";
	this.towerStats.rangeTitle.style.height = "25px";
	this.towerStats.rangeTitle.innerHTML = "range";
	this.towerStats.appendChild(this.towerStats.rangeTitle);
	this.towerStats.rangeBarBack = document.createElement("div");
	this.towerStats.rangeBarBack.id = "statBarBack";
	this.towerStats.rangeBarBack.style.left = "90px";
	this.towerStats.rangeBarBack.style.top = "10px";
	this.towerStats.rangeBarBack.style.height = "25px";
	this.towerStats.rangeBarBack.style.width = "125px";
	this.towerStats.appendChild(this.towerStats.rangeBarBack);
	this.towerStats.rangeBarFore = document.createElement("div");
	this.towerStats.rangeBarFore.id = "statBarFore";
	this.towerStats.rangeBarFore.style.left = "92px";
	this.towerStats.rangeBarFore.style.top = "12px";
	this.towerStats.rangeBarFore.style.height = "21px";
	this.towerStats.rangeBarFore.style.width = "2px";
	this.towerStats.appendChild(this.towerStats.rangeBarFore);
	this.towerStats.damageTitle = document.createElement("div");
	this.towerStats.damageTitle.id = "statTitle";
	this.towerStats.damageTitle.style.left = "11px";
	this.towerStats.damageTitle.style.top = "45px";
	this.towerStats.damageTitle.style.height = "25px";
	this.towerStats.damageTitle.innerHTML = "damage";
	this.towerStats.appendChild(this.towerStats.damageTitle);
	this.towerStats.damageBarBack = document.createElement("div");
	this.towerStats.damageBarBack.id = "statBarBack";
	this.towerStats.damageBarBack.style.left = "90px";
	this.towerStats.damageBarBack.style.top = "45px";
	this.towerStats.damageBarBack.style.height = "25px";
	this.towerStats.damageBarBack.style.width = "125px";
	this.towerStats.appendChild(this.towerStats.damageBarBack);
	this.towerStats.damageBarFore = document.createElement("div");
	this.towerStats.damageBarFore.id = "statBarFore";
	this.towerStats.damageBarFore.style.left = "92px";
	this.towerStats.damageBarFore.style.top = "47px";
	this.towerStats.damageBarFore.style.height = "21px";
	this.towerStats.damageBarFore.style.width = "2px";
	this.towerStats.appendChild(this.towerStats.damageBarFore);
	this.towerStats.rateTitle = document.createElement("div");
	this.towerStats.rateTitle.id = "statTitle";
	this.towerStats.rateTitle.style.left = "25px";
	this.towerStats.rateTitle.style.top = "80px";
	this.towerStats.rateTitle.style.height = "25px";
	this.towerStats.rateTitle.innerHTML = "rate";
	this.towerStats.appendChild(this.towerStats.rateTitle);
	this.towerStats.rateBarBack = document.createElement("div");
	this.towerStats.rateBarBack.id = "statBarBack";
	this.towerStats.rateBarBack.style.left = "90px";
	this.towerStats.rateBarBack.style.top = "80px";
	this.towerStats.rateBarBack.style.height = "25px";
	this.towerStats.rateBarBack.style.width = "125px";
	this.towerStats.appendChild(this.towerStats.rateBarBack);
	this.towerStats.rateBarFore = document.createElement("div");
	this.towerStats.rateBarFore.id = "statBarFore";
	this.towerStats.rateBarFore.style.left = "92px";
	this.towerStats.rateBarFore.style.top = "82px";
	this.towerStats.rateBarFore.style.height = "21px";
	this.towerStats.rateBarFore.style.width = "2px";
	this.towerStats.appendChild(this.towerStats.rateBarFore);
	this.towerStats.nameTitle = document.createElement("div");
	this.towerStats.nameTitle.id = "statTitle";
	this.towerStats.nameTitle.style.left = "0px";
	this.towerStats.nameTitle.style.top = "125px";
	this.towerStats.nameTitle.style.height = "25px";
	this.towerStats.nameTitle.style.width = this.towerStats.style.width;
	this.towerStats.nameTitle.innerHTML = "";
	this.towerStats.appendChild(this.towerStats.nameTitle);
	this.towerStats.costTitle = document.createElement("div");
	this.towerStats.costTitle.id = "statTitle";
	this.towerStats.costTitle.style.left = "0px";
	this.towerStats.costTitle.style.top = "160px";
	this.towerStats.costTitle.style.height = "25px";
	this.towerStats.costTitle.style.width = this.towerStats.style.width;
	this.towerStats.costTitle.innerHTML = "";
	this.towerStats.appendChild(this.towerStats.costTitle);
	
	for (i in this.towerTypes) {
		var a = document.getElementById(i);
		a.onmouseover = function(j) {
			this.towerStats.rangeBarFore.style.width = (this.towerTypes[j].range * 18) + "px";
			this.towerStats.damageBarFore.style.width = (this.towerTypes[j].damage * 10) + "px";
			this.towerStats.rateBarFore.style.width = (20000.0 / this.towerTypes[j].cooldown) + "px";
			this.towerStats.nameTitle.innerHTML = this.towerTypes[j].name;
			this.towerStats.costTitle.innerHTML = this.towerTypes[j].cost;
		}.bind(this, i);
	}
	
	// Make a pause button
	this.pauseButton = document.createElement("div");
	this.gameStats.appendChild(this.pauseButton);
	this.pauseButton.id = "pause";
	this.pauseButton.style.width = "176px";
	this.pauseButton.style.height = "25px";
	this.pauseButton.style.right = "10px";
	this.pauseButton.style.bottom = "10px";
	this.pauseButton.innerHTML = "Pause";
	this.pauseButton.onclick = function() {
		if (window.fsm.getName() === "pause") {
			window.fsm.gotoPrevState();
		} else {
			window.fsm.changeState(window.pause);
		}
	}.bind(this);
	
	// Make pause message
	this.pauseCover = document.createElement("div");
	this.pauseCover.id = "pauseCover";
	this.gameDiv.appendChild(this.pauseCover);
	this.pauseMessage = document.createElement("div");
	this.pauseCover.appendChild(this.pauseMessage);
	this.pauseMessage.id = "pauseMessage";
	this.pauseMessage.style.width = "300px";
	this.pauseMessage.style.height = "50px";
	this.pauseMessage.style.left = "250px";
	this.pauseMessage.style.top = "250px";
	this.pauseMessage.innerHTML = "Paused";
	
	this.hideAll();
};

td.UI.prototype.hideAll = function() {
	this.gameCover.style.visibility = "hidden";
	this.buildList.style.visibility = "hidden";
	this.towerStats.style.visibility = "hidden";
};

td.UI.prototype.pauseOn = function() {
	this.pauseButton.innerHTML = "Unpause";
	this.pauseCover.style.visibility = "visible";
};

td.UI.prototype.pauseOff = function() {
	this.pauseButton.innerHTML = "Pause";
	this.pauseCover.style.visibility = "hidden";
	};

td.UI.prototype.buildTower = function(type) {
	this.player.giveMoney(-this.towerTypes[type].cost);
	this.turrets.spawn(this.x, this.y, type);
	this.hideAll();
	this.gameCover.onclick = null;
};

td.UI.prototype.towerSelection = function(x, y) {
	this.x = x;
	this.y = y;

	// The pixel coordinates of the center of cell (x,y)
	var xPixelPos = x * 50 + 25;
	var yPixelPos = 575 - y * 50;
	
	// If there is enough space to the right of this to display the ui elements then do it
	// else put them to the left of the selected cell
	if (xPixelPos + 50 + this.buildList.width + this.towerStats.width < 800) {
		var bLX = xPixelPos + 50;
		var tSX = xPixelPos + 50 + this.buildList.width;
	} else {
		var bLX = xPixelPos - this.buildList.width - 50;
		var tSX = xPixelPos - this.buildList.width - this.towerStats.width - 50;
	}
	
	// And cap the vertical position so everything is in the game area
	var bLY = yPixelPos - this.buildList.height / 2;
	var tSY = yPixelPos - this.towerStats.height / 2;
	if (bLY < 25) {
		bLY = 25;
	} else if (bLY + this.buildList.height > 575) {
		bLY = 575 - this.buildList.height;
	}
	if (tSY< 25) {
		tSY = 25;
	} else if (tSY + this.towerStats.height > 575) {
		tSY = 575 - this.towerStats.height;
	}

	this.buildList.style.left = bLX + "px";
	this.buildList.style.bottom = bLY + "px";
	
	this.towerStats.style.left = tSX + "px";
	this.towerStats.style.bottom = tSY + "px";
	
	this.gameCover.onclick = this.hideAll.bind(this);
	
	this.gameCover.style.visibility = "visible";
	this.buildList.style.visibility = "visible";
	this.towerStats.style.visibility = "visible";
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