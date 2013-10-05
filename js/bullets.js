td.Bullets = function() {
	this.active = [];
	this.liveBullets = 0;
	this.maxBullets = 1000;
	
	for (var i = 0; i < this.maxBullets; i++) {
		this.active.push(new td.Bullet());
	}
};

td.Bullets.prototype.update = function(dt) {
	for (var i = 0; i < this.liveBullets; i++) {
		this.active[i].move(dt);
		if (this.active[i].finished === 1) {
			var deadBullet = this.active[i];
			this.active[i] = this.active[this.liveBullets-1];
			this.active[this.liveBullets-1] = deadBullet;
			this.liveBullets--;
			i--;
		}
	}
};

td.Bullets.prototype.spawn = function(x0, y0, x1, y1, color) {
	if (this.liveBullets < this.maxBullets) {
		this.active[this.liveBullets].reset(x0, y0, x1, y1, color);
		this.liveBullets++;
	}
};