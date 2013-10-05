td.Turret = function(xGrid, yGrid, type) {
	this.xGrid = xGrid;
	this.yGrid = yGrid;
	this.lvl = window.game.towerTypes[type].lvl;
	this.range = window.game.towerTypes[type].range;  // measured in grid cells
	this.abilitys = window.game.towerTypes[type].abilitys;
	this.target = null;
	this.cooldown = window.game.towerTypes[type].cooldown;
	this.cooldownTimer = 0.0;
	this.damage = window.game.towerTypes[type].damage;
	this.cost = window.game.towerTypes[type].cost;
	this.name = window.game.towerTypes[type].name;
	this.color = window.game.towerTypes[type].color;
	this.halfSize = window.game.towerTypes[type].halfSize;
	this.finished = 0;
	this.ability = [];
	this.sounds = window.game.towerTypes[type].sounds;
	if(this.abilitys){
		for(i in this.abilitys){
			this.ability.push(td.TowerAbilityList[this.abilitys[i]]);
		}
	}
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
					if (!enemies[i].isFly){
						this.target = i;
						currentClosest = distance;
					} else if (enemies[i].isFly && this.range >= 6){
						this.target = i;
						currentClosest = distance;
					} 					
					
				}
			}
		}
	}
	
	function separation(x1, y1, x2, y2) {
		return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
	}
};

td.Turret.prototype.fire = function(enemies, bullets, dt) {
	function sendBullet (self) {
	 	if (self.cooldownTimer <= 0.0) {
			// this assumes instant effect
			// An approximation to the bullet time to reach enemy
			// Uses current enemy position to estimate travel time, but the enemy will continue moving
			// just hope the bullets are fast enough that this is negligible
			var bulletDistX = (enemies[self.target].xGrid + (enemies[self.target].xGridNext -
				enemies[self.target].xGrid) * enemies[self.target].cellProgress) - self.xGrid + 0.5;
			var bulletDistY = (enemies[self.target].yGrid + (enemies[self.target].yGridNext -
				enemies[self.target].yGrid) * enemies[self.target].cellProgress) - self.yGrid + 0.5;
			var bulletTravelTime = Math.sqrt(bulletDistX * bulletDistX + bulletDistY * bulletDistY) / 0.004;
			var predictedEnemyPosition = enemies[self.target].predictPosition(bulletTravelTime);
			for (var i = 0; i < 10; i++) {
				bulletDistX = predictedEnemyPosition[0] - self.xGrid;
				bulletDistY = predictedEnemyPosition[1] - self.yGrid;
				bulletTravelTime = Math.sqrt(bulletDistX * bulletDistX + bulletDistY * bulletDistY) / 0.004;
				predictedEnemyPosition = enemies[self.target].predictPosition(bulletTravelTime);
			}

			var thisTurretAim = enemies[self.target];
			var dmg = self.damage;
			var bulletcolor;
			if(self.abilitys){
				for(i in self.ability){
					dmg+=self.ability[i].damage;
					bulletcolor = self.ability[i].color;
					if(self.ability[i].slow){
						if(typeof thisTurretAim.freezeStack != 'undefined'){
							if(thisTurretAim.freezeStack<=5){
								setTimeout(function() {
									thisTurretAim.speed *= self.ability[i].slow - self.lvl/10;
									thisTurretAim.freezeStack++;
								},bulletTravelTime);
								setTimeout(function() {
									thisTurretAim.speed /= self.ability[i].slow - self.lvl/10;
									thisTurretAim.freezeStack--;
								},2000);
							}
						} else {
							thisTurretAim.freezeStack = 0;
							setTimeout(function() {
								thisTurretAim.speed *= self.ability[i].slow - self.lvl/10;
								thisTurretAim.freezeStack++;
							},bulletTravelTime);
							setTimeout(function() {
								thisTurretAim.speed /= self.ability[i].slow - self.lvl/10;
								thisTurretAim.freezeStack--;
							},2000);							
						}
					}
				}								
			}else{
				bulletcolor = "#341242";
			}
			setTimeout(function() { thisTurretAim.hp -= dmg; },bulletTravelTime);
			var soundName = self.sounds[0].split("/")[1].split(".")[0];
			soundManager.play(soundName);
			bullets.spawn(self.xGrid, self.yGrid, predictedEnemyPosition[0], predictedEnemyPosition[1],bulletcolor);
			self.cooldownTimer += self.cooldown;

		}
	 }
	if (this.cooldownTimer > 0.0) {
		this.cooldownTimer -= dt;
	}
	if (this.target !== null) {
		sendBullet(this);
	}
};