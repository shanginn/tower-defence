td.Turrets = function(map, player) {
	this.active = [];
	this.layout = [];
	this.player = null;
	var layoutMarker = 0;
	for (var y = 0; y < map.layout.length; y++) {
		this.layout.push([]);
		for (var x = 0; x < map.layout[y].length; x++) {
			if (map.layout[y][x] === 0) {
				layoutMarker = 0;
			} else {
				layoutMarker = -1;
			}
			this.layout[y].push(layoutMarker);
		}
	}
};

td.Turrets.prototype.setup = function(player) {
	this.player = player;
};

td.Turrets.prototype.spawn = function(xCell, yCell, type) {
	if (this.layout[yCell][xCell] !== 0) {
		return;
	}
	
	var newTurret = new td.Turret(xCell, yCell, type);
	this.layout[yCell][xCell] = 1;

	// If there's an unused turret in the array then use that space
	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 1) {
			this.active[i] = newTurret;
			return;
		}
	}
	// otherwise add it to the end
	this.active.push(newTurret);
};

td.Turrets.prototype.update = function(dt, enemies, emitter) {
	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 0) {
			this.active[i].findTarget(enemies);
			this.active[i].fire(enemies, emitter, dt);
		}
	}
};
