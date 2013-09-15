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

	
	// Map
	var wt=150;
	var ht=25;
	var	whatUnder;	// 0 - Ничего
					// 1 - Турель
					// 2 - Земля
	var n = 0; // Сколько вещей рисуется
	stack = this.activeStack;
	function addToDraw (what) {
	 	stack.push(what);
	 	n++;
	}
	function removeDraw (k) {
	 	stack.splice(-k,k);
	 	n-=k;
	 } 
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

		addToDraw(clickedTurret);
		addToDraw(this.mapCover);
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
		this.cellClicked.color = "rgba(0, 0, 0, 0.2)";
		this.cellClicked.visible = true;
		addToDraw(this.cellClicked);

		if(clickedTurret){

			whatUnder = 1;
			// Добавление радиуса стрельбы турели к списку рисования
			this.fireRange = {};
			this.fireRange.isRound = true;
			this.fireRange.x0 = Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize +this.map.gridPixelSize/2;
			this.fireRange.y0 = Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize +this.map.gridPixelSize/2;
			this.fireRange.r = clickedTurret.range * this.game.map.gridPixelSize+2;
			this.fireRange.visible = true;
			this.fireRange.color = clickedTurret.range < 6 ?  "rgba(20, 25, 25, 0.2)" : "gradient";
			addToDraw(this.fireRange);
			this.turretButtons[0].text = (clickedTurret.lvl + 1 )  + " уровень.";
			this.turretButtons[1].cost = Math.floor(clickedTurret.cost/2);
			if(clickedTurret.lvl < 5 && this.player.money > Math.floor(clickedTurret.cost/2)){
				this.turretButtons[1].color = "#CCDDEE";
				this.turretButtons[1].captureClick = true;
				this.turretButtons[1].text = "Улучшить: " + Math.floor(clickedTurret.cost/2);
			} else if (clickedTurret.lvl < 5) {
				this.turretButtons[1].text = "Улучшить: " + Math.floor(clickedTurret.cost/2);
				this.turretButtons[1].color = "rgba(0 ,0 ,0 ,0.2)";
			} else {
				this.turretButtons[1].text = "Улучшить."
				this.turretButtons[1].color = "rgba(0 ,0 ,0 ,0.2)";
				this.turretButtons[1].captureClick = false;
			}
			this.turretButtons[2].text = "Продать: " + Math.floor(clickedTurret.cost/3);
			
			for (var i = 0; i < 3; i++) {
				this.turretButtons[i].x0 = xPos + 25;
				this.turretButtons[i].y0 = yPos + i * 30 ;
				this.turretButtons[i].x1 = this.turretButtons[i].x0 + this.turretButtons[i].w;
				this.turretButtons[i].y1 = this.turretButtons[i].y0 + this.turretButtons[i].h;
				this.turretButtons[i].xBuildCell = Math.floor(x / this.map.gridPixelSize);
				this.turretButtons[i].yBuildCell = Math.floor(y / this.map.gridPixelSize);
				addToDraw(this.turretButtons[i]);
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
				addToDraw(this.towerButtons[i]);
			}
		}
	}.bind(this);

	addToDraw(this.mapArea);	

