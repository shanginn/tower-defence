window.onload = function() {
	var game = new Game();
	var renderer = new Renderer(game);
	var input = new Input(game);
	
	var startTime = new Date().valueOf();
	console.log("play");
	game.play(startTime, Math.round(1000/60));
	renderer.render();
};