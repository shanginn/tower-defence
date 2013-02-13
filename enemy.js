td.Enemy = function(xGridStart, yGridStart, map) {
	// Currently moving between (xGrid, yGrid) and (xGridNext, yGridNext)
	this.xGrid = xGridStart;
	this.yGrid = yGridStart;
	this.route = [];
	this.findRoute(this.route, this.routeLength, this.xGrid, this.yGrid, map);
	this.routeProgress = 1;
	this.xGridNext = this.route[this.routeProgress][0];
	this.yGridNext = this.route[this.routeProgress][1];
	// Fraction of the way from last current grid cell to next cell
	this.cellProgress = 0.0;
	// fraction of cellProgress made in 1ms
	this.speed = 0.001;
	this.hp = 50;
	this.finished = 0;
};

td.Enemy.prototype.predictPosition = function(t) {
	// Where will I be at time t in the future assuming current speed
	var predictX = this.xGrid;
	var predictY = this.yGrid;
	var tCellProgress = this.cellProgress + t * this.speed;
	var tRouteProgress = this.routeProgress;
	while (tCellProgress > 1.0 && tRouteProgress < this.route.length) {
		predictX = this.route[tRouteProgress][0];
		predictY = this.route[tRouteProgress][1];
		tRouteProgress++;
		tCellProgress--;
	}
	if (tRouteProgress >= this.route.length) {
		return [predictX, predictY];
	}
	predictX = this.route[tRouteProgress-1][0] + (this.route[tRouteProgress][0] - this.route[tRouteProgress-1][0]) * tCellProgress;
	predictY = this.route[tRouteProgress-1][1] + (this.route[tRouteProgress][1] - this.route[tRouteProgress-1][1]) * tCellProgress;
	return [predictX, predictY];
};

td.Enemy.prototype.findRoute = function(route, routeLength, x0, y0, map) {
	// route is a list of adjacent coordinates that the enemy 
	// start by moving south from (x0, y0)
	route.push([x0, y0]);
	var x = x0;
	var y = y0 + 1;
	route.push([x, y]);
	var xPrev = x0;
	var yPrev = y0;
	routeLength++;
	// until we reach the goal, decide what our next direction should be
	var noInfLoopCounter = 0;
	while (map.layout[y][x] !== 2) {
		// North
		if (checkNorth(x, y, map.layout) && (y !== yPrev + 1)) {
			xPrev = x;
			yPrev = y;
			y--;
			route.push([x, y]);
			routeLength++;
		// East
		} else if (checkEast(x, y, map.layout) && (x !== xPrev - 1)) {
			xPrev = x;
			yPrev = y;
			x++;
			route.push([x, y]);
			routeLength++;
		// South
		} else if (checkSouth(x, y, map.layout) && (y !== yPrev - 1)) {
			xPrev = x;
			yPrev = y;
			y++;
			route.push([x, y]);
			routeLength++;
		// West
		} else if (checkWest(x, y, map.layout) && (x !== xPrev + 1)) {
			xPrev = x;
			yPrev = y;
			x--;
			route.push([x, y]);
			routeLength++;
		}
		noInfLoopCounter++;
		if (noInfLoopCounter === 1000) {
			console.log("failed to find route");
			return false;
		}
	}
	
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
};

td.Enemy.prototype.update = function(dt, map, player) {

	if (this.hp <= 0) {
		this.finished = 1;
		player.giveMoney(100);
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
			this.xGridNext = this.route[this.routeProgress][0];
			this.yGridNext = this.route[this.routeProgress][1];
		}
		this.cellProgress -= 1;
	}
};