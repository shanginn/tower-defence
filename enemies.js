(function(exports) {

var Enemies = function() {
	this.active = [];
	this.queue = [];
	this.nextWaveTime = 5000.0;
	this.maxQueueSize = 5;
	this.spawnInterval = 1000.0;
	this.spawning = 0;
	this.nextSpawn = 0.0;
};

Enemies.prototype.addToQueue = function (enemy) {
	if (this.queue.length < this.maxQueueSize) {
		this.queue.push(enemy);
	}
};

Enemies.prototype.spawn = function(enemy) {
	// If there's an unused enemy in the array then use that space
	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 1) {
			this.active = enemy;
			return;
		}
	}
	// otherwise add it to the end
	this.active.push(enemy);
};

Enemies.prototype.update = function(dt, map, ct) {
	// Any to spawn from the queue?
	if (this.nextWaveTime <= ct && this.spawning === 0) {
		if (this.queue.length > 0) {
			this.spawning = 1;
			this.nextSpawn = 0.0;
		}
	}
	if (this.spawning === 1) {
		this.nextSpawn -= dt;
		if (this.nextSpawn <= 0.0) {
			this.spawn(this.queue[0]);
			this.nextSpawn += this.spawnInterval;
			this.queue.splice(0,1);
			if (this.queue.length === 0) {
				this.spawning = 0;
				this.nextWaveTime += 10000.0;
			}
		}
	}

	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 0) {
			this.active[i].update(dt, map);
			if (this.active[i].hp <= 0) {
				this.finished = 1;
			}
		}
	}
};

exports.Enemies = Enemies;

})(window);