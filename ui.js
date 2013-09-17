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
	this.enemies = game.enemies;

	
	// Map
	var wt=150;
	var ht=25;
	var	whatUnder = -1;	// 0 - Дорога
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
	 	td.Renderer.range = undefined;
	 	n-=k;
	 } 
	this.mapArea = {
		x0 					: 0,
		x1 					: this.map.nx * this.map.gridPixelSize,
		y0 					: 0,
		y1 					: this.map.ny * this.map.gridPixelSize,
		visible 			: false,
		captureClick 		: true,
		click 				: function(x, y) {
			var xCell = Math.floor(x / this.map.gridPixelSize);
			var yCell = Math.floor(y / this.map.gridPixelSize);
			var clickedTurret = this.turrets.check(xCell,yCell);
			
			if(this.map.layout[yCell][xCell] != 1){			
				addToDraw(clickedTurret);
				addToDraw(this.mapCover);
				/*if(x<300) var xPos = Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize + 25;
				else var xPos = Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize - wt - 25;
				
				if(y<300) var yPos = Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize + 40;
				else var yPos = Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize - ht - 60;*/
				//Относительная позиция меню
				var xPos = Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize - (x/600) * wt;
				var yPos = Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize - (y/600) * ht * (this.towerTypesLength) + 10;
				//console.log(Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize,Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize,x,y);
				// Добавление нажатой клетки к списку рисования
				this.cellClicked = {
					x0 		: Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize,
					x1 		: Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize + this.map.gridPixelSize,
					y0 		: Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize,
					y1 		: Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize + this.map.gridPixelSize,
					w  		: this.map.gridPixelSize,
					h 		: this.map.gridPixelSize,
					visible : true,
				};
				addToDraw(this.cellClicked);
				if(clickedTurret){

					whatUnder = 1;
					// Добавление радиуса стрельбы турели к списку рисования
					this.fireRange = {
						isRound : true,
						x0 		: Math.floor(x / this.map.gridPixelSize) * this.map.gridPixelSize + this.map.gridPixelSize/2,
						y0 		: Math.floor(y / this.map.gridPixelSize) * this.map.gridPixelSize + this.map.gridPixelSize/2,
						r 		: clickedTurret.range * this.game.map.gridPixelSize+2,
						visible : true,
						color 	: clickedTurret.range < 6 ?  "rgba(200, 250, 200, 0.2)" : "gradient",
					};
					addToDraw(this.fireRange);
					
					td.Renderer.range = this.fireRange;

					this.turretButtons[0].text = (clickedTurret.lvl + 1 )  + " уровень.";
					this.turretButtons[1].cost = Math.floor(clickedTurret.cost/2);
					this.turretButtons[1].hovered = false;
					if(clickedTurret.lvl < 5 && this.player.money > Math.floor(clickedTurret.cost/2)){
						this.turretButtons[1].captureClick = true;
						this.turretButtons[1].text = "Улучшить: " + Math.floor(clickedTurret.cost/2);
					} else if (clickedTurret.lvl < 5) {
						this.turretButtons[1].text = "Улучшить: " + Math.floor(clickedTurret.cost/2);
						this.turretButtons[1].captureClick = false;
					} else {
						this.turretButtons[1].text = "Улучшить."
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
						this.towerButtons[i].hovered = false;
						this.towerButtons[i].x0 = xPos + 25;
						this.towerButtons[i].y0 = yPos + i * 30 ;
						this.towerButtons[i].x1 = this.towerButtons[i].x0 + this.towerButtons[i].w;
						this.towerButtons[i].y1 = this.towerButtons[i].y0 + this.towerButtons[i].h;
						this.towerButtons[i].xBuildCell = Math.floor(x / this.map.gridPixelSize);
						this.towerButtons[i].yBuildCell = Math.floor(y / this.map.gridPixelSize);
						addToDraw(this.towerButtons[i]);
					}
				}
			}
		}.bind(this)
	};
	this.mapArea.w = this.mapArea.x1 - this.mapArea.x0;
	this.mapArea.h = this.mapArea.y1 - this.mapArea.y0;
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
		function (whereAdd,x0,y0,w,h,visible,captureClick,mouseOver,cost,type,xBuildCell,yBuildCell,text,clickFun,mouseOverFun,mouseOutOverFun) {
			//Кнопка добавления башни
			var btn = {
				x0 				: x0,
				y0 				: y0,
				w 				: w,
				h 				: h,
				visible 		: visible,
				captureClick 	: captureClick,
				mouseOver 		: mouseOver,
				cost 			: cost,
				type 			: type,
				xBuildCell 		: xBuildCell,
				yBuildCell 		: yBuildCell,
				text 			: text,
				click 			: clickFun,
				mouseOverFun 	: mouseOverFun,
				mouseOutOverFun : mouseOutOverFun,
				hovered			: false,
			};

			whereAdd.push(btn);
		},
		//Кнопки турелей
		function (whereAdd,x0,y0,w,h,visible,captureClick,mouseOver,xBuildCell,yBuildCell,clickFun,mouseOverFun,mouseOutOverFun) {
			var btn = {
				x0 				: x0,
				y0 				: y0,
				w 				: w,
				h 				: h,
				visible 		: visible,
				captureClick 	: captureClick,
				mouseOver 		: mouseOver,
				xBuildCell 		: xBuildCell,
				yBuildCell 		: yBuildCell,
				click 			: clickFun,
				mouseOverFun 	: mouseOverFun,
				mouseOutOverFun : mouseOutOverFun,
				hovered			: false,
			};
			whereAdd.push(btn);
		}
	)
	this.towerButtons = [];

	// Кнопки башен
	for (var i = 0; i < this.towerTypesLength; i++) {
		this.type = Object.keys(this.towerTypes)[i];
		this.cost = this.towerTypes[this.type].cost
		this.text = this.towerTypes[this.type].name + ": " + this.cost;
		addButton(this.towerButtons,0,0,wt,ht,true,true,true,this.cost,this.type,0,0, this.text, 
			function(i) {
				this.turrets.spawn(this.towerButtons[i].xBuildCell, this.towerButtons[i].yBuildCell, this.towerButtons[i].type);
				removeDraw(n-1);
			}.bind(this, i),
			function(i,x,y){
				this.fireRange = {
					isRound : true,
					x0 		: x,
					y0 		: y,
					r 		: this.towerTypes[this.towerButtons[i].type].range * this.game.map.gridPixelSize+2,
					visible : true,
					color 	: this.towerTypes[this.towerButtons[i].type].range < 6 ?  "rgba(20, 25, 25, 0.2)" : "gradient"
				};
				addToDraw(this.fireRange);
				this.info = {
					x0 : x - 20 - (x/600) * wt + 25,
					y0 : y - 20 - (y/600) * ht * (this.towerTypesLength) - 55,
					visible: true,
					w: wt,
					h: 60,
					captureClick: false,
					color: "rgba(255, 255, 255, 0.8)",
					textStyle	: "11pt Arial",
					text 	: [
						"Урон: " + this.towerTypes[this.towerButtons[i].type].damage + ", радиус: " + this.towerTypes[this.towerButtons[i].type].range,
						"Перезарядка: " + this.towerTypes[this.towerButtons[i].type].cooldown / 1000 + "с.",
						"Доступно с " + (this.towerTypes[this.towerButtons[i].type].fromLvl + 1) + " уровня."
					],
					multiLine : true,
				}
				/*if(user.lvl < this.towerTypes[this.towerButtons[i].type].fromLvl)
					this.info.text[this.info.text.length] = "Доступно с " + (this.towerTypes[this.towerButtons[i].type].fromLvl + 1) + " уровня.";
					*/
				//console.log(x,y);
				addToDraw(this.info);
			}.bind(this,i),
			function(){
				removeDraw(2);
			}
		);
	}
	this.turretButtons = [];
	//Текст туррельки
	addButton(this.turretButtons,0,0,wt,ht,true,false,false,0,0,undefined,undefined,undefined);	
		
	//Кнопка апгрейда
	addButton(this.turretButtons,0,0,wt,ht,true,true,true,0,0,
		function(i) {
			this.turrets.upgrade(this.turrets.check(this.activeStack[1].xGrid,this.activeStack[1].yGrid));
			removeDraw(n-1);
		}.bind(this, i),
		function(i,x,y){
			this.activeStack[4].visible = false;
			this.turret = this.turrets.check(this.activeStack[1].xGrid,this.activeStack[1].yGrid);
			this.fireRange = {
				isRound	: true,
				x0 		: x,
				y0 		: y,
				r 		: (this.turret.range * this.game.map.gridPixelSize+2)*1.2,
				visible : true,
				color 	: this.turret.range*1.2 < 6 ?  "rgba(200, 250, 200, 0.1)" : "gradient",
			};
			addToDraw(this.fireRange);
		}.bind(this,i),
		function(){
			this.activeStack[4].visible = true;			
			removeDraw(1);
		}.bind(this)		
	);	

	//Кнопка продажи
	addButton(this.turretButtons,0,0,wt,ht,true,true,true,0,0,
		function(i) {
			this.turrets.sell(this.activeStack[1].xGrid,this.activeStack[1].yGrid);
			removeDraw(n-1);
		}.bind(this, i),
		undefined,undefined);




	// Another map cover which hides the build tower buttons if somewhere else on the map is clicked
	this.mapCover = {
		x0 : 0,
		x1 : this.map.nx * this.map.gridPixelSize,
		y0 : 0,
		y1 : this.map.ny * this.map.gridPixelSize,
		w  : this.mapArea.x1 - this.mapArea.x0,
		h  : this.mapArea.y1 - this.mapArea.y0,
		visible : false,
		captureClick : true,
		click : function(x, y) {
			if(whatUnder == 1){
			clickedEnemy = this.enemies.check(x,y);
			if(typeof clickedEnemy != 'undefined')
				this.activeStack[1].target = this.enemies.check(x,y);
				removeDraw(n-1);
				whatUnder = 0;
			} else if(whatUnder == 2) {
				removeDraw(n-1);
				whatUnder = 0;
			}	
		}.bind(this)
	};	
};

