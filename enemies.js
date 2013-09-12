td.Enemies = function(enemyTypes) {
	this.enemyTypes = enemyTypes;
	this.active = [];
	this.enemyQueue = [];
	this.waves = [];
	this.nextWaveTime = 5000.0;
	this.maxQueueSize = 10;
	this.spawnInterval = 1000.0;
	this.nextSpawn = 0.0;
	td.Enemies.enemyCount = 0;
	td.Enemies.spawning = 0;
};

td.Enemies.prototype.setupWaves = function(waves, map) {
	this.waves = waves;
	// Queue up the first wave
	this.spawnWave(this.waves[0], map);
	this.waves.splice(0, 1);
};

td.Enemies.prototype.spawnWave = function(wave, map) {
	var type = 0;
	for (var i = 0; i < wave.enemies.length; i++) {
		type = wave.enemies[i];
		var newEnemy = new td.Enemy(3, 0, map, this.enemyTypes[type].speed, this.enemyTypes[type].hp, this.enemyTypes[type].value, this.enemyTypes[type].name);
		newEnemy.spawnTime = wave.time + i * this.spawnInterval;
		this.addToQueue(newEnemy);
	}
	td.Enemies.spawning++;
	gameWave.textContent = td.Enemies.spawning;
};

td.Enemies.prototype.addToQueue = function (enemy) {
	if (this.enemyQueue.length < this.maxQueueSize) {
		this.enemyQueue.push(enemy);
		td.Enemies.enemyCount++;
		//console.log(td.Enemies.enemyCount);
	}
};

td.Enemies.prototype.spawn = function(enemy) {
	// If there's an unused enemy in the array then use that space
	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 1) {
			this.active[i] = enemy;
			return;
		}
	}
	// otherwise add it to the end
	this.active.push(enemy);
};

td.Enemies.prototype.update = function(dt, map, ct, player) {
	// Is it time to spawn the next guy?
	if (this.enemyQueue.length > 0 && this.enemyQueue[0].spawnTime <= ct) {
		this.spawn(this.enemyQueue[0]);
		this.enemyQueue.splice(0,1);
	} else if (this.enemyQueue.length == 0 && this.waves.length > 0) {
	// If this wave is over then lets queue up the next wave
		this.spawnWave(this.waves[0], map);
		this.waves.splice(0, 1);
	}
	if (td.Enemies.enemyCount == 0 && this.enemyQueue.length == 0 && this.waves.length == 0){
		window.fsm.changeState(window.win);
	}
	////console.log(this.enemyQueue);

	for (var i = 0; i < this.active.length; i++) {
		if (this.active[i].finished === 0) {
			this.active[i].update(dt, map, player);
			if (this.active[i].hp <= 0) {
				this.finished = 1;
			}
		}
	}
};