(function(exports) {

var TurretTypes = {

	// basic gun
	"gun": {
		range: 2.5,
		cooldown: 250.0,
		damage: 2
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