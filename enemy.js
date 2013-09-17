td.Enemy = function(xGridStart, yGridStart, map, type) {
	
	function shadeColor(color, percent) {   
		var num = parseInt(color.substring(1),16),
		amt = Math.round(2.55 * percent),
		R = (num >> 16) + amt,
		B = (num >> 8 & 0x00FF) + amt,
		G = (num & 0x0000FF) + amt;
		return (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
	}	
	// Currently moving between (xGrid, yGrid) and (xGridNext, yGridNext)
	this.lvlCoof = td.Enemies.spawning*1.8;
	this.xGrid = xGridStart;
	this.yGrid = yGridStart;
	this.route = [];
	this.findRoute(this.route, this.routeLength, this.xGrid, this.yGrid, map);
	this.routeProgress = 1;
	this.xGridNext = this.route[this.routeProgress][0];
	this.yGridNext = this.route[this.routeProgress][1];
	// Fraction of the way from last current grid cell to next cell
	this.cellProgress = 0.0;
	this.x = 0.0;
	this.y = 0.0;
	this.speed = type.speed + this.lvlCoof/6000;
	this.hp = type.hp + this.lvlCoof*5;
	this.maxHp = type.hp + this.lvlCoof*5;
	this.value = type.value + this.lvlCoof*10;
	this.spawnTime = 0;
	this.finished = 0;
	this.name = type.name;
	this.color = shadeColor(type.color,td.Enemies.spawning*5);
	this.size = type.size;
	this.isFly = type.isFly;
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
			//console.log("failed to find route");
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
		player.giveMoney(this.value);
		player.giveExp(this.value);
		td.Enemies.enemyCount--;
		//console.log(td.Enemies.enemyCount);
	}
	
	if (this.finished === 1) {
		return;
	}
	this.cellProgress += this.speed * dt;
	this.x = ((this.xGrid + (this.xGridNext - this.xGrid) *
			this.cellProgress) + 0.5) * map.gridPixelSize;
	this.y = ((this.yGrid + (this.yGridNext - this.yGrid) *
			this.cellProgress) + 0.5) * map.gridPixelSize;	
	//console.log(this.x,this.y);
	// If we reach the next cell, i.e. progress > 1.0, then work out where
	// we need to go next and make the remaining progress in that direction.
	if (this.cellProgress > 1.0) {
		// Have we made it to the goal - if so the goal takes damage equal to
		// our remaining hp
		if (map.layout[this.yGridNext][this.xGridNext] === 2) {
			map.goalHp = Math.floor( map.goalHp - this.hp );
			if(map.goalHp<=0){
				map.goalHp=0;
				window.fsm.changeState(window.dead);
			}
			this.hp = 0;
			this.finished = 1;
			td.Enemies.enemyCount--;
			gameHP.textContent = map.goalHp;
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