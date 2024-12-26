const AoC2024_11 = {
	processInput:function(input=document.body.innerText) {
		let numbers = input.split(" ").map(x=>Number(x))
		let out = {}
		for (let num of numbers) {
			out[num] = 1
		}
		return out
	},
	processStones:function(input) {
		let out = {}
		function addStone(number,amount) {
			if (out[number]===undefined) {
				out[number] = 0
			}
			out[number] += amount
		}
		for (let stone of Object.entries(input)) {
			if (Number(stone[0])===0) {
				addStone(1,stone[1])
			} else if (stone[0].length%2===0) {
				let midpoint = String(stone[0]).length/2
				addStone(Number(stone[0].substring(0,midpoint)),stone[1])
				addStone(Number(stone[0].substring(midpoint)),stone[1])
			} else {
				addStone(Number(stone[0])*2024,stone[1])
			}
		}
		return out
	},
	iterativeProcess:function(input,iterations) {
		for (let i=0;i<iterations;i++) {
			input = this.processStones(input)
		}
		return input
	},
	countStones:function(input,iterations){
		return Object.values(this.iterativeProcess(input,iterations)).reduce((x,y)=>x+y)
	},
	part1:function(input=this.processInput()) {
		return this.countStones(input,25)
	},
	part2:function(input=this.processInput()) {
		return this.countStones(input,75)
	}
}