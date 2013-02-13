td.Turret = function(xGrid, yGrid, type) {
	this.xGrid = xGrid;
	this.yGrid = yGrid;
	this.range = window.game.towerTypes[type].range;  // measured in grid cells
	this.target = null;
	this.cooldown = window.game.towerTypes[type].cooldown;
	this.cooldownTimer = 0.0;
	this.damage = window.game.towerTypes[type].damage;
	this.finished = 0;
};

td.Turret.prototype.findTarget = function(enemies) {
	var distance = 0.0;
	if (this.target !== null) {
		var targetEnemyX = enemies[this.target].xGrid + (enemies[this.target].xGridNext -
				enemies[this.target].xGrid) * enemies[this.target].cellProgress;
		var targetEnemyY = enemies[this.target].yGrid + (enemies[this.target].yGridNext -
				enemies[this.target].yGrid) * enemies[this.target].cellProgress;
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
				var targetEnemyX = enemies[i].xGrid + (enemies[i].xGridNext -
					enemies[i].xGrid) * enemies[i].cellProgress;
				var targetEnemyY = enemies[i].yGrid + (enemies[i].yGridNext -
					enemies[i].yGrid) * enemies[i].cellProgress;
				distance = separation(this.xGrid, this.yGrid, targetEnemyX, targetEnemyY);
				if (distance < currentClosest) {
					this.target = i;
					currentClosest = distance;
				}
			}
		}
	}
	
	function separation(x1, y1, x2, y2) {
		return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
	}
};

td.Turret.prototype.fire = function(enemies, bullets, dt) {
	if (this.cooldownTimer > 0.0) {
		this.cooldownTimer -= dt;
	}
	if (this.target !== null) {
		if (this.cooldownTimer <= 0.0) {
			// this assumes instant effect
			enemies[this.target].hp -= this.damage;
			// An approximation to the bullet time to reach enemy
			// Uses current enemy position to estimate travel time, but the enemy will continue moving
			// just hope the bullets are fast enough that this is negligible
			var bulletDistX = (enemies[this.target].xGrid + (enemies[this.target].xGridNext -
				enemies[this.target].xGrid) * enemies[this.target].cellProgress) - this.xGrid + 0.5;
			var bulletDistY = (enemies[this.target].yGrid + (enemies[this.target].yGridNext -
				enemies[this.target].yGrid) * enemies[this.target].cellProgress) - this.yGrid + 0.5;
			var bulletTravelTime = Math.sqrt(bulletDistX * bulletDistX + bulletDistY * bulletDistY) / 0.004;
			var predictedEnemyPosition = enemies[this.target].predictPosition(bulletTravelTime);
			for (var i = 0; i < 10; i++) {
				bulletDistX = predictedEnemyPosition[0] - this.xGrid;
				bulletDistY = predictedEnemyPosition[1] - this.yGrid;
				bulletTravelTime = Math.sqrt(bulletDistX * bulletDistX + bulletDistY * bulletDistY) / 0.004;
				predictedEnemyPosition = enemies[this.target].predictPosition(bulletTravelTime);
			}
			bullets.spawn(this.xGrid, this.yGrid, predictedEnemyPosition[0], predictedEnemyPosition[1]);
			this.cooldownTimer += this.cooldown;
		}
	}
};