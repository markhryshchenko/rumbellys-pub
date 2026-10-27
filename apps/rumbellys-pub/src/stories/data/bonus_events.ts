export default {
	"reveal": {
		"index": 0,
		"type": "reveal",
		"board": [
			[
				{
					"name": "H5"
				},
				{
					"name": "S",
					"scatter": true
				},
				{
					"name": "L1"
				},
				{
					"name": "L1"
				},
				{
					"name": "H3"
				}
			],
			[
				{
					"name": "H2"
				},
				{
					"name": "L1"
				},
				{
					"name": "H3"
				},
				{
					"name": "L1"
				},
				{
					"name": "S",
					"scatter": true
				}
			],
			[
				{
					"name": "H1"
				},
				{
					"name": "S",
					"scatter": true
				},
				{
					"name": "L3"
				},
				{
					"name": "H3"
				},
				{
					"name": "H4"
				}
			],
			[
				{
					"name": "L1"
				},
				{
					"name": "L2"
				},
				{
					"name": "S",
					"scatter": true
				},
				{
					"name": "W",
					"wild": true
				},
				{
					"name": "H1"
				}
			],
			[
				{
					"name": "W",
					"wild": true
				},
				{
					"name": "L1"
				},
				{
					"name": "L4"
				},
				{
					"name": "H5"
				},
				{
					"name": "L3"
				}
			]
		],
		"paddingPositions": [
			39,
			3,
			16,
			41,
			49
		],
		"gameType": "basegame",
		"anticipation": [
			0,
			0,
			0,
			1,
			2
		]
	},
	"setTotalWin": {
		"index": 1,
		"type": "setTotalWin",
		"amount": 0
	},
	"freeSpinTrigger": {
		"index": 2,
		"type": "freeSpinTrigger",
		"totalFs": 8,
		"positions": [
			{
				"reel": 0,
				"row": 1
			},
			{
				"reel": 2,
				"row": 1
			},
			{
				"reel": 3,
				"row": 2
			}
		]
	},
	"updateFreeSpin": {
		"index": 3,
		"type": "updateFreeSpin",
		"amount": 0,
		"total": 8
	},
	"winInfo": {
		"index": 5,
		"type": "winInfo",
		"totalWin": 150,
		"wins": [
			{
				"symbol": "H1",
				"kind": 3,
				"win": 150,
				"positions": [
					{
						"reel": 0,
						"row": 3
					},
					{
						"reel": 1,
						"row": 3
					},
					{
						"reel": 2,
						"row": 3
					}
				],
				"meta": {
					"lineIndex": 3,
					"multiplier": 1,
					"winWithoutMult": 150,
					"globalMult": 1,
					"lineMultiplier": 1
				}
			}
		]
	},
	"setWin": {
		"index": 6,
		"type": "setWin",
		"amount": 150,
		"winLevel": 3
	},
	"updateBelly": {
		"index": 8,
		"type": "updateBelly",
		"positions": [
			{
				"reel": 0,
				"row": 1
			}
		],
		"mugs": 1,
		"level": 0,
		"levelUp": false,
		"globalMult": 1,
		"totalFs": 8
	},
	"updateGlobalMult": {
		"index": 17,
		"type": "updateGlobalMult",
		"globalMult": 2
	},
	"freeSpinEnd": {
		"index": 78,
		"type": "freeSpinEnd",
		"amount": 2120,
		"winLevel": 5
	},
	"finalWin": {
		"index": 79,
		"type": "finalWin",
		"amount": 2120
	},
	"freeSpinRetrigger": {
		"index": 41,
		"type": "freeSpinRetrigger",
		"totalFs": 19,
		"positions": [
			{
				"reel": 2,
				"row": 1
			},
			{
				"reel": 3,
				"row": 2
			},
			{
				"reel": 4,
				"row": 3
			}
		]
	},
	"wincap": {
		"index": 123,
		"type": "wincap",
		"amount": 500000
	}
};
