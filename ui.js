td.UI = function() {
	this.activeStack = [];
};

td.UI.prototype.setup = function(turrets, towerTypes, player, map, game) {
	this.turrets = turrets;
	this.player = player;
	this.towerTypes = towerTypes;
	this.towerTypesLength = Object.keys(this.towerTypes).length;
	this.map = map;
	this.game = game;
	
	// Stats panel on the right side of the map
/*
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
*/	
	// Map
	var wt=150;
	var ht=25;
	var	whatUnder;	// 0 - Ничего
					// 1 - Турель
					// 2 - Земля

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

		var xCell = Math.floor(x / this.map.gridPixelSize);
		var yCell = Math.floor(y / this.map.gridPixelSize);
		var clickedTurret = this.turrets.check(xCell,yCell);

		this.activeStack.push(clickedTurret);
		this.activeStack.push(this.mapCover);
		if(x<300) var xPos = Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize + 25;
		else var xPos = Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize - wt - 25;
		
		if(y<300) var yPos = Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize + 40;
		else var yPos = Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize - ht - 60;
		
		// Добавление нажатой клетки к списку рисования

		this.cellClicked = {};
		this.cellClicked.x0 = Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize;
		this.cellClicked.x1 = this.cellClicked.x0 + this.map.gridPixelSize;
		this.cellClicked.y0 = Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize;
		this.cellClicked.y1 = this.cellClicked.y0 + this.map.gridPixelSize;
		this.cellClicked.w = this.map.gridPixelSize;
		this.cellClicked.h = this.map.gridPixelSize;
		this.cellClicked.color = "rgba(1, 1, 1, 0.2)";
		this.cellClicked.visible = true;
		this.activeStack.push(this.cellClicked);

		if(clickedTurret){

			whatUnder = 1;
			// Добавление радиуса стрельбы турели к списку рисования
			this.fireRange = {};
			this.fireRange.isRound = true;
			this.fireRange.x0 = Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize +this.map.gridPixelSize/2;
			this.fireRange.y0 = Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize +this.map.gridPixelSize/2;
			this.fireRange.r = clickedTurret.range * this.game.map.gridPixelSize+2
			this.fireRange.visible = true;
			this.fireRange.color = "rgba(1, 1, 1, 0.5)";
			this.activeStack.push(this.fireRange);
			for (var i = 0; i < 2; i++) {
				this.turretButtons[i].x0 = xPos + 25;
				this.turretButtons[i].y0 = yPos + i * 30 ;
				this.turretButtons[i].x1 = this.turretButtons[i].x0 + this.turretButtons[i].w;
				this.turretButtons[i].y1 = this.turretButtons[i].y0 + this.turretButtons[i].h;
				this.turretButtons[i].xBuildCell = Math.floor(x / this.map.gridPixelSize);
				this.turretButtons[i].yBuildCell = Math.floor(y / this.map.gridPixelSize);
				this.activeStack.push(this.turretButtons[i]);
			}
		} else {
			whatUnder = 2;
			// Добавление меню с выбором турелей к списку рисования
			for (var i = 0; i < this.towerButtons.length; i++) {
				this.towerButtons[i].x0 = xPos + 25;
				this.towerButtons[i].y0 = yPos + i * 30 ;
				this.towerButtons[i].x1 = this.towerButtons[i].x0 + this.towerButtons[i].w;
				this.towerButtons[i].y1 = this.towerButtons[i].y0 + this.towerButtons[i].h;
				this.towerButtons[i].xBuildCell = Math.floor(x / this.map.gridPixelSize);
				this.towerButtons[i].yBuildCell = Math.floor(y / this.map.gridPixelSize);
				this.activeStack.push(this.towerButtons[i]);
			}
		}
	}.bind(this);

	this.activeStack.push(this.mapArea);	
	
	this.towerButtons = [];
		for (i in this.towerTypes) {
			this.towerButtons.push({});
		}
	// Tower selection buttons
	for (var i = 0; i < this.towerTypesLength; i++) {
		this.towerButtons[i].x0 = 0;
		this.towerButtons[i].x1 = 0;
		this.towerButtons[i].y0 = 0;
		this.towerButtons[i].y1 = 0;
		this.towerButtons[i].w = wt;
		this.towerButtons[i].h = ht;
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
			this.activeStack.splice(-(this.towerTypesLength + 3), (this.towerTypesLength + 3));	
			//this.activeStack.pop(); // - Нажатая клетка		
		}.bind(this, i);
	}

	//Кнопка продажи
	this.turretButtons = [{},{}];
	this.turretButtons[0].x0 = 0;
	this.turretButtons[0].x1 = 0;
	this.turretButtons[0].y0 = 0;
	this.turretButtons[0].y1 = 0;
	this.turretButtons[0].w = wt;
	this.turretButtons[0].h = ht;
	this.turretButtons[0].color = "#CCDDEE";
	this.turretButtons[0].visible = true;
	this.turretButtons[0].captureClick = true;
	this.turretButtons[0].xBuildCell = 0;
	this.turretButtons[0].yBuildCell = 0;
	this.turretButtons[0].text = "Продать";
	this.turretButtons[0].colorFG = "black";
	this.turretButtons[0].textStyle = '14pt Arial';
	this.turretButtons[0].click = function(i) {
		this.turrets.sell(this.activeStack[1].xGrid,this.activeStack[1].yGrid);
		this.activeStack.splice(-6, 6);	// Удаление всего из списка рисования
	}.bind(this, i);
	
	//Кнопка апгрейда
	this.turretButtons[1].x0 = 0;
	this.turretButtons[1].x1 = 0;
	this.turretButtons[1].y0 = 0;
	this.turretButtons[1].y1 = 0;
	this.turretButtons[1].w = wt;
	this.turretButtons[1].h = ht;
	this.turretButtons[1].color = "#CCDDEE";
	this.turretButtons[1].visible = true;
	this.turretButtons[1].captureClick = true;
	this.turretButtons[1].xBuildCell = 0;
	this.turretButtons[1].yBuildCell = 0;
	this.turretButtons[1].text = "Улучшить";
	this.turretButtons[1].colorFG = "black";
	this.turretButtons[1].textStyle = '14pt Arial';
	this.turretButtons[1].click = function(i) {
		this.turrets.upgrade(this.activeStack[1].xGrid,this.activeStack[1].yGrid);
		this.activeStack.splice(-6, 6);	// Удаление всего из списка рисования
	}.bind(this, i);



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
		if(whatUnder == 1){
			this.activeStack.splice(-6, 6);
			whatUnder = 0;
		} else if(whatUnder == 2) {
			this.activeStack.splice(-(this.towerTypesLength + 3), (this.towerTypesLength + 3));
			whatUnder = 0;
		}	
	}.bind(this);

};

td.UI.prototype.render = function(ctx) {
	this.ctx = ctx;
	
	for (i in this.activeStack) {
		if (this.activeStack[i].visible) {
			if(this.activeStack[i].isRound){
				this.ctx.beginPath();
				this.ctx.fillStyle = this.activeStack[i].color;
				this.ctx.arc(this.activeStack[i].x0, this.activeStack[i].y0, this.activeStack[i].r, 0, (Math.PI/180)*360, true);
				this.ctx.fill();
				this.ctx.closePath();
			}else{
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
