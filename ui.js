(function(exports) {

var UI = function(turrets) {
	this.turrets = turrets;
	this.gameCover = document.getElementById("gameCover");
	this.buildList = document.getElementById("gameTowerSelection");
	this.gameCover.style.visibility = "hidden";
	this.buildList.style.visibility = "hidden";

	// Setup buildTower button
	this.buildTower = function(type) {
		this.turrets.spawn(this.x, this.y, type);
		this.gameCover.style.visibility = "hidden";
		this.buildList.style.visibility = "hidden";
	}
	
	document.getElementById("gun").addEventListener("click", this.buildTower.bind(this, "gun"));
	document.getElementById("art").addEventListener("click", this.buildTower.bind(this, "art"));
};

UI.prototype.towerSelection = function(x, y) {

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


exports.UI = UI;

})(window);