/*
spaghetti code is all mine,
`iterateMove` which is the only part of this which is actually needed was copied from hyperbolia, i arguably have no right to even be saying this is mine
I had a suckass solution which only works for part 1 but i ain't uploading that
*/
const AoC2024_21 = {
	processInputLine:function(line) {
		line = "A"+line
		let out = []
		for (let pos=0;pos<line.length-1;pos++) {
			let move = line.substring(pos,pos+2)
			out.push(this.navigate(this.numericKeypad,move[0],move[1]))
		}
		return out.reduce((x,y)=>this.addMovesetArrays(x,y))
	},
	processInput:function(input=document.body.innerText) {
		return input.split("\n").filter(x=>x!=="")
	},
	numericKeypad:[["7","8","9"],["4","5","6"],["1","2","3"],[undefined,"0","A"]],
	directionalKeypad:[[undefined,"^","A"],["<","v",">"]],
	// gets the coordinate of a key on the keypad, where (0, 0) is the top-left key
	getCoordinate:function(keypad,button) {
		for (let coord1=0;coord1<keypad.length;coord1++) {
			for (let coord2=0;coord2<3;coord2++) {
				if (keypad[coord1][coord2]===button) {
					return [coord1,coord2]
				}
			}
		}
	},
	// computing each time is too slow
	navigateCache:{},
	// outputs the set of moves to get from one key to the next, at layer `x`
	navigate:function(keypad,startKey,endKey) {
		if (this.navigateCache[startKey+endKey]!==undefined) {
			return this.navigateCache[startKey+endKey]
		}
		let startCoord = this.getCoordinate(keypad,startKey)
		let endCoord = this.getCoordinate(keypad,endKey)
		let d1 = endCoord[0]-startCoord[0]
		let d2 = endCoord[1]-startCoord[1]
		let d1Symbol = (d1<0)?"^".repeat(-d1):(d1>0)?"v".repeat(d1):""
		let d2Symbol = (d2<0)?"<".repeat(-d2):(d2>0)?">".repeat(d2):""
		// it is optimal to cover all the distance on one axis first, then all the distance on the other.
		// however, we do not know which axis this is, so let's consider both.
		let keyAfterAxis1Motion = keypad[endCoord[0]][startCoord[1]]
		let keyAfterAxis2Motion = keypad[startCoord[0]][endCoord[1]]
		let outStrings = []
		if (keyAfterAxis1Motion!==undefined) {
			outStrings.push("A"+d1Symbol+d2Symbol+"A")
		}
		if (keyAfterAxis2Motion!==undefined) {
			outStrings.push("A"+d2Symbol+d1Symbol+"A")
		}
		// let's make things faster and not do the same calculation twice
		outStrings = Array.from(new Set(outStrings))
		let out = []
		for (let outString of outStrings) {
			let nextOut = {}
			for (let pos=0;pos<outString.length-1;pos++) {
				let move = outString.substring(pos,pos+2)
				if (nextOut[move]===undefined) {
					nextOut[move] = 0
				}
				nextOut[move]++
			}
			out.push(nextOut)
		}
		this.navigateCache[startKey+endKey] = structuredClone(out)
		return out
	},
	lengthOfMoveset:function(moveset){
		let out = 0
		for (let moveType of Object.values(moveset)) {
			out += moveType
		}
		return out
	},
	addMovesets:function(move1,move2) {
		let out = {}
		for (let moveType of Object.keys(move1)) {
			out[moveType] = (out[moveType]??0) + move1[moveType]
		}
		for (let moveType of Object.keys(move2)) {
			out[moveType] = (out[moveType]??0) + move2[moveType]
		}
		return out
	},
	addMovesetArrays:function(arr1,arr2){
		let out = []
		// find all possible ways to add the first array to the second
		for (let set1 of arr1) {
			for (let set2 of arr2) {
				out.push(this.addMovesets(set1,set2))
			}
		}
		// all objects have a unique JSON representation, so by stringifying we can remove duplicates
		out = out.map(x=>JSON.stringify(x))
		out = Array.from(new Set(out))
		return out.map(x=>JSON.parse(x))
	},
	multiplyMoveset:function(move,scalar) {
		let out = {}
		for (let moveType of Object.keys(move)) {
			out[moveType] = move[moveType] * scalar
		}
		return out
	},
	multiplyMovesetArray:function(arr,scalar) {
		let out = []
		for (let moveset of arr) {
			out.push(this.multiplyMoveset(moveset,scalar))
		}
		return out
	},
	iteratedMoveCache:{},
	iterateMove:function(move,depth) {
		if (depth===0) {
			return 1
		}
		if (this.iteratedMoveCache[move+"_"+depth]!==undefined) {
			return this.iteratedMoveCache[move+"_"+depth]
		}
		// consider all the possible ways to carry out this move, check how long each step takes at the previous level and sum these lengths. Take the minimum value.
		let movesets = this.navigate(this.directionalKeypad,move[0],move[1])
		let possibleOuts = []
		for (let moveset of movesets) {
			let nextOut = 0
			for (let i of Object.keys(moveset)) {
				nextOut += this.iterateMove(i,depth-1) * moveset[i]
			}
			possibleOuts.push(nextOut)
		}
		let out = possibleOuts.reduce((x,y)=>Math.min(x,y),Infinity)
		this.iteratedMoveCache[move+"_"+depth] = out
		return out
	},
	numericCodeLength:function(code,depth){
		let moveArray = this.processInputLine(code)
		let out = []
		for (let moves of moveArray) {
			let nextOut = 0
			for (let move of Object.keys(moves)) {
				nextOut += this.iterateMove(move,depth) * moves[move]
			}
			out.push(nextOut)
		}
		return out.reduce((x,y)=>Math.min(x,y))
	},
	answer:function(iterations,input) {
		let out = 0
		for (let line of input) {
			out += this.numericCodeLength(line,iterations) * Number(line.substring(0,3))
		}
		return out
	},
	part1:function(input=this.processInput()) {
		return this.answer(2,input)
	},
	part2:function(input=this.processInput()) {
		return this.answer(25,input)
	}
}