td.UI.prototype.render = function(ctx) {
	this.ctx = ctx;
	for (i in this.activeStack) {
		if (typeof this.activeStack[i] != 'undefined' && this.activeStack[i].visible) {
			
			//Мышка наведена на кнопку башни? Рисуем предполагаемый радиус
			var inBtn = this.activeStack[i].mouseOver && this.game.mouseX > this.activeStack[i].x0 && this.game.mouseX < this.activeStack[i].x0 + this.activeStack[i].w &&
			   this.game.mouseY > this.activeStack[i].y0 && this.game.mouseY < this.activeStack[i].y0 + this.activeStack[i].h;
			if(this.activeStack[i].hovered && !inBtn){
				this.activeStack[i].hovered = false;
				if(typeof this.activeStack[i].mouseOutOverFun != 'undefined')
					this.activeStack[i].mouseOutOverFun();

			} else if( inBtn && this.activeStack[i].captureClick && !this.activeStack[i].hovered ){
				this.activeStack[i].hovered = true;
				if(typeof this.activeStack[i].mouseOverFun != 'undefined')
					this.activeStack[i].mouseOverFun(Math.floor((this.activeStack[3].x0+this.activeStack[3].x1)/2),Math.floor((this.activeStack[3].y0+this.activeStack[3].y1)/2));
			}

			if(this.activeStack[i].isRound){
				// Если пушка может бить воздушные цели, делаем ей градиентный радиус
				if(this.activeStack[i].color == "gradient"){
					var grd = this.ctx.createRadialGradient(this.activeStack[i].x0,this.activeStack[i].y0,this.activeStack[i].r/5,
						this.activeStack[i].x0,this.activeStack[i].y0,this.activeStack[i].r);
					grd.addColorStop(0, "rgba(255,255,255,0.2)");
					grd.addColorStop(1, "rgba(0,0,0,0.2)");
					this.ctx.fillStyle = grd;
				} else this.ctx.fillStyle = this.activeStack[i].color;
				this.ctx.beginPath();
				this.ctx.arc(this.activeStack[i].x0, this.activeStack[i].y0, this.activeStack[i].r, 0, (Math.PI/180)*360, true);
				this.ctx.closePath();
				this.ctx.fill();
			} else {
				if(this.activeStack[i].hovered && this.activeStack[i].captureClick){
					//Обводка кнопки под мышкой
					this.ctx.strokeStyle = "rgba(0,200,10,0.8)"
					this.ctx.lineWidth = 3;
					this.ctx.strokeRect(this.activeStack[i].x0, this.activeStack[i].y0, this.activeStack[i].w, this.activeStack[i].h);
				}
				
				if(!this.activeStack[i].hasOwnProperty("color"))
					this.ctx.fillStyle = this.activeStack[i].captureClick ? "#CCDDEE" : "rgba(20, 25, 25, 0.2)";
				else this.ctx.fillStyle = this.activeStack[i].color;

				this.ctx.fillRect(this.activeStack[i].x0, this.activeStack[i].y0, this.activeStack[i].w, this.activeStack[i].h);
				if (this.activeStack[i].hasOwnProperty("text")) {
					this.ctx.fillStyle = "black";
					if(!this.activeStack[i].hasOwnProperty("textStyle"))
						this.ctx.font = "14pt Arial";
					else this.ctx.font = this.activeStack[i].textStyle;
					if(!this.activeStack[i].hasOwnProperty("textAlign"))
						this.ctx.textAlign = 'center';
					else this.ctx.textAlign = this.activeStack[i].textAlign;
					if(this.activeStack[i].hasOwnProperty("multiLine")){
						this.y = this.activeStack[i].y0 + 15;
						for(k in this.activeStack[i].text){
							this.ctx.fillText(this.activeStack[i].text[k], this.activeStack[i].x0 + this.activeStack[i].w / 2, this.y);
							this.y += 12.8;
						}
					} else this.ctx.fillText(this.activeStack[i].text, this.activeStack[i].x0 + this.activeStack[i].w / 2, this.activeStack[i].y0 + this.activeStack[i].h / 2 + 5);
				}
			}

			// Сделать ли кнопку активной?
			if(this.activeStack[i].hasOwnProperty("cost")){
				if(this.player.money >= this.activeStack[i].cost && this.activeStack[i].text != 'Улучшить.'){
					this.activeStack[i].captureClick = true;
				} else {
					this.activeStack[i].captureClick = false;
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
