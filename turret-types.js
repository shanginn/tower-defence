(function(exports) {

var TurretTypes = {

	// basic gun
	"gun": {
		range: 10,
		cooldown: 500.0,
		damage: 1
	},

	// long range artillery
	"art": {
		range: 6.0,
		cooldown: 2000.0,
		damage: 20
	}
};

exports.TurretTypes = TurretTypes;

})(window);