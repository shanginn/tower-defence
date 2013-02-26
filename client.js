window.onload = function() {
	window.canvas = document.getElementById("gameCanvas");
	window.mainMenu = new td.MainMenu(canvas);
	window.pause = new td.PauseState(canvas);
	window.game = new td.GameState(canvas);
	window.fsm = new td.FSM();
	window.fsm.setInitialState(window.game);
//	window.renderer = new td.Renderer(game);
//	window.renderer.render();
};