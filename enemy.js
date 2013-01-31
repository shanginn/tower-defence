(function(exports) {

var Enemy = function(xGridStart, yGridStart) {

	// Start at entry point specified by the map
	this.xGrid = xGridStart;
	this.yGrid = yGridStart;
	// Where we are headed next. First direction is always south
	this.dir = 'south';
	this.xGridNext = this.xGrid;
	this.yGridNext = this.yGrid+1;
	// Fraction of the way from last current grid cell to next cell
	this.cellProgress = 0.0;
	// fraction of cellProgress made in 1ms
	this.speed = 0.001;
	this.hp = 50;
	this.finished = 0;
	
};

Enemy.prototype.update = function(dt, map) {

	if (this.hp <= 0) {
		this.finished = 1;
	}
	
	if (this.finished === 1) {
		return;
	}
	
	this.cellProgress += this.speed * dt;
	// If we reach the next cell, i.e. progress > 1.0, then work out where
	// we need to go next and make the remaining progress in that direction.
	if (this.cellProgress > 1.0) {
		// No complex pathfinding here, just look around for another way that
		// isnt the way we arrived. Assumes there is only one way to go.
		
		// Have we made it to the goal - if so the goal takes damage equal to
		// our remaining hp
		if (map.layout[this.yGridNext][this.xGridNext] === 2) {
			map.goalHp -= this.hp;
			this.hp = 0;
			this.finished = 1;
		}
		
		// North
		if (checkNorth(this.xGridNext, this.yGridNext, map.layout) && (this.yGridNext - 1 !== this.yGrid)) {
			this.xGrid = this.xGridNext;
			this.xGridNext = this.xGridNext;
			this.yGrid = this.yGridNext;
			this.yGridNext = this.yGridNext - 1;
			
		// South
		} else if (checkSouth(this.xGridNext, this.yGridNext, map.layout) && (this.yGridNext + 1 !== this.yGrid)) {
			this.xGrid = this.xGridNext;
			this.xGridNext = this.xGridNext;
			this.yGrid = this.yGridNext;
			this.yGridNext = this.yGridNext + 1;
			
		// East
		} else if (checkEast(this.xGridNext, this.yGridNext, map.layout) && (this.xGridNext + 1 !== this.xGrid)) {
			this.xGrid = this.xGridNext;
			this.xGridNext = this.xGridNext + 1;
			this.yGrid = this.yGridNext;
			this.yGridNext = this.yGridNext;
		
		// West
		} else if (checkWest(this.xGridNext, this.yGridNext, map.layout) && (this.xGridNext - 1 !== this.xGrid)) {
			this.xGrid = this.xGridNext;
			this.xGridNext = this.xGridNext - 1;
			this.yGrid = this.yGridNext;
			this.yGridNext = this.yGridNext;
		}
		this.cellProgress -= 1;
	}
};

function checkNorth(x, y, mapLayout) {
	if (y === 0) {
		return false;
	} else if (mapLayout[y-1][x] === 1 || mapLayout[y-1][x] === 2) {
		return true;
	}
	return false;
}

function checkEast(x, y, mapLayout) {
	if (x === mapLayout[0].length) {
		return false;
	} else if (mapLayout[y][x+1] === 1 || mapLayout[y][x+1] === 2) {
		return true;
	}
	return false;
}

function checkSouth(x, y, mapLayout) {
	if (y === mapLayout.length - 1) {
		return false;
	} else if (mapLayout[y+1][x] === 1 || mapLayout[y+1][x] === 2) {
		return true;
	}
	return false;
}

function checkWest(x, y, mapLayout) {
	if (x === 0) {
		return false;
	} else if (mapLayout[y][x-1] === 1 || mapLayout[y][x-1] === 2) {
		return true;
	}
	return false;
}

exports.Enemy = Enemy;

})(window);