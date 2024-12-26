const AoC2024_18 = {
	processInput:function(input=document.body.innerText) {
		return input.split("\n").filter(x=>x!=="")
	},
	corruptInput:function(corruptedAmount,size1,size2,input=this.processInput()) {
		let corruptedCells = {}
		for (let coord1=0;coord1<size1;coord1++) {
			for (let coord2=0;coord2<size2;coord2++) {
				corruptedCells[coord1+","+coord2] = false
			}
		}
		for (let byteNum=0;byteNum<corruptedAmount;byteNum++) {
			corruptedCells[input[byteNum]] = true
		}
		let out = {}
		for (let coord1=0;coord1<size1;coord1++) {
			for (let coord2=0;coord2<size2;coord2++) {
				let thisID = coord1+","+coord2
				let next = {}
				let adjacentAddresses = [[coord1-1,coord2],[coord1,coord2+1],[coord1+1,coord2],[coord1,coord2-1]]
				for (let address of adjacentAddresses) {
					if ((address[0]!==-1)&&(address[0]!==size1)&&(address[1]!==-1)&&(address[1]!==size2)) {
						let adjacentID = address[0]+","+address[1]
						next[adjacentID] = !(corruptedCells[thisID]||corruptedCells[adjacentID]) // can go or not
					}
				}
				out[thisID] = next
			}
		}
		return out
	},
	distances:function(input) {
		let distances = {"0,0":0}
		let verticesAtCurrentMaxDistance = ["0,0"]
		while (verticesAtCurrentMaxDistance.length>0) { // dijkstra failed for some reason even though code was same as day 16, so let's do it this way
			let nextVerticesAtCurrentMaxDistance = []
			for (let vertex of verticesAtCurrentMaxDistance) {
				for (let neighbor of Object.keys(input[vertex])) {
					if (input[vertex][neighbor]&&(distances[neighbor]===undefined)) {
						distances[neighbor] = distances[vertex] + 1
						nextVerticesAtCurrentMaxDistance.push(neighbor)
					}
				}
			}
			verticesAtCurrentMaxDistance = Array.from(new Set(nextVerticesAtCurrentMaxDistance))
		}
		return distances["70,70"]
	},
	part1:function(input=this.processInput()) {
		return this.distances(this.corruptInput(1024,71,71,input))
	},
	part2:function(input=this.processInput()) {
		let lower = 1024
		let upper = input.length
		while (upper-lower>1) { // binary search; if distance is undefined, reduce upper bound; if distance is defined, increase lower bound
			let middle = Math.round((lower+upper)/2)
			if (this.distances(this.corruptInput(middle,71,71,input))===undefined) {
				upper = middle - 1
			} else {
				lower = middle + 1
			}
		}
		// lower is the number of bytes that can fall before the exit is cut off; upper is the bit that cuts the exit off, so answer is the coordinate of upper
		return input[upper]
	}
}