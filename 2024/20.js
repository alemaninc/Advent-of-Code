const AoC2024_20 = {
	processInput:function(input=document.body.innerText){
		let connections = {}
		let lines = input.split("\n").filter(x=>x!=="")
		let size1 = lines.length
		let size2 = lines[0].length
		let startPoint, endPoint
		for (let coord1=0;coord1<size1;coord1++) {
			vertexLoop: for (let coord2=0;coord2<size2;coord2++) {
				connections[coord1+","+coord2] = []
				if (lines[coord1][coord2]==="#") {
					continue vertexLoop
				}
				let adjacentAddresses = [[coord1-1,coord2],[coord1,coord2+1],[coord1+1,coord2],[coord1,coord2-1]].filter(x=>(x[0]!==-1)&&(x[0]!==size1)&&(x[1]!==-1)&&(x[1]!==size2))
				for (let address of adjacentAddresses) {
					if (lines[address[0]][address[1]]!=="#") {
						connections[coord1+","+coord2].push(address[0]+","+address[1])
					}
				}
				if (lines[coord1][coord2]==="S") {
					startPoint = [coord1,coord2]
				} else if (lines[coord1][coord2]==="E") {
					endPoint = [coord1,coord2]
				}
			}
		}
		return {lines,connections,size1,size2,startPoint,endPoint}
	},
	distances:function(input) {
		let out = {}
		out[input.startPoint.join(",")] = 0
		let currentVertex = input.startPoint
		while (true) {
			let adjacentVertices = input.connections[currentVertex]
			let nextVertex
			for (let vertex of adjacentVertices) {
				if (out[vertex]===undefined) {
					nextVertex = vertex
				}
			}
			out[nextVertex] = out[currentVertex] + 1
			currentVertex = nextVertex
			if (input.connections[currentVertex].length===1) { // end of path reached
				return out
			}
		}
	},
	part1CanCheat:function(startPoint,endPoint,inputLines) { // check if `startPoint` and `endPoint` are track and their midpoint is wall
		let startCoords = startPoint.split(",").map(x=>Number(x))
		let endCoords = endPoint.split(",").map(x=>Number(x))
		let midpoint = [(startCoords[0]+endCoords[0])/2,(startCoords[1]+endCoords[1])/2]
		return (inputLines[startCoords[0]][startCoords[1]]===".")&&(inputLines[endCoords[0]][endCoords[1]]===".")&&(inputLines[midpoint[0]][midpoint[1]]==="#")
	},
	part1:function(input=AoC2024_20.processInput()) {
		let out = 0
		let distances = this.distances(input)
		for (let coord1=0;coord1<input.size1;coord1++) {
			for (let coord2=0;coord2<input.size2;coord2++) {
				let currentVertex = coord1+","+coord2
				// to prevent double-counting, we will only check downwards and to the right, not upwards or to the left.
				let adjacentVertices = [[coord1+2,coord2],[coord1,coord2+2]].filter(x=>(x[0]>=0)&&(x[0]<input.size1)&&(x[1]>=0)&&(x[1]<input.size2)).map(x=>x.join(","))
				for (let adjacentVertex of adjacentVertices) {
					if (this.part1CanCheat(currentVertex,adjacentVertex,input.lines)&&(Math.abs(distances[currentVertex]-distances[adjacentVertex])>=102)) { // we use 102 instead of 100 as 2ps is spent cheating
						out++
					}
				}
			}
		}
		return out
	},
	allCheatEndpoints:function(startPoint,size1,size2) {
		let out = []
		/* to prevent double-counting, we will only check adjacent vertices such that their angle relative to the start point is between 0 (inclusive) and 180deg (exclusive), i.e. like:
		XXXXXXXXX
		XXXXXXXXX   X check
		XXXXXXXXX   O start point
		XXXXXXXXX   . do not check
		....OXXXX
		.........
		.........
		.........
		.........
		*/
		for (let coord1=Math.max(0,startPoint[0]-20);coord1<=Math.min(size1-1,startPoint[0]+20);coord1++) {
			for (let coord2=Math.max(0,startPoint[1]-20);coord2<=Math.min(size2-1,startPoint[1]+20);coord2++) {
				if (Math.abs(startPoint[0]-coord1)+Math.abs(startPoint[1]-coord2)<21) {
					out.push([coord1,coord2])
				}
			}
		}
		return out
	},
	part2:function(input=AoC2024_20.processInput()) {
		let out = 0
		let distances = this.distances(input)
		for (let coord1=0;coord1<input.size1;coord1++) {
			for (let coord2=0;coord2<input.size2;coord2++) {
				let currentVertex = coord1+","+coord2
				let adjacentVertices = this.allCheatEndpoints([coord1,coord2],input.size1,input.size2)
				for (let adjacentVertex of adjacentVertices) {
					if ((input.lines[coord1][coord2]!=="#")&&(input.lines[adjacentVertex[0]][adjacentVertex[1]]!=="#")&&(Math.abs(distances[currentVertex]-distances[adjacentVertex.join(",")])>=100+Math.abs(coord1-adjacentVertex[0])+Math.abs(coord2-adjacentVertex[1]))) {
						console.log([coord1,coord2,...adjacentVertex,Math.abs(distances[currentVertex]-distances[adjacentVertex.join(",")]),100+Math.abs(coord1-adjacentVertex[0])+Math.abs(coord2-adjacentVertex[1])])
						out++
					}
				}
			}
		}
		return out/2 // I had to double count this time  D:
	},
}