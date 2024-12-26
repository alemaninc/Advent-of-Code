const AoC2024_15 = {
	processInputPart1:function(input=document.body.innerText){
		let out = {
			map:[],
			moves:"",
			maxRows:input.split("\n").indexOf(""),
			maxCols:input.split("\n")[0].length
		}
		let passedMidpoint = false
		for (let line of input.split("\n")) {
			if (line==="") {
				passedMidpoint = true
			} else if (passedMidpoint) {
				out.moves += line
			} else {
				out.map.push(line.split(""))
			}
		}
		return out
	},
	part1:function(input=this.processInputPart1()) {
		let robotPosition = undefined
		positionLoop: for (let row=0;row<input.maxRows;row++) {
			for (let col=0;col<input.maxCols;col++) {
				if (input.map[row][col]==="@") {
					robotPosition = [col,row]
					break positionLoop
				}
			}
		}
		moveLoop: for (let move of input.moves.split("")) {
			let direction = ({
				"^":[0,-1],
				"v":[0,1],
				"<":[-1,0],
				">":[1,0]
			})[move]
			let objectsToMove = 1 // 1 = robot only, 2 = robot and 1 box, 3 = robot and 2 boxes, etc.
			numberToMoveLoop: while (true) {
				let nextObjectPos = [robotPosition[0]+direction[0]*objectsToMove,robotPosition[1]+direction[1]*objectsToMove]
				let nextObject = input.map[nextObjectPos[1]][nextObjectPos[0]]
				if (nextObject==="O") { // if there is now another box in the way, we will attempt to move it
					objectsToMove++
				} else if (nextObject===".") { // if there is now empty space in the way, move everything forward
					for (let offset=objectsToMove-1;offset>=0;offset--) { // swap the object `x` cells in front with the one `x+1` cells in front, then the object `x-1` cells in front with the one `x` cells in front and so on. The end result is everything moving 1 cell forward.
						let swapPos1 = [robotPosition[0]+direction[0]*offset,robotPosition[1]+direction[1]*offset]
						let swapPos2 = [robotPosition[0]+direction[0]*(offset+1),robotPosition[1]+direction[1]*(offset+1)]
						let temp = input.map[swapPos1[1]][swapPos1[0]]
						input.map[swapPos1[1]][swapPos1[0]] = input.map[swapPos2[1]][swapPos2[0]]
						input.map[swapPos2[1]][swapPos2[0]] = temp
					}
					robotPosition = [robotPosition[0]+direction[0],robotPosition[1]+direction[1]]
					continue moveLoop
				} else { // otherwise there is a wall in the way, so do nothing
					continue moveLoop
				}
			}
		}
		let out = 0
		for (let row=0;row<input.maxRows;row++) {
			for (let col=0;col<input.maxCols;col++) {
				if (input.map[row][col]==="O") {
					out += row*100+col
				}
			}
		}
		return out
	},
	processInputPart2:function(input=document.body.innerText){
		let out = {
			map:[],
			moves:"",
			maxRows:input.split("\n").indexOf(""),
			maxCols:input.split("\n")[0].length*2
		}
		let passedMidpoint = false
		for (let line of input.split("\n")) {
			if (line==="") {
				passedMidpoint = true
			} else if (passedMidpoint) {
				out.moves += line
			} else {
				out.map.push([])
				for (let char of line.split("")) {
					if (char==="#") {out.map[out.map.length-1].push("#","#")}
					if (char==="O") {out.map[out.map.length-1].push("[","]")}
					if (char===".") {out.map[out.map.length-1].push(".",".")}
					if (char==="@") {out.map[out.map.length-1].push("@",".")}
				}
			}
		}
		return out
	},
	part2GetMultipushBoxes:function(map,force,yVector) { // `map` is the map; `force` is the position of the object attempting to push (either the robot or a previous box); `yVector` is 1 or -1. We get the left part of each box.		let out = []
		let out = []
		if (map[force[1]+yVector][force[0]]==="[") {
			out.push([force[0],force[1]+yVector])
			out.push(...this.part2GetMultipushBoxes(map,[force[0],force[1]+yVector],yVector))
			out.push(...this.part2GetMultipushBoxes(map,[force[0]+1,force[1]+yVector],yVector))
		} else if (map[force[1]+yVector][force[0]]==="]") {
			out.push([force[0]-1,force[1]+yVector])
			out.push(...this.part2GetMultipushBoxes(map,[force[0]-1,force[1]+yVector],yVector))
			out.push(...this.part2GetMultipushBoxes(map,[force[0],force[1]+yVector],yVector))
		}
		return Array.from(new Set(out.map(x=>JSON.stringify(x)))).map(x=>JSON.parse(x)) // removes duplicates
	},
	part2:function(input=this.processInputPart2()) {
		let robotPosition = undefined
		positionLoop: for (let row=0;row<input.maxRows;row++) {
			for (let col=0;col<input.maxCols;col++) {
				if (input.map[row][col]==="@") {
					robotPosition = [col,row]
					break positionLoop
				}
			}
		}
		moveLoop: for (let move of input.moves.split("")) {
			let direction = ({
				"^":[0,-1],
				"v":[0,1],
				"<":[-1,0],
				">":[1,0]
			})[move]
			if (direction[0]===0) { // vertical motion
				let boxesToMove = this.part2GetMultipushBoxes(input.map,robotPosition,direction[1])
				// for every box which is to be moved, check if there is a wall in the way; if there is, no move can take place
				wallSearchLoop: for (let box of boxesToMove) {
					if (input.map[box[1]+direction[1]][box[0]]==="#") {continue moveLoop}
					if (input.map[box[1]+direction[1]][box[0]+1]==="#") {continue moveLoop}
				}
				if (input.map[robotPosition[1]+direction[1]][robotPosition[0]]==="#") {continue moveLoop}
				// order the boxes in descending order of how far away they are vertically from the robot; we need to move them in this order
				boxesToMove.sort((a,b)=>(b[1]-a[1])*direction[1])
				for (let box of boxesToMove) {
					let temp1 = input.map[box[1]][box[0]]
					input.map[box[1]][box[0]] = input.map[box[1]+direction[1]][box[0]]
					input.map[box[1]+direction[1]][box[0]] = temp1
					let temp2 = input.map[box[1]][box[0]+1]
					input.map[box[1]][box[0]+1] = input.map[box[1]+direction[1]][box[0]+1]
					input.map[box[1]+direction[1]][box[0]+1] = temp2
				}
				// lastly, move the robot
				let temp = input.map[robotPosition[1]][robotPosition[0]]
				input.map[robotPosition[1]][robotPosition[0]] = input.map[robotPosition[1]+direction[1]][robotPosition[0]]
				input.map[robotPosition[1]+direction[1]][robotPosition[0]] = temp
				robotPosition = [robotPosition[0],robotPosition[1]+direction[1]]
			} else { // horizontal motion
				let objectsToMove = 1 // 1 = robot only, 2 = robot and 1 box, 3 = robot and 2 boxes, etc.
				numberToMoveLoop: while (true) {
					let nextObjectPos = [robotPosition[0]+direction[0]*(objectsToMove*2-1),robotPosition[1]] // `objectsToMove*2-1` returns what is immediately in front of the current group of objects to move; `objectsToMove*2` would be off by 1
					let nextObject = input.map[nextObjectPos[1]][nextObjectPos[0]]
					if (["[","]"].includes(nextObject)) { // if there is now another box in the way, we will attempt to move it
						objectsToMove++
					} else if (nextObject===".") { // if there is now empty space in the way, move everything forward
						for (let offset=objectsToMove*2-2;offset>=0;offset--) {
							let swapPos1 = [robotPosition[0]+direction[0]*offset,robotPosition[1]]
							let swapPos2 = [robotPosition[0]+direction[0]*(offset+1),robotPosition[1]]
							let temp = input.map[swapPos1[1]][swapPos1[0]]
							input.map[swapPos1[1]][swapPos1[0]] = input.map[swapPos2[1]][swapPos2[0]]
							input.map[swapPos2[1]][swapPos2[0]] = temp
						}
						robotPosition = [robotPosition[0]+direction[0],robotPosition[1]]
						continue moveLoop
					} else { // otherwise there is a wall in the way, so do nothing
						continue moveLoop
					}
				}
			}
		}
		let out = 0
		for (let row=0;row<input.maxRows;row++) {
			for (let col=0;col<input.maxCols;col++) {
				if (input.map[row][col]==="[") {
					out += row*100+col
				}
			}
		}
		return out
	}
}