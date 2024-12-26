const AoC2024_02 = {
	processInput:function(input=document.body.innerText){
		return input.split("\n").filter(x=>x!=="").map(x=>x.split(" ").map(y=>Number(y)))
	},
	part1Validate:function(report){
		let isIncreasing = report[1]>report[0]
		for (let i=0;i<report.length-1;i++) {
			let difference = report[i+1]-report[i]
			if ((difference>=(isIncreasing?4:0))||(difference<=(isIncreasing?0:-4))) {
				return false
			}
		}
		return true
	},
	part1:function(input=this.processInput()){
		let input = this.processInput()
		let out = 0
		for (let i of input) {
			if (this.part1Validate(i)) {
				out++
			}
		}
		return out
	},
	part2Validate:function(report){
		if (this.part1Validate(report)) { // if dampening not needed
			return true
		}
		for (let i=0;i<report.length;i++) { // check all possible dampenings
			let dampenedReport = structuredClone(report)
			dampenedReport.splice(i,1)
			if (this.part1Validate(dampenedReport)) {
				return true
			}
		}
		return false
	},
	part2:function(input=this.processInput()){
		let out = 0
		for (let i of input) {
			if (this.part2Validate(i)) {
				out++
			}
		}
		return out
	}
}