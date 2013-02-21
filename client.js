window.onload = function() {
	window.game = new td.GameState();
	window.pause = new td.PauseState();
	window.fsm = new td.FSM();
	window.fsm.setInitialState(window.game);
	window.renderer = new td.Renderer(game);
	window.renderer.render();
	
};