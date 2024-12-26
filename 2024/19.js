const AoC2024_19 = {
	processInput:function(input=document.body.innerText) {
		lines = input.split("\n")
		return {
			patterns:lines[0].split(", "),
			designs:lines.slice(2).filter(x=>x!=="")
		}
	},
	possibleDesigns:function(patterns,design) {
		// if it is possible to make the first `x` characters of a design, and the next `y` stripes are a pattern, then `x+y` characters are possible.
		let possibleEndpoints = {0:1}
		endpointLoop: for (let len=1;len<=design.length;len++) {
			let nextCombinations = 0
			patternLoop: for (let pattern of patterns) {
				let previousEndpoint = len-pattern.length
				if (previousEndpoint<0) {
					continue patternLoop
				}	
				if (design.substring(previousEndpoint,len)===pattern) {
					nextCombinations += possibleEndpoints[previousEndpoint]
				}
			}
			possibleEndpoints[len] = nextCombinations
		}
		return possibleEndpoints[design.length]
	},
	part1:function(input=this.processInput()) {
		let out = 0
		for (let design of input.designs) {
			out += Math.sign(this.possibleDesigns(input.patterns,design))
		}
		return out
	},
	part2:function(input=this.processInput()) {
		let out = 0
		for (let design of input.designs) {
			out += this.possibleDesigns(input.patterns,design)
		}
		return out
	}
}