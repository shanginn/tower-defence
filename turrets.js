(function(exports) {

var Turrets = function(map) {
	this.active = [];
	this.layout = [];
	for (var y = 0; y < map.layout.length; y++) {
		this.layout.push([]);
		for (var x = 0; x < map.layout[y].length; x++) {
			this.layout[y].push(0);
		}
	}
	
};

Turrets.prototype.spawn = function(xCell, yCell) {
	var newTurret = new Turret(xCell, yCell);
	this.layout[yCell][xCell] = 1;	
	
	// If there's an unused turret in the array then use that space
	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 1) {
			this.active = newTurret;
			return;
		}
	}
	// otherwise add it to the end
	this.active.push(newTurret);
};

Turrets.prototype.update = function(dt, enemies) {
	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 0) {
			this.active[i].findTarget(enemies);
			this.active[i].fire(enemies, dt);
		}
	}
};

exports.Turrets = Turrets;

})(window);