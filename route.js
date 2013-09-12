td.prototype.findRoute = function(route, routeLength, x0, y0, map) {

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