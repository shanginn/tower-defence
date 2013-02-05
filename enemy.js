(function(exports) {

var Enemy = function(xGridStart, yGridStart, map) {
	// Currently moving between (xGrid, yGrid) and (xGridNext, yGridNext)
	this.xGrid = xGridStart;
	this.yGrid = yGridStart;
	this.route = [];
	this.routeLength = 0;
	findRoute(this.route, this.routeLength, this.xGrid, this.yGrid, map);
	this.routeProgress = 0;
	this.xGridNext = this.xGrid + this.route[this.routeProgress][0];
	this.yGridNext = this.yGrid + this.route[this.routeProgress][1];
	// Fraction of the way from last current grid cell to next cell
	this.cellProgress = 0.0;
	// fraction of cellProgress made in 1ms
	this.speed = 0.001;
	this.hp = 50;
	this.finished = 0;
};

function findRoute(route, routeLength, x0, y0, map) {
	// route is a list of directions [0,-1]=north, [1,0]=east, [0,1]=south, [-1,0]=west
	// start by moving south
	route.push([0,1]);
	var x = x0;
	var y = y0 + 1;
	var xPrev = x0;
	var yPrev = y0;
	routeLength++;
	// until we reach the goal, decide what our next direction should be
	var noInfLoopCounter = 0;
	while (map.layout[y][x] !== 2) {
		// North
		if (checkNorth(x, y, map.layout) && (y !== yPrev + 1)) {
			route.push([0,-1]);
			xPrev = x;
			yPrev = y;
			y--;
			routeLength++;
		// East
		} else if (checkEast(x, y, map.layout) && (x !== xPrev - 1)) {
			route.push([1,0]);
			xPrev = x;
			yPrev = y;
			x++;
			routeLength++;
		// South
		} else if (checkSouth(x, y, map.layout) && (y !== yPrev - 1)) {
			route.push([0,1]);
			xPrev = x;
			yPrev = y;
			y++;
			routeLength++;
		// West
		} else if (checkWest(x, y, map.layout) && (x !== xPrev + 1)) {
			route.push([-1,0]);
			xPrev = x;
			yPrev = y;
			x--;
			routeLength++;
		}
		noInfLoopCounter++;
		if (noInfLoopCounter === 1000) {
			console.log("failed to find route");
			return false;
		}
	}
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
		// Have we made it to the goal - if so the goal takes damage equal to
		// our remaining hp
		if (map.layout[this.yGridNext][this.xGridNext] === 2) {
			map.goalHp -= this.hp;
			this.hp = 0;
			this.finished = 1;
		} else {
			this.routeProgress++;
			this.xGrid = this.xGridNext;
			this.yGrid = this.yGridNext;
			this.xGridNext = this.xGridNext + this.route[this.routeProgress][0];
			this.yGridNext = this.yGridNext + this.route[this.routeProgress][1];
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