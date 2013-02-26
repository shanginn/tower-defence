td.UI = function() {
	this.activeStack = [];
};

td.UI.prototype.setup = function(turrets, towerTypes, player, map) {
	this.turrets = turrets;
	this.player = player;
	this.towerTypes = towerTypes;
	this.towerTypesLength = Object.keys(this.towerTypes).length;
	this.map = map;
	
	// Stats panel on the right side of the map
	this.statsRect = {};
	this.statsRect.x0 = this.map.nx * this.map.gridPixelSize;
	this.statsRect.x1 = 800;
	this.statsRect.y0 = 0;
	this.statsRect.y1 = 600;
	this.statsRect.visible = true;
	this.statsRect.color = "#223300";
	this.statsRect.captureClick = false;
	this.statsRect.w = this.statsRect.x1 - this.statsRect.x0;
	this.statsRect.h = this.statsRect.y1 - this.statsRect.y0;
	this.activeStack.push(this.statsRect);

	// Make pause button
	this.pauseButton = {};
	this.pauseButton.x0 = this.statsRect.x0 + 10;
	this.pauseButton.x1 = this.statsRect.x1 - 10;
	this.pauseButton.y0 = this.statsRect.y1 - 40;
	this.pauseButton.y1 = this.statsRect.y1 - 10;
	this.pauseButton.w = this.pauseButton.x1 - this.pauseButton.x0;
	this.pauseButton.h = this.pauseButton.y1 - this.pauseButton.y0;
	this.pauseButton.visible = true;
	this.pauseButton.color = "red";
	this.pauseButton.text = "Pause";
	this.pauseButton.colorFG = "black";
	this.pauseButton.captureClick = true;
	this.pauseButton.click = function() {
		window.fsm.changeState(window.pause);
	}
	this.activeStack.push(this.pauseButton);
	
	// Map
	this.mapArea = {};
	this.mapArea.x0 = 0;
	this.mapArea.x1 = this.map.nx * this.map.gridPixelSize;
	this.mapArea.y0 = 0;
	this.mapArea.y1 = this.map.ny * this.map.gridPixelSize;
	this.mapArea.w = this.mapArea.x1 - this.mapArea.x0;
	this.mapArea.h = this.mapArea.y1 - this.mapArea.y0;
	this.mapArea.visible = false;
	this.mapArea.captureClick = true;
	this.mapArea.click = function(x, y) {
		this.activeStack.push(this.mapCover);
		var xPos = Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize + 25;
		var yPos = Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize - 25;
		for (var i = 0; i < this.towerButtons.length; i++) {
			this.towerButtons[i].x0 = xPos + 25;
			this.towerButtons[i].y0 = yPos + i * 30 ;
			this.towerButtons[i].x1 = this.towerButtons[i].x0 + this.towerButtons[i].w;
			this.towerButtons[i].y1 = this.towerButtons[i].y0 + this.towerButtons[i].h;
			this.towerButtons[i].xBuildCell = Math.floor(x / this.map.gridPixelSize);
			this.towerButtons[i].yBuildCell = Math.floor(y / this.map.gridPixelSize);
			this.activeStack.push(this.towerButtons[i]);
		}
	}.bind(this);
	this.activeStack.push(this.mapArea);	
	
	// Tower selection buttons
	this.towerButtons = [];
	for (i in this.towerTypes) {
		this.towerButtons.push({});
	}
	for (var i = 0; i < this.towerTypesLength; i++) {
		this.towerButtons[i].x0 = 0;
		this.towerButtons[i].x1 = 0;
		this.towerButtons[i].y0 = 0;
		this.towerButtons[i].y1 = 0;
		this.towerButtons[i].w = 150;
		this.towerButtons[i].h = 25;
		this.towerButtons[i].color = "#CCDDEE";
		this.towerButtons[i].visible = true;
		this.towerButtons[i].captureClick = true;
		this.towerButtons[i].type = Object.keys(this.towerTypes)[i];
		this.towerButtons[i].xBuildCell = 0;
		this.towerButtons[i].yBuildCell = 0;
		this.towerButtons[i].text = this.towerTypes[this.towerButtons[i].type].name;
		this.towerButtons[i].colorFG = "black";
		this.towerButtons[i].textStyle = '14pt Arial';
		this.towerButtons[i].click = function(i) {
			this.turrets.spawn(this.towerButtons[i].xBuildCell, this.towerButtons[i].yBuildCell, this.towerButtons[i].type);
			this.activeStack.splice(-(this.towerTypesLength + 1), (this.towerTypesLength + 1));
		}.bind(this, i);
	}

	// Another map cover which hides the build tower buttons if somewhere else on the map is clicked
	this.mapCover = {};
	this.mapCover.x0 = 0;
	this.mapCover.x1 = this.map.nx * this.map.gridPixelSize;
	this.mapCover.y0 = 0;
	this.mapCover.y1 = this.map.ny * this.map.gridPixelSize;
	this.mapCover.w = this.mapArea.x1 - this.mapArea.x0;
	this.mapCover.h = this.mapArea.y1 - this.mapArea.y0;
	this.mapCover.visible = false;
	this.mapCover.captureClick = true;
	this.mapCover.click = function(x, y) {
		this.activeStack.splice(-(this.towerTypesLength + 1), (this.towerTypesLength + 1));
	}.bind(this);

};

td.UI.prototype.render = function(ctx) {
	this.ctx = ctx;
	this.ctx.fillStyle = "#223300";
	this.ctx.fillRect(this.statsRectX0, this.statsRectY0, this.statsRectWidth, this.statsRectHeight);
	
	for (i in this.activeStack) {
		if (this.activeStack[i].visible) {
			this.ctx.fillStyle = this.activeStack[i].color;
			this.ctx.fillRect(this.activeStack[i].x0, this.activeStack[i].y0,
					this.activeStack[i].w, this.activeStack[i].h);
			if (this.activeStack[i].hasOwnProperty("text")) {
				this.ctx.fillStyle = this.activeStack[i].colorFG;
				this.ctx.font = this.activeStack[i].textStyle;
				this.ctx.textAlign = 'center';
				this.ctx.fillText(this.activeStack[i].text,
						this.activeStack[i].x0 + this.activeStack[i].w / 2,
						this.activeStack[i].y0 + this.activeStack[i].h / 2 + 5);
			}
		}
	}
};

td.UI.prototype.click = function(x, y) {
	for (var i = this.activeStack.length - 1; i >= 0; i--) {
		if (this.activeStack[i].captureClick) {
			if (x > this.activeStack[i].x0 && x < this.activeStack[i].x1) {
				if (y > this.activeStack[i].y0 && y < this.activeStack[i].y1) {
					this.activeStack[i].click(x, y);
					return;
				}
			}
		}
	}
};
