td.TurretTypes = {

	// basic gun
	"gun": {
		sounds: ['fire_single/gan1.mp3'],
		lvl: 0,
		id: 1,
		range: 2.1,
		cooldown: 400.0,
		damage: 1,
		cost: 100,
		name: "Лучник",
		color: "#376DFF",
		halfSize: 7,
		fromLvl: 0
	},

	
	// hmg
	"hmg": {
		sounds: ['fire_single/cata1.mp3'],
		lvl: 0,
		id: 3,
		range: 3.0,
		cooldown: 500.0,
		damage: 4,
		cost: 300,
		name: "Катапульта",
		color: "#003EE8",
		halfSize: 9,
		fromLvl: 0
	},


	// long range artillery
	"art": {
		sounds: ['fire_single/magic1.mp3'],
		lvl: 0,
		id: 2,
		range: 6.0,
		cooldown: 2000.0,
		damage: 15,
		cost: 500,
		name: "Магия",
		color: "#002999",
		halfSize: 12,
		fromLvl: 2
	},


	"slowpoke":{
		sounds: ['fire_single/frost1.mp3'],
		lvl: 0,
		id: 2,
		range: 4.0,
		cooldown: 1000.0,
		damage: 0.2,
		cost: 200,
		name: "Заморозка",
		color: "#0101FF",
		halfSize: 10,
		abilitys: ["freeze"],
		fromLvl: 3
	}

};