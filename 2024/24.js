const AoC2024_24 = {
	processInput:function(input=document.body.innerText) {
		let out = {
			wireValues:{},
			gates:[]
		}
		let midpointReached = false
		let lines = input.split("\n")
		for (let line of lines) {
			if (line==="") {
				midpointReached = true
			} else if (midpointReached) {
				let splitLine = line.split(" -> ")
				let input = splitLine[0].split(" ")
				out.gates.push({
					operands:[input[0],input[2]],
					operator:input[1],
					output:splitLine[1]
				})
			} else {
				let splitLine = line.split(": ")
				out.wireValues[splitLine[0]] = Number(splitLine[1])
			}
		}
		return out
	},
	evaluate:function(input) {
		let inputMap = this.inputMap(input.gates)
		let wiresChecked = [] // we will keep a record of wires checked. If ever `calcWireValue` is called on a wire in this list, the gate arrangement has a circular dependency so is invalid.
		let isValid = true
		function calcWireValue(wire) {
			if (wiresChecked.includes(wire)) {
				isValid = false
				return undefined
			}
			wiresChecked.push(wire)
			let gateNum = inputMap[wire].isOutput[0]
			let gate = input.gates[gateNum]
			let operands = gate.operands
			if (input.wireValues[operands[0]]===undefined) {
				calcWireValue(operands[0])
			}
			if (input.wireValues[operands[1]]===undefined) {
				calcWireValue(operands[1])
			}
			let operandValues = operands.map(x=>input.wireValues[x])
			let nextValue
			if (gate.operator==="OR") {
				nextValue = (operandValues[0]+operandValues[1]===0)?0:1
			} else if (gate.operator==="AND") {
				nextValue = operandValues[0]*operandValues[1]
			} else if (gate.operator==="XOR") {
				nextValue = (operandValues[0]===operandValues[1])?0:1
			}
			input.wireValues[gate.output] = nextValue
		}
		let out = 0
		for (let zValue=0;zValue<46;zValue++) {
			calcWireValue("z"+String(zValue).padStart(2,"0"))
			if (input.wireValues["z"+String(zValue).padStart(2,"0")]) {
				out += 2 ** zValue
			}
		}
		if (!isValid) {
			return -1
		}
		return out
	},
	part1:function(input=this.processInput()) {
		return this.evaluate(input)
	},
	// we don't want to iterate through all the gates each time we need to find something, so let's make a list of all the gate numbers relevant to each wire.
	inputMap:function(gates){
		let out = {}
		function addConnection(wire,gateNum,inputOrOutput) {
			if (out[wire]===undefined) {
				out[wire] = {
					isInput:[],
					isOutput:[]
				}
			}
			out[wire][inputOrOutput].push(gateNum)
		}
		for (let gateNum=0;gateNum<gates.length;gateNum++) {
			let gate = gates[gateNum]
			for (let operand of gate.operands) {
				addConnection(operand,gateNum,"isInput")
			}
			addConnection(gate.output,gateNum,"isOutput")
		}
		return out
	},
	// go up the adder from `x44` and `y44` and get all affected wires, then go up from `x43` and `y43` and so on.
	wireGenerations:function(gates){
		let inputMap = this.inputMap(gates)
		let out = {}
		for (let gen=0;gen<45;gen++) {
			out["x"+String(gen).padStart(2,"0")] = gen
			out["y"+String(gen).padStart(2,"0")] = gen
		}
		generationLoop: for (let gen=44;gen>=0;gen--) {
			let toConsider = []
			for (let gateNum of inputMap["x"+String(gen).padStart(2,"0")].isInput) {
				toConsider.push(gates[gateNum].output)
			}
			for (let gateNum of inputMap["y"+String(gen).padStart(2,"0")].isInput) {
				toConsider.push(gates[gateNum].output)
			}
			toConsider = Array.from(new Set(toConsider))
			while (toConsider.length>0) {
				if (out[toConsider[0]]===undefined) { // if the generation of a wire has already been determined, do not overwrite it
					out[toConsider[0]] = gen
					for (let gateNum of inputMap[toConsider[0]].isInput) {
						toConsider.push(gates[gateNum].output)
					}
					toConsider = Array.from(new Set(toConsider))
				}
				toConsider.splice(0,1)
			}
		}
		return out
	},
	blankWires:(function(){
		let out = {}
		for (let gen=0;gen<45;gen++) {
			out["x"+String(gen).padStart(2,"0")] = 0
			out["y"+String(gen).padStart(2,"0")] = 0
		}
		return out
	})(),
	// check if the adder can add one-bit integers correctly, then check if it can add two-bit integers, etc.
	findNumberOfWorkingBits:function(gates,knownWorkingBits){
		for (let bitAmount=knownWorkingBits;bitAmount<45;bitAmount++) {
			// we will vary the most significant x-bit, the most significant y-bit, and the carry bit (found by varying the second most significant x and y bit)
			for (let testNum=0;testNum<((bitAmount===0)?4:8);testNum++) {
				let wireValues = structuredClone(this.blankWires)
				let expectedAnswer = 0
				if (testNum%2===1) {
					wireValues["x"+String(bitAmount).padStart(2,"0")] = 1
					expectedAnswer++
				}
				if (testNum%4>1) {
					wireValues["y"+String(bitAmount).padStart(2,"0")] = 1
					expectedAnswer++
				}
				if (testNum>3) {
					wireValues["x"+String(bitAmount-1).padStart(2,"0")] = 1
					wireValues["y"+String(bitAmount-1).padStart(2,"0")] = 1
					expectedAnswer++
				}
				expectedAnswer *= 2 ** bitAmount
				let actualAnswer = this.evaluate({
					wireValues:wireValues,
					gates:structuredClone(gates)
				})
				if (actualAnswer!==expectedAnswer) {
					return bitAmount
				}
			}
		}
		return 45
	},
	swapGates:function(gates){
		let workingBits = this.findNumberOfWorkingBits(gates,0)
		let generations = this.wireGenerations(gates)
		let map = this.inputMap(gates)
		// create a list that has all the relevant wires in generation order (e.g. if the )
		let numberedGenerations = {}
		wireLoop: for (let wire of Object.keys(generations)) {
			if ("xy".includes(wire.substring(0,1))) { // these cannot be swapped as they are not the output of anything
				continue
			}
			let genNum = generations[wire]
			if (numberedGenerations[genNum]===undefined) {
				numberedGenerations[genNum] = []
			}
			numberedGenerations[genNum].push(wire)
		}
		let priorityForSwaps = []
		for (let genNum=workingBits;genNum<45;genNum++) {
			for (let wire of numberedGenerations[genNum]) {
				// let's store the gate numbers which output each wire because this is what we'll be accessing anyway
				priorityForSwaps.push(map[wire].isOutput[0])
			}
		}
		for (let gate1Pos=1;gate1Pos<priorityForSwaps.length;gate1Pos++) {
			let gate1Num = priorityForSwaps[gate1Pos]
			for (let gate2Pos=0;gate2Pos<gate1Pos;gate2Pos++) {
				let gate2Num = priorityForSwaps[gate2Pos]
				let gateClone = structuredClone(gates)
				// swap the wires, and check how many bits work. If at least 2 more bits now work, presume that this swap is correct and return it.
				let temp = gateClone[gate1Num].output
				gateClone[gate1Num].output = gateClone[gate2Num].output
				gateClone[gate2Num].output = temp
				let newWorkingBits = this.findNumberOfWorkingBits(gateClone,workingBits)
				if (newWorkingBits>workingBits+1) {
					return {
						newGates:gateClone,
						swappedGates:[gateClone[gate1Num].output,gateClone[gate2Num].output]
					}
				}
			}
		}
	},
	part2:function(input=AoC2024_24.processInput()) {
		let gates = input.gates
		let out = []
		for (let swapNum=0;swapNum<4;swapNum++) {
			let swapped = this.swapGates(gates)
			gates = swapped.newGates
			out.push(...swapped.swappedGates)
		}
		return out.sort().join(",")
	}
}