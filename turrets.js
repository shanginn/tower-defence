td.Turrets = function(map, player) {
	this.active = [0];
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
	if (this.layout[yCell][xCell] !== 0 || this.player.money<td.TurretTypes[type].cost) {
		return;
	}
	this.player.giveMoney(-td.TurretTypes[type].cost);
	var newTurret = new td.Turret(xCell, yCell, type);
	//this.layout[yCell][xCell] = td.TurretTypes[type].id;

	// If there's an unused turret in the array then use that space
	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 1) {
			this.active[i] = newTurret;
			this.layout[yCell][xCell] = i;
			return;
		}
	}
	// otherwise add it to the end
	this.layout[yCell][xCell] = this.active.length;
	this.active.push(newTurret);
};

td.Turrets.prototype.sell = function (xCell, yCell) {
	this.player.giveMoney(Math.floor(this.active[this.layout[yCell][xCell]].cost/2));
	this.active[this.layout[yCell][xCell]] = {};
	this.layout[yCell][xCell]=0;
}

td.Turrets.prototype.upgrade = function (xCell, yCell) {
	if(this.player.money<this.active[this.layout[yCell][xCell]].cost/2 || this.active[this.layout[yCell][xCell]].lvl>5){
		console.log(this.player.money,this.active[this.layout[yCell][xCell]].cost);
		return;
	} else {
		this.active[this.layout[yCell][xCell]].lvl++;
		this.player.giveMoney(-Math.floor(this.active[this.layout[yCell][xCell]].cost/2));
		this.active[this.layout[yCell][xCell]].cost += Math.floor(this.active[this.layout[yCell][xCell]].lvl * this.active[this.layout[yCell][xCell]].cost/2);
		this.active[this.layout[yCell][xCell]].damage *= 1.2;
		this.active[this.layout[yCell][xCell]].range *= 1.2;
		this.active[this.layout[yCell][xCell]].cooldown /= 1.2;
	}
}

td.Turrets.prototype.check = function (xCell, yCell) {
	return this.active[this.layout[yCell][xCell]];
}

td.Turrets.prototype.update = function(dt, enemies, emitter) {
	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 0) {
			this.active[i].findTarget(enemies);
			this.active[i].fire(enemies, emitter, dt);
		}
	}
};
