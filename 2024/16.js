const AoC2024_16 = {
	/*
	we will store the map as a weighted graph representing a 70*70*2 grid.
	Both z-planes denote the actual map but z=0 denotes a reindeer facing east or west whereas z=1 denotes a reindeer facing north or south.
	From every node the reindeer can move to any adjacent node (in the correct direction) on the z-plane with cost 1, or move to the other z-plane with cost 1000.
	Switching z-plane has cost 0 only at tile E, as the reindeer may be either facing a y or an x direction.
	*/
	processInput:function(input=document.body.innerText) {
		let lines = input.split("\n").filter(x=>x!=="")
		let maxRows = (lines.length-1)/2
		let maxCols = (lines[0].length-1)/2
		let vertices = {}
		for (let row=0;row<maxRows;row++) {
			for (let col=0;col<maxCols;col++) {
				for (let z=0;z<2;z++) {
					let id = col+","+row+","+z
					let next = {}
					next[col+","+row+","+(1-z)] = ((row===0)&&(col===maxCols-1))?0:1000
					if (z===0) { // is facing horizontally
						if ((col!==0)&&(lines[row*2+1][col*2]!=="#")) { // move west
							next[(col-1)+","+row+","+z] = 2
						}
						if ((col!==maxCols-1)&&(lines[row*2+1][col*2+2]!=="#")) { // move east
							next[(col+1)+","+row+","+z] = 2
						}
					} else { // is facing vertically
						if ((row!==0)&&(lines[row*2][col*2+1]!=="#")) { // move north
							next[col+","+(row-1)+","+z] = 2
						}
						if ((row!==maxRows-1)&&(lines[row*2+2][col*2+1]!=="#")) { // move south
							next[col+","+(row+1)+","+z] = 2
						}
					}
					vertices[id] = next
				}
			}
		}
		return {vertices,maxRows,maxCols}
	},
	distances:function(input) {
		let distances = {}
		let currentVertex = "0,"+(input.maxRows-1)+",0"
		distances[currentVertex] = 0
		let unvisitedToConsider = ["0,0"] // these are the unvisited vertices which do not have infinite distance
		while (unvisitedToConsider.length>0) { // Dijkstra's algorithm
			// remove current node from the list of unvisited
			unvisitedToConsider.splice(unvisitedToConsider.indexOf(currentVertex),1)
			// update the distances from the current vertex, and add the neighbors to the list of unvisited to consider
			for (let neighbor of Object.keys(input.vertices[currentVertex])) {
				if (distances[neighbor]===undefined) {
					unvisitedToConsider.push(neighbor)
				}
				distances[neighbor] = Math.min(distances[neighbor]??Infinity, distances[currentVertex] + input.vertices[currentVertex][neighbor])
			}
			unvisitedToConsider = Array.from(new Set(unvisitedToConsider)) // remove duplicates
			// identify next vertex (min-priority)
			let minimumDistance = Infinity
			let minimumDistanceNode
			for (let unvisited of unvisitedToConsider) {
				if (distances[unvisited] < minimumDistance) {
					minimumDistance = distances[unvisited]
					minimumDistanceNode = unvisited
				}
			}
			currentVertex = minimumDistanceNode
		}
		return distances
	},
	part1:function(input=this.processInput()) {
		return this.distances(input)[(input.maxCols-1)+",0,0"]
	},
	part2:function(input=this.processInput()) {
		let distances = this.distances(input)
		let outVertices = [(input.maxCols-1)+",0,0"]
		let toConsider = Object.keys(input.vertices[(input.maxCols-1)+",0,0"]) // list of vertices adjacent to any vertex known to be part of the best path. Consider all these vertices and determine if they are part of a best path
		while (toConsider.length>0) {
			let next = toConsider[0]
			let knownNeighbor // we compare against this neighbor that is known to be part of a shortest path
			for (let neighbor of Object.keys(input.vertices[next])) {
				if (outVertices.includes(neighbor)) {
					knownNeighbor = neighbor
				}
			}
			if (distances[next]+input.vertices[next][knownNeighbor]===distances[knownNeighbor]) { // if this is part of a shortest path
				outVertices.push(next)
				for (let neighbor of Object.keys(input.vertices[next])) {
					toConsider.push(neighbor)
				}
			}
			toConsider.splice(0,1)
			toConsider = Array.from(new Set(toConsider)).filter(x=>!outVertices.includes(x))
		}
		let out2D = {} // we will store this as an object as it needs to be quickly accessed
		while (outVertices.length>0) {
			let next = outVertices[0].split(",").slice(0,2).join(",")
			out2D[next] = true
			outVertices = outVertices.filter(x=>x.substring(0,next.length+1)!==(next+","))
		}
		let out = 0
		for (let halfRow=0;halfRow<input.maxRows*2-1;halfRow++) { // we must consider both the vertices of the graph, and the midpoints between them which were simplified out
			for (let halfCol=0;halfCol<input.maxCols*2-1;halfCol++) {
				if ((halfRow%2===0)&&(halfCol%2===0)) { // this cell is a vertex of the graph
					let id = (halfCol/2)+","+(halfRow/2)
					if (out2D[id]) { // if this is part of a shortest path
						out++
					}
				} else if ((halfRow%2===0)&&(halfCol%2===1)) { // this cell is horizontally between two vertices of the graph
					let ids = [((halfCol-1)/2)+","+(halfRow/2),((halfCol+1)/2)+","+(halfRow/2)]
					if (out2D[ids[0]]&&out2D[ids[1]]&&Object.keys(input.vertices[ids[0]+",0"]).includes(ids[1]+",0")) { // if both adjacent vertices are part of the shortest path, and are connected
						out++
					}
				} else if ((halfRow%2===1)&&(halfCol%2===0)) { // this cell is vertically between two vertices of the graph
					let ids = [(halfCol/2)+","+((halfRow-1)/2),(halfCol/2)+","+((halfRow+1)/2)]
					if (out2D[ids[0]]&&out2D[ids[1]]&&Object.keys(input.vertices[ids[0]+",1"]).includes(ids[1]+",1")) { // if both adjacent vertices are part of the shortest path, and are connected
						out++
					}
				} // otherwise this cell is between four vertices of the graph and is certainly a wall.
			}
		}
		return out
	}
}