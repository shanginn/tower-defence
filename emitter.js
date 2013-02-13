td.Emitter = function() {
	this.totalParticles = 1000;
	this.liveParticles = 0;
	this.particlePool = [];
	// Bullets are tracers extended between object and target
	// since a single bullet would move too fast to be a particle
	this.totalTracers = 250;
	this.liveTracers = 0;
	this.tracerPool = [];
	
	for (var i = 0; i < this.totalParticles; i++) {
		this.particlePool.push(new td.Particle());
	}
	
	for (var i = 0; i < this.totalTracers; i++) {
		this.tracerPool.push(new td.Tracer());
	}
};

td.Emitter.prototype.update = function(dt) {
	for (var i = 0; i < this.liveParticles; i++) {
		this.particlePool[i].lifetime -= dt;
		if (this.particlePool[i].lifetime > 0) {
			this.particlePool[i].xPos += this.particlePool[i].xVec * dt;
			this.particlePool[i].yPos += this.particlePool[i].yVec * dt;
			this.particlePool[i].alpha = this.particlePool[i].lifetime / this.particlePool[i].originalLifetime;
		} else {
			var deadParticle = this.particlePool[i];
			this.particlePool[i] = this.particlePool[this.liveParticles-1];
			this.particlePool[this.liveParticles-1] = deadParticle;
			this.liveParticles--;
		}
	}
	
	for (var i = 0; i < this.liveTracers; i++) {
		this.tracerPool[i].lifetime -= dt;
		if (this.tracerPool[i].lifetime > 0) {
			this.tracerPool[i].alpha = this.tracerPool[i].lifetime / this.tracerPool[i].originalLifetime;
		} else {
			var deadTracer = this.tracerPool[i];
			this.tracerPool[i] = this.tracerPool[this.liveTracers-1];
			this.tracerPool[this.liveTracers-1] = deadTracer;
			this.liveTracers--;
		}
	}
};

td.Emitter.prototype.addTracer = function(x0, y0, x1, y1, lt, inten, co, al) {
	if (this.liveTracers < this.totalTracers) {
		this.tracerPool[this.liveTracers].xStart = x0;
		this.tracerPool[this.liveTracers].yStart = y0;
		this.tracerPool[this.liveTracers].xEnd = x1;
		this.tracerPool[this.liveTracers].yEnd = y1;
		this.tracerPool[this.liveTracers].lifetime = lt;
		this.tracerPool[this.liveTracers].originalLifetime = lt;
		this.tracerPool[this.liveTracers].intensity = inten;
		this.tracerPool[this.liveTracers].color = co;
		this.tracerPool[this.liveTracers].alpha = al;
		this.liveTracers++;
	}
};

td.Emitter.prototype.bulletfire = function(x0, y0, x1, y1) {
	this.addTracer(x0, y0, x1, y1, 150.0, 1.0, '#EE7942', 1.0);
};