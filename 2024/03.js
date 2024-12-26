const AoC2024_03 = {
	part1:function(input=document.body.innerText){
		let out = 0
		mulCall: while (true) {
			let positionsToSkip = input.indexOf("mul(") // find the next call of "mul", valid or not
			if (positionsToSkip===-1) { // no calls left
				return out
			}
			input = input.substring(positionsToSkip) // remove everything before next "mul"
			let lengthConsidered = 4; // check if the first X characters of the remaining input are a valid "mul" call
			functionLength: while (true) {
				let nextCharacter = input[lengthConsidered]
				if ("0123456789,)".includes(nextCharacter)) { // if false, the next character makes the current call invalid so stop considering it
					if (nextCharacter===")") { // if true we have identified the length of the next call so can evaluate it and add to the output, otherwise add a character
						let currentCall = input.substring(4,lengthConsidered) // first 4 characters are "mul(", last is ")" but off by one error
						let currentArguments = currentCall.split(",")
						if (currentArguments.length!==2) { // if there are not 2 numeric arguments the call is invalid
							input = input.substring(lengthConsidered)
							continue mulCall
						}
						out += Number(currentArguments[0])*Number(currentArguments[1])
						// we must still move on to the next call
						input = input.substring(lengthConsidered)
						continue mulCall
					} else {
						lengthConsidered++
					}
				} else {
					input = input.substring(lengthConsidered)
					continue mulCall
				}
			}
		}
	},
	part2ProcessInput:function(input){ // we will simply remove everything after a don't() but before a do() then pass it into the part 1 code
		let out = ""
		let isDoing = true // change this to false on a don't() and true on a do(); determines whether we add the next section of input to the output
		while (true) {
			let nextToggles = [input.indexOf("do()"),input.indexOf("don't()")] // next do() and next don't()
			if ((nextToggles[0]===-1)&&(nextToggles[1]===-1)) {
				return out
			}
			let nextToggle = nextToggles.filter(x=>x!==-1).reduce((x,y)=>Math.min(x,y))
			if (isDoing) {
				out += input.substring(0,nextToggle)
			}
			input = input.substring(nextToggle)
			if (input.substring(0,4)==="do()") {
				isDoing = true
				input = input.substring(4)
			} else if (input.substring(0,7)==="don't()") {
				isDoing = false
				input = input.substring(7)
			} else {
				return "ERROR"
			}
		}
	},
	part2:function(input=document.body.innerText) {
		return this.part1(this.part2ProcessInput(input))
	}
}