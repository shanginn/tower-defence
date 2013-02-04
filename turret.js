(function(exports) {

var Turret = function(xGrid, yGrid, type) {
	this.xGrid = xGrid;
	this.yGrid = yGrid;
	this.range = TurretTypes[type].range;  // measured in grid cells
	this.target = null;
	this.cooldown = TurretTypes[type].cooldown;
	this.cooldownTimer = 0.0;
	this.damage = TurretTypes[type].damage;
	this.finished = 0;
};

Turret.prototype.findTarget = function(enemies) {
	var distance = 0.0;
	if (this.target !== null) {
		var targetEnemyX = enemies[this.target].xGrid;
		var targetEnemyY = enemies[this.target].yGrid;
		distance = separation(this.xGrid, this.yGrid, targetEnemyX, targetEnemyY);
		// Has our old target gone out of range or died?
		if (enemies[this.target].hp <= 0) {
			this.target = null;
		} else if (distance > this.range) {
			this.target = null;
		} else {
			return;
		}
	}

	// If we dont have a target, look through the enemies list and see if
	// there's one in range for us to shoot at
	if (this.target === null) {
		var currentClosest = this.range;
		for (var i = 0; i < enemies.length; i++) {
			if (enemies[i].hp > 0) {
				distance = separation(this.xGrid, this.yGrid, enemies[i].xGrid, enemies[i].yGrid);
				if (distance < currentClosest) {
					this.target = i;
					currentClosest = distance;
				}
			}
		}
	}
};

Turret.prototype.fire = function(enemies, emitter, dt) {
	if (this.cooldownTimer > 0.0) {
		this.cooldownTimer -= dt;
	}
	if (this.target !== null) {
		if (this.cooldownTimer <= 0.0) {
			// this assumes instant effect
			enemies[this.target].hp -= this.damage;
			emitter.bulletfire(this.xGrid, this.yGrid,
				(enemies[this.target].xGrid + (enemies[this.target].xGridNext -
				enemies[this.target].xGrid) * enemies[this.target].cellProgress),
				(enemies[this.target].yGrid + (enemies[this.target].yGridNext -
				enemies[this.target].yGrid) * enemies[this.target].cellProgress));
			this.cooldownTimer += this.cooldown;
		}
	}
};

function separation(x1, y1, x2, y2) {
	return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}

exports.Turret = Turret;

})(window);