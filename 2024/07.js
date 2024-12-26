const AoC2024_07 = {
	processInput:function(input=document.body.innerText){
		return input.split("\n").filter(x=>x!=="").map(function(x){
			let sides = x.split(": ")
			return {
				operands:sides[1].split(" ").map(x=>Number(x)),
				answer:Number(sides[0])
			}
		})
	},
	part1:function(input=this.processInput()){
		let out = 0
		equationLoop: for (let equation of input) {
			for (let opPerm=0;opPerm<2**equation.operands.length;opPerm++) {
				let opString = opPerm.toString(2).padStart(equation.operands.length,"0") // 0 = addition, 1 = multiplication; generate all possible strings
				let solution = equation.operands[0]
				for (let opPair=0;opPair<equation.operands.length-1;opPair++) {
					let operator = opString[opPair]
					if (operator==="0") {
						solution = solution + equation.operands[opPair+1]
					} else {
						solution = solution * equation.operands[opPair+1]
					}
				}
				if (solution===equation.answer) {
					out += equation.answer
					continue equationLoop
				}
			}
		}
		return out
	},
	part2:function(input=this.processInput()){
		let out = 0
		equationLoop: for (let equation of input) {
			for (let opPerm=0;opPerm<3**equation.operands.length;opPerm++) {
				let opString = opPerm.toString(3).padStart(equation.operands.length,"0") // 0 = addition, 1 = multiplication, 2 = concatenation
				let solution = equation.operands[0]
				for (let opPair=0;opPair<equation.operands.length-1;opPair++) {
					let operator = opString[opPair]
					if (operator==="0") {
						solution = solution + equation.operands[opPair+1]
					} else if (operator==="1") {
						solution = solution * equation.operands[opPair+1]
					} else if (operator==="2") {
						solution = Number(String(solution) + String(equation.operands[opPair+1]))
					}
				}
				if (solution===equation.answer) {
					out += equation.answer
					continue equationLoop
				}
			}
		}
		return out
	}
}