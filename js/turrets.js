td.Turrets = function(map, player) {
	this.active = [0,];
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
	//console.log(this.active,this.layout[yCell][xCell]);
	this.player.giveMoney(Math.floor(this.active[this.layout[yCell][xCell]].cost/3));
	//this.active.splice(this.layout[yCell][xCell],1);
	this.active[this.layout[yCell][xCell]] = 0;
	this.layout[yCell][xCell]=0;
}

td.Turrets.prototype.upgrade = function (turret) {
	if(this.player.money<turret.cost/2 || turret.lvl>=5){
		return;
	} else {
		turret.lvl++;
		this.player.giveMoney(-Math.floor(turret.cost/2));
		turret.cost += Math.floor(turret.lvl * turret.cost/2);
		turret.damage *= 1.2;
		turret.range *= 1.2;
		turret.cooldown /= 1.2;
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