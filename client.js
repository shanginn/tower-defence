window.onload = function() {
	window.ui = new td.UI();
	window.game = new td.GameState(this.ui);
	window.pause = new td.PauseState(this.ui);
	window.fsm = new td.FSM();
	window.fsm.setInitialState(window.game);
	window.renderer = new td.Renderer(game);
	window.renderer.render();
};