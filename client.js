window.onload = function() {
	window.game = new td.Game();
	window.renderer = new td.Renderer(game);
	
	var startTime = new Date().valueOf();
	console.log("play");
	window.game.play(startTime, Math.round(1000/60));
	window.renderer.render();
};