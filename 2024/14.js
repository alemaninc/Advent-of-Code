const AoC2024_14 = {
	processInput:function(input=document.body.innerText) {
		let out = []
		let lines = input.split("\n").filter(x=>x!=="")
		for (let line of lines) {
			let splitLine = line.split(" ").map(x=>x.split(",").map(y=>Number(y.replace(/[^-0-9]/g,""))))
			out.push({
				initialPos:splitLine[0],
				velocity:splitLine[1]
			})
		}
		return out
	},
	modulo:function(x,y){ // -8 % 5 is not -3!!
		return x-y*Math.floor(x/y)
	},
	part1:function(input=this.processInput()) {
		let finalPositions = []
		for (let robot of input) {
			finalPositions.push([this.modulo(robot.initialPos[0]+robot.velocity[0]*100,101),this.modulo(robot.initialPos[1]+robot.velocity[1]*100,103)])
		}
		let quadrants = [0,0,0,0] // I/0 = top-right, II/1 = top-left, III/2 = bottom-left, IV/3 = bottom-right
		for (let position of finalPositions) {
			let quadrantNum
			if ((position[0]>50)&&(position[1]<51)) {quadrantNum = 0}
			else if ((position[0]<50)&&(position[1]<51)) {quadrantNum = 1}
			else if ((position[0]<50)&&(position[1]>51)) {quadrantNum = 2}
			else if ((position[0]>50)&&(position[1]>51)) {quadrantNum = 3}
			quadrants[quadrantNum]++
		}
		console.log(finalPositions)
		return quadrants.reduce((x,y)=>x*y)
	},
	part2:function(input=this.processInput()) { // this part 2 cannot be computed, so run this in the console and find the tree yourself.
		for (let iter=0;iter<10403;iter++) { // the pattern is periodic after 10403 seconds
			let visual = []
			for (let row=0;row<103;row++) {
				visual.push([])
				for (let col=0;col<101;col++) {
					visual[row].push(".") // . = empty
				}
			}
			for (let robot of input) {
				visual[robot.initialPos[1]][robot.initialPos[0]] = "#" // # = robot
				robot.initialPos[0] = this.modulo(robot.initialPos[0]+robot.velocity[0],101)
				robot.initialPos[1] = this.modulo(robot.initialPos[1]+robot.velocity[1],103)
			}
			visual = visual.map(x=>x.join("")).join("\n")
			if (visual.includes("###############################")) { // the frame of the tree
				return iter
			}
		}
	}
}