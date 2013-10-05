td.Bullet = function() {
	this.xSpawn = 0.0;
	this.ySpawn = 0.0;
	this.xTarget = 0.0;
	this.yTarget = 0.0;
	this.xGrid = 0.0;
	this.yGrid = 0.0;
	this.xDist = 0.0;
	this.yDist = 0.0;
	this.speed = 0.0;
	this.damage = 0;
	this.finished = 1;
};

td.Bullet.prototype.reset = function(x0, y0, x1, y1, color) {
	this.xSpawn = x0;
	this.ySpawn = y0;
	this.xTarget = x1;
	this.yTarget = y1;
	this.xGrid = x0;
	this.yGrid = y0;
	this.xDist = x1 - x0;
	this.yDist = y1 - y0;
	this.xVec = this.xDist / Math.sqrt(this.xDist*this.xDist + this.yDist*this.yDist);
	this.yVec = this.yDist / Math.sqrt(this.xDist*this.xDist + this.yDist*this.yDist);
	this.speed = 0.004;
	this.damage = 1;
	this.finished = 0;
	this.color = color;
};

td.Bullet.prototype.move = function(dt) {
	this.xGrid += this.speed * this.xVec * dt;
	this.yGrid += this.speed * this.yVec * dt;
	if ((Math.abs(this.xGrid - this.xSpawn) > Math.abs(this.xDist)) ||
		(Math.abs(this.yGrid - this.ySpawn) > Math.abs(this.yDist))) {
		this.finished = 1;
	}
};