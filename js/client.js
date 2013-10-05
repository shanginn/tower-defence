window.onload = function() {
	window.canvas = document.getElementById("gameCanvas");
	window.mainMenu = new td.MainMenu(canvas);
	window.pause = new td.PauseState(canvas);
	window.game = new td.GameState(canvas);
	window.fsm = new td.FSM();
	window.dead = new td.Dead(canvas);
	window.win = new td.Win(canvas);
	window.fsm.setInitialState(window.game);
//	window.renderer = new td.Renderer(game);
//	window.renderer.render();
};