const AoC2024_17 = {
	processInput:function(input=document.body.innerText) {
		let lines = input.split("\n")
		return {
			regA:BigInt(lines[0].substring(12)),
			regB:BigInt(lines[1].substring(12)),
			regC:BigInt(lines[2].substring(12)),
			program:lines[4].substring(9).split(",")
		}
	},
	runProgram:function(input) {
		let out = []
		let instructionPointer = 0
		programLoop: while (instructionPointer+2<=input.program.length) {
			let opNum = input.program[instructionPointer]
			let literal = BigInt(input.program[instructionPointer+1])
			let combo = (literal===4n)?input.regA:(literal===5n)?input.regB:(literal===6n)?input.regC:literal
			if (opNum==="0") {
				input.regA = input.regA / 2n ** combo
			} else if (opNum==="1") {
				input.regB = input.regB ^ literal
			} else if (opNum==="2") {
				input.regB = combo % 8n
			} else if (opNum==="3") {
				if (input.regA !== 0n) {
					instructionPointer = Number(literal)
					continue programLoop // so instruction pointer does not increment by 2
				}
			} else if (opNum==="4") {
				input.regB = input.regB ^ input.regC
			} else if (opNum==="5") {
				out.push(Number(combo % 8n))
			} else if (opNum==="6") {
				input.regB = input.regA / 2n ** combo
			} else if (opNum==="7") {
				input.regC = input.regA / 2n ** combo
			}
			instructionPointer += 2
		}
		return out
	},
	part1:function(input=this.processInput()) {
		return this.runProgram(input).join(",")
	},
	/*
	for part 2, we can use the fact that for a 16-character program (as all possible inputs are),
	a 16-character output requires a 16-character octal representation of the initial value of A,
	and all initial values of A with the same first `n` octal digits will result in outputs with
	the same `n` final digits.
	Hence, we find all possible first digits which produce an output which ends with the 16th digit of the program.
	Then, for each of these digits, we find all possible second digits which produce an output which ends with the 15th and 16th digit of the program.
	And so on.
	*/
	part2Result:function(regA,input){
		input.regA = regA
		return this.runProgram(input).join(",")
	},
	part2FindPossibleValues:function(knownDigits,input) { // given that programs starting with `knownDigits` can quine, check whether the program can still quine if you add each of the digits 0~7 to the start.
		if (knownDigits.length===16) {
			return (this.part2Result(BigInt(parseInt(knownDigits,8)),input)===input.program.join(","))?[knownDigits]:[]
		}
		let out = []
		for (let i=0;i<8;i++) {
			let regA = BigInt(parseInt((knownDigits+String(i)).padEnd(16,"0"),8))
			let programOutput = this.part2Result(regA,input)
			if (programOutput.substring(2*(16-knownDigits.length))===input.program.slice(16-knownDigits.length).join(",")) {
				out.push(...this.part2FindPossibleValues(knownDigits+String(i),input))
			}
		}
		return out
	},
	part2:function(input=this.processInput()) {
		let possiblePrograms = this.part2FindPossibleValues("",input)
		return parseInt(possiblePrograms[0],8)
	}
}