//Функция для создания перегруженной функции addButton
	function polymorph() {
	  var len2func = [];
	  for(var i=0; i<arguments.length; i++)
	    if(typeof(arguments[i]) == "function")
	      len2func[arguments[i].length] = arguments[i];
	  return function() {
	    return len2func[arguments.length].apply(this, arguments);
	  }
	}
	var addButton = polymorph (
		function (whereAdd,x0,x1,y0,y1,w,h,color,visible,captureClick,cost,type,xBuildCell,yBuildCell,text,colorFG,textStyle,clickFun) {
			//Башенная кнопка
			var btn = {};
			btn.x0 				= x0; 		
			btn.x1 				= x1; 		
			btn.y0 				= y0; 		
			btn.y1 				= y1; 		
			btn.w 				= w; 			
			btn.h 				= h; 			
			btn.color 			= color; 		
			btn.visible 		= visible; 	
			btn.captureClick 	= captureClick;
			btn.cost 			= cost;
			btn.type 			= type; 		
			btn.xBuildCell 		= xBuildCell; 
			btn.yBuildCell 		= yBuildCell; 
			btn.text 			= text; 		
			btn.colorFG 		= colorFG;	
			btn.textStyle 		= textStyle; 	
			btn.click 			= clickFun;
			whereAdd.push(btn);
		},
		//Кнопки турелей
		function (whereAdd,x0,x1,y0,y1,w,h,color,visible,captureClick,xBuildCell,yBuildCell,colorFG,textStyle,clickFun) {
			var btn = {};
			btn.x0 				= x0; 		
			btn.x1 				= x1; 		
			btn.y0 				= y0; 		
			btn.y1 				= y1; 		
			btn.w 				= w; 			
			btn.h 				= h; 			
			btn.color 			= color; 		
			btn.visible 		= visible; 	
			btn.captureClick 	= captureClick;	
			btn.xBuildCell 		= xBuildCell; 
			btn.yBuildCell 		= yBuildCell; 
			//btn.text 			= text; 		
			btn.colorFG 		= colorFG;	
			btn.textStyle 		= textStyle; 	
			btn.click 			= clickFun;
			whereAdd.push(btn);
		}
	)
	this.towerButtons = [];

	// Кнопки башен
	for (var i = 0; i < this.towerTypesLength; i++) {
		this.type = Object.keys(this.towerTypes)[i];
		this.cost = this.towerTypes[this.type].cost
		this.text = this.towerTypes[this.type].name + ": " + this.cost;
		addButton(this.towerButtons,0,0,0,0,wt,ht,"#CCDDEE",true,true,this.cost,this.type,0,0, this.text, "black",'14pt Arial',
			function(i) {
				this.turrets.spawn(this.towerButtons[i].xBuildCell, this.towerButtons[i].yBuildCell, this.towerButtons[i].type);
				removeDraw(n-1);
			}.bind(this, i)
		);
	}
	this.turretButtons = [];
	//Текст туррельки
	addButton(this.turretButtons,0,0,0,0,wt,ht,"rgba(1 ,1 ,1 ,0.2)",true,false,0,0,"black",'14pt Arial',NaN);	
		
	//Кнопка апгрейда
	addButton(this.turretButtons,0,0,0,0,wt,ht,"#CCDDEE",true,true,0,0,"black",'14pt Arial',
		function(i) {
			this.turrets.upgrade(this.activeStack[1].xGrid,this.activeStack[1].yGrid);
			removeDraw(n-1);
		}.bind(this, i)
	);	

	//Кнопка продажи
	addButton(this.turretButtons,0,0,0,0,wt,ht,"#CCDDEE",true,true,0,0,"black",'14pt Arial',
		function(i) {
			this.turrets.sell(this.activeStack[1].xGrid,this.activeStack[1].yGrid);
			removeDraw(n-1);
		}.bind(this, i)
	);




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
			removeDraw(n-1);
			whatUnder = 0;
		} else if(whatUnder == 2) {
			removeDraw(n-1);
			whatUnder = 0;
		}	
	}.bind(this);

};

td.UI.prototype.render = function(ctx) {
	this.ctx = ctx;
	for (i in this.activeStack) {
		if (typeof this.activeStack[i] != 'undefined' && this.activeStack[i].visible) {
			if(this.activeStack[i].isRound){
				// Если пушка может бить воздушные цели, делаем ей градиентный радиус
				if(this.activeStack[i].color == "gradient"){
					var grd = this.ctx.createRadialGradient(this.activeStack[i].x0,this.activeStack[i].y0,this.activeStack[i].r/5,this.activeStack[i].x0,this.activeStack[i].y0,this.activeStack[i].r);
					grd.addColorStop(0, "rgba(255,255,255,0.2)");
					grd.addColorStop(1, "rgba(0,0,0,0.2)");
					this.ctx.fillStyle = grd;
				} else this.ctx.fillStyle = this.activeStack[i].color;
				this.ctx.beginPath();
				this.ctx.arc(this.activeStack[i].x0, this.activeStack[i].y0, this.activeStack[i].r, 0, (Math.PI/180)*360, true);
				this.ctx.closePath();
				this.ctx.fill();
			}else{
				this.ctx.fillStyle = this.activeStack[i].color;
				this.ctx.fillRect(this.activeStack[i].x0, this.activeStack[i].y0, this.activeStack[i].w, this.activeStack[i].h);
				if (this.activeStack[i].hasOwnProperty("text")) {
					this.ctx.fillStyle = this.activeStack[i].colorFG;
					this.ctx.font = this.activeStack[i].textStyle;
					this.ctx.textAlign = 'center';
					this.ctx.fillText(this.activeStack[i].text, this.activeStack[i].x0 + this.activeStack[i].w / 2, this.activeStack[i].y0 + this.activeStack[i].h / 2 + 5);
				}
			}

			// Сделать ли кнопку активной?
			if(this.activeStack[i].hasOwnProperty("cost")){
				if(this.player.money >= this.activeStack[i].cost){
					this.activeStack[i].color = "#CCDDEE";
				} else this.activeStack[i].color = "rgba(0, 0, 0, 0.2)";
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
