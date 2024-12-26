/*
There is no part 2 for this one.
Everything below `part1` is the beginning of a solution, but nothing genuinely useful.
*/
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
		while (input.gates.length>0) {
			wireLoop: for (let gateNum=input.gates.length-1;gateNum>=0;gateNum--) {
				let gate = input.gates[gateNum]
				let operandValues = gate.operands.map(x=>input.wireValues[x])
				if ((operandValues[0]===undefined)||(operandValues[1]===undefined)) {
					continue wireLoop
				}
				let nextValue
				if (gate.operator==="OR") {
					nextValue = (operandValues[0]+operandValues[1]===0)?0:1
				} else if (gate.operator==="AND") {
					nextValue = operandValues[0]*operandValues[1]
				} else if (gate.operator==="XOR") {
					nextValue = (operandValues[0]===operandValues[1])?0:1
				}
				input.wireValues[gate.output] = nextValue
				input.gates.splice(gateNum,1)
			}
		}
		let out = 0
		for (let zValue=0;zValue<46;zValue++) {
			if (input.wireValues["z"+String(zValue).padStart(2,"0")]) {
				out += 2 ** zValue
			}
		}
		return out
	},
	part1:function(input=this.processInput()) {
		return this.evaluate(input)
	},
	/*
	A 45 bit adder follows the general structure:
		x00 XOR y00 => z00

		x00 AND y00 => a01   "2^1 from initial 2^0's"
		x01 XOR y01 => b01   "2^1 from initial 2^1's"
		a01 XOR b01 => z01

		x01 AND y01 => a02   "2^2 from initial 2^1's"
		x02 XOR y02 => b02   "2^2 from initial 2^2's"
		a01 AND b01 => c02   "2^2 from carried 2^1's"
		b02 OR  c02 => d02
		b02 XOR d02 => z02

		...

		x43 AND y43 => a44
		x44 XOR y44 => b44
		a43 AND b43 => c44
		b44 OR  c44 => d44
		b44 XOR d44 => z44

		a44 OR  b44 => z45
	We can solve this using a top-down method
	*/
	getGateWithTarget:function(wire,gates){
		for (let gate of gates) {
			if (gate.output===wire) {
				return gate
			}
		}
	},
	// all the wires which affect the value of a given wire.
	wireDependencies:function(wire,input){
		let out = []
		let wiresToCheck = [wire]
		while (wiresToCheck.length>0) {
			let nextWire = wiresToCheck[0]
			if (!"xy".includes(nextWire[0])) {
				wiresToCheck.push(...this.getGateWithTarget(nextWire,input.gates).operands)
			}
			out.push(nextWire)
			wiresToCheck.splice(0,1)
		}
		return Array.from(new Set(out))
	},
	// returns all the wires which affect bit `zValue` but not `zValue-1`.
	wiresStartingAtBit:function(zValue,input){
		if (zValue===0) {
			return this.wireDependencies("z00",input)
		}
		let wiresToOutput = {}
		for (let wire of this.wireDependencies("z"+String(zValue).padStart(2,"0"),input)) {
			wiresToOutput[wire] = true
		}
		for (let wire of this.wireDependencies("z"+String(zValue-1).padStart(2,"0"),input)) {
			wiresToOutput[wire] = false
		}
		let out = []
		for (let wire of Object.keys(wiresToOutput)) {
			if (wiresToOutput[wire]) {
				out.push(wire)
			}
		}
		return out
	},
	// 
	isDamaged:function(zValue,input){

	},

	visualiseInput:function(input=this.processInput()){
		let out = []
		for (let gate of input.gates) {
			out.push(gate.operands[0]+">"+gate.output)
			out.push(gate.operands[1]+">"+gate.output)
		}
		return out.join("\n")
	}
}