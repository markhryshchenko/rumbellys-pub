export default {
	"reveal": {
		"index": 0,
		"type": "reveal",
		"board": [
			[
				{
					"name": "W",
					"wild": true
				},
				{
					"name": "L1"
				},
				{
					"name": "H5"
				},
				{
					"name": "S",
					"scatter": true
				},
				{
					"name": "L1"
				}
			],
			[
				{
					"name": "H2"
				},
				{
					"name": "L4"
				},
				{
					"name": "H3"
				},
				{
					"name": "H5"
				},
				{
					"name": "H3"
				}
			],
			[
				{
					"name": "L3"
				},
				{
					"name": "S",
					"scatter": true
				},
				{
					"name": "H1"
				},
				{
					"name": "L5"
				},
				{
					"name": "H5"
				}
			],
			[
				{
					"name": "L3"
				},
				{
					"name": "H4"
				},
				{
					"name": "S",
					"scatter": true
				},
				{
					"name": "H3"
				},
				{
					"name": "H5"
				}
			],
			[
				{
					"name": "H2"
				},
				{
					"name": "L5"
				},
				{
					"name": "S",
					"scatter": true
				},
				{
					"name": "L2"
				},
				{
					"name": "H4"
				}
			]
		],
		"paddingPositions": [
			37,
			47,
			1,
			0,
			11
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
		"totalFs": 10,
		"positions": [
			{
				"reel": 0,
				"row": 3
			},
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
				"row": 2
			}
		]
	},
	"updateFreeSpin": {
		"index": 3,
		"type": "updateFreeSpin",
		"amount": 0,
		"total": 10
	},
	"winInfo": {
		"index": 5,
		"type": "winInfo",
		"totalWin": 1000,
		"wins": [
			{
				"symbol": "H5",
				"kind": 5,
				"win": 1000,
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
						"row": 2
					},
					{
						"reel": 3,
						"row": 1
					},
					{
						"reel": 4,
						"row": 1
					}
				],
				"meta": {
					"lineIndex": 7,
					"multiplier": 1,
					"winWithoutMult": 1000,
					"globalMult": 1,
					"lineMultiplier": 1
				}
			}
		]
	},
	"setWin": {
		"index": 6,
		"type": "setWin",
		"amount": 1000,
		"winLevel": 5
	},
	"updateBelly": {
		"index": 8,
		"type": "updateBelly",
		"positions": [
			{
				"reel": 0,
				"row": 3
			},
			{
				"reel": 2,
				"row": 2
			},
			{
				"reel": 3,
				"row": 3
			},
			{
				"reel": 4,
				"row": 2
			}
		],
		"mugs": 4,
		"level": 1,
		"levelUp": true,
		"globalMult": 2,
		"totalFs": 12
	},
	"updateGlobalMult": {
		"index": 9,
		"type": "updateGlobalMult",
		"globalMult": 2
	},
	"wincap": {
		"index": 109,
		"type": "wincap",
		"amount": 500000
	},
	"freeSpinEnd": {
		"index": 112,
		"type": "freeSpinEnd",
		"amount": 500000,
		"winLevel": 10
	},
	"finalWin": {
		"index": 113,
		"type": "finalWin",
		"amount": 500000
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
	}
};
