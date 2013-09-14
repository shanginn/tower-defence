td.Map = function() {
	this.name = "Map Zero";
	this.size = 15;
	this.gridPixelSize = 40;
	this.layout = [
		[0,0,0,1,0,1,1,1,1,1,0,0,0,0,0],
		[0,0,0,1,1,1,0,0,0,1,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
		[0,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
		[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,1,0,1,1,1,1,1,0,0,0,0,0],
		[0,0,0,1,0,1,0,0,0,1,0,0,0,0,0],
		[0,0,0,1,0,1,0,0,0,1,0,1,1,1,0],
		[0,0,0,1,1,1,0,0,0,1,1,1,0,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,2,0]
	];
	this.nx = this.layout[0].length;
	this.ny = this.layout.length;
	this.goalHp = 50;
	gameHP.textContent = this.goalHp;
	this.waves = [
		{enemies:	[4, 4, 4, 4, 4]},
		{enemies:	[1, 3, 1, 3, 1]},
		{enemies:	[2, 4, 2, 1, 4]},
		{enemies:	[1, 3, 1, 3, 1]},
		{enemies:	[2, 2, 3, 4, 4]}	
	];
};

td.Map.prototype.generate = function(layout, size) {
	

};