const AoC2024_12 = {
	processInput:function(input=document.body.innerText){
		return input.split("\n").filter(x=>x!=="").map(x=>x.split(""))
	},
	calculateRegions:function(input) {
		let maxRows = input.length
		let maxCols = input[0].length
		let regions = {} // for every coordinate, store its region as a number
		let regionCounter = 0
		function determineRegion(row,col,regionNum) { // if `regionNum` is a number then this cell is part of a known region; if undefined then this is a new region.
			if (regions[row+","+col]!==undefined) {
				return // this cell's region is already known
			}
			if (regionNum===undefined) {
				regionNum = regionCounter
				regionCounter++
			}
			regions[row+","+col] = regionNum
			let adjacentAddresses = [[row-1,col],[row,col+1],[row+1,col],[row,col-1]]
			adjacentLoop: for (let address of adjacentAddresses) {
				if ((address[0]<0)||(address[0]>=maxRows)||(address[1]<0)||(address[1]>=maxCols)) { // do not go out of bounds
					continue adjacentLoop
				}
				if (input[row][col]===input[address[0]][address[1]]) { // check if the adjacent cell is part of an adjacent region. We will recursively find all the cells in each region like this,
					determineRegion(address[0],address[1],regionNum)
				}
			}
		}
		for (let row=0;row<maxRows;row++) {
			for (let col=0;col<maxCols;col++) {
				determineRegion(row,col)
			}
		}
		return regions
	},
	calculateAreas:function(cells) {
		let out = {}
		for (let cell of Object.keys(cells)) {
			let region = cells[cell]
			if (out[region]===undefined) {
				out[region] = 0
			}
			out[region]++
		}
		return out
	},
	calculatePerimeters:function(input=this.processInput()) {
		let maxRows = input.length
		let maxCols = input[0].length
		let regions = this.calculateRegions(input)
		let out = {}
		for (let row=0;row<maxRows;row++) {
			for (let col=0;col<maxCols;col++) {
				let regionNum = regions[row+","+col]
				if (out[regionNum]===undefined) {
					out[regionNum]=0
				}
				let adjacentAddresses = [[row-1,col],[row,col+1],[row+1,col],[row,col-1]]
				for (let address of adjacentAddresses) {
					if ((address[0]<0)||(address[0]>=maxRows)||(address[1]<0)||(address[1]>=maxCols)||(regionNum!==regions[address[0]+","+address[1]])) { // if the adjacent cell is not in the same region, or if it doesn't exist, part of perimeter
						out[regionNum]++
					}
				}
			}
		}
		return out
	},
	part1:function(input=this.processInput()) {
		let regions = this.calculateRegions(input)
		let areas = this.calculateAreas(regions)
		let perimeters = this.calculatePerimeters(input)
		let out = 0
		for (let region of Object.keys(perimeters)) {
			out += perimeters[region]*areas[region]
		}
		return out
	},
	removeSide:function(edgeIDs,startingCoords,deltaCoords) {
		let diffMult = 1
		while (true) {
			let next = (startingCoords[0]+deltaCoords[0]*diffMult)+","+(startingCoords[1]+deltaCoords[1]*diffMult) // the coordinate to remove
			let check1 = (startingCoords[0]+deltaCoords[0]*(diffMult-0.5)+deltaCoords[1]*0.5)+","+(startingCoords[1]+deltaCoords[1]*(diffMult-0.5)+deltaCoords[0]*0.5) // avoid + shape bug by checking for a third edge bordering this one and the previous
			let check2 = (startingCoords[0]+deltaCoords[0]*(diffMult-0.5)-deltaCoords[1]*0.5)+","+(startingCoords[1]+deltaCoords[1]*(diffMult-0.5)-deltaCoords[0]*0.5) // avoid + shape bug by checking for a third edge bordering this one and the previous
			if (edgeIDs.includes(next)&&(!edgeIDs.includes(check1))&&(!edgeIDs.includes(check2))) {
				edgeIDs.splice(edgeIDs.indexOf(next),1)
				diffMult++
			} else {
				return edgeIDs
			}
		}
	},
	calculateSides:function(input=this.processInput()) {
		let maxRows = input.length
		let maxCols = input[0].length
		let regions = this.calculateRegions(input)
		let allEdges = {}
		for (let row=0;row<maxRows;row++) {
			for (let col=0;col<maxCols;col++) {
				let regionNum = regions[row+","+col]
				let adjacentAddresses = [[row-1,col],[row,col+1],[row+1,col],[row,col-1]]
				for (let address of adjacentAddresses) {
					if ((address[0]<0)||(address[0]>=maxRows)||(address[1]<0)||(address[1]>=maxCols)||(regionNum!==regions[address[0]+","+address[1]])) { // if the adjacent cell is not in the same region, or if it doesn't exist, part of perimeter
						if (allEdges[regionNum]===undefined) {
							allEdges[regionNum] = []
						}
						allEdges[regionNum].push(((row+address[0])/2)+","+((col+address[1])/2)) // edge ID is the midpoint of the centres of the two cells
					}
				}
			}
		}
		let out = {}
		for (let regionNum of Object.keys(allEdges)) {
			while (allEdges[regionNum].length>0) {
				// pick an edge from the array of all edges of the region, remove this edge and all edges along the line segment, add 1. Repeat until none left.
				let startingEdge = allEdges[regionNum][0]
				let startingCoords = startingEdge.split(",").map(x=>Number(x))
				if ((startingCoords[0]%1)!==0) { // consider horizontal and vertical edges separately
					allEdges[regionNum] = this.removeSide(this.removeSide(allEdges[regionNum],startingCoords,[0,1]),startingCoords,[0,-1])
				} else {
					allEdges[regionNum] = this.removeSide(this.removeSide(allEdges[regionNum],startingCoords,[1,0]),startingCoords,[-1,0])
				}
				if (out[regionNum]===undefined) {
					out[regionNum] = 0
				}
				out[regionNum]++
				allEdges[regionNum].splice(allEdges[regionNum].indexOf(startingEdge),1)
			}
		}
		return out
	},
	part2:function(input=this.processInput()) {
		let regions = this.calculateRegions(input)
		let areas = this.calculateAreas(regions)
		let sides = this.calculateSides(input)
		let out = 0
		for (let region of Object.keys(sides)) {
			out += sides[region]*areas[region]
		}
		return out
	}
}