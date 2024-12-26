const AoC2024_10 = {
	processInput:function(input=document.body.innerText){
		return input.split("\n").filter(x=>x!=="").map(x=>x.split("").map(y=>Number(y)))
	},
	// we run this for trailheads. Iteratively find all adjacent height 1 cells, use to find height 2 cells, so on until nines found.
	part1ProcessCell:function(input,row,col) {
		let thisCellHeight = input[row][col]
		if (thisCellHeight===9) { // nine reached
			return {row:row,col:col} // we need these as objects so they are unaffected by `Array.prototype.flat`
		}
		let maxRows = input.length
		let maxCols = input[0].length
		let out = []
		let adjacentAddresses = [[row-1,col],[row,col+1],[row+1,col],[row,col-1]]
		adjacentLoop: for (let address of adjacentAddresses) { // check four adjacent cells
			if ((address[0]<0)||(address[0]>=maxRows)||(address[1]<0)||(address[1]>=maxCols)) { // do not go out of bounds
				continue adjacentLoop
			}
			if (input[address[0]][address[1]]===thisCellHeight+1) { // if adjacent height is 1 higher
				out.push(this.part1ProcessCell(input,address[0],address[1]))
			}
		}
		return out.flat()
	},
	part1:function(input=this.processInput()) {
		let maxRows = input.length
		let maxCols = input[0].length
		let out = 0
		for (let row=0;row<maxRows;row++) {
			trailheadLoop: for (let col=0;col<maxCols;col++) {
				if (input[row][col]!==0) { // only count trailheads
					continue trailheadLoop
				}
				let uniqueNines = []
				let allNines = this.part1ProcessCell(input,row,col)
				for (let nine of allNines) {
					let nineID = nine.row+","+nine.col
					if (!uniqueNines.includes(nineID)) {
						uniqueNines.push(nineID)
					}
				}
				out += uniqueNines.length
			}
		}
		return out
	},
	// same principle as part 1, but now instead of storing ID's we just tally every possible outcome. Even easier~
	part2ProcessCell:function(input,row,col) {
		let thisCellHeight = input[row][col]
		if (thisCellHeight===9) { // nine reached
			return 1
		}
		let maxRows = input.length
		let maxCols = input[0].length
		let out = 0
		let adjacentAddresses = [[row-1,col],[row,col+1],[row+1,col],[row,col-1]]
		adjacentLoop: for (let address of adjacentAddresses) { // check four adjacent cells
			if ((address[0]<0)||(address[0]>=maxRows)||(address[1]<0)||(address[1]>=maxCols)) { // do not go out of bounds
				continue adjacentLoop
			}
			if (input[address[0]][address[1]]===thisCellHeight+1) { // if adjacent height is 1 higher
				out += this.part2ProcessCell(input,address[0],address[1])
			}
		}
		return out
	},
	part2:function(input=this.processInput()) {
		let maxRows = input.length
		let maxCols = input[0].length
		let out = 0
		for (let row=0;row<maxRows;row++) {
			trailheadLoop: for (let col=0;col<maxCols;col++) {
				if (input[row][col]!==0) { // only count trailheads
					continue trailheadLoop
				}
				out += this.part2ProcessCell(input,row,col)
			}
		}
		return out
	},
}