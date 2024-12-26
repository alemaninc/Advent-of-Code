const AoC2024_23 = {
	processInput:function(input=document.body.innerText) {
		let lines = input.split("\n").filter(x=>x!=="")
		let out = {}
		let connections = []
		for (let line of lines) {
			connections.push([line.substring(0,2),line.substring(3,5)],[line.substring(3,5),line.substring(0,2)])
		}
		for (let connection of connections) {
			if (out[connection[0]]===undefined) {
				out[connection[0]] = []
			}
			out[connection[0]].push(connection[1])
		}
		return out
	},
	part1:function(input=this.processInput()) {
		let out = []
		for (let vertex1 of Object.keys(input).filter(x=>x.substring(0,1)==="t")) {
			for (let vertex2 of input[vertex1]) {
				for (let vertex3 of input[vertex2]) {
					if ((vertex1!==vertex3)&&input[vertex1].includes(vertex2)&&input[vertex2].includes(vertex3)&&input[vertex3].includes(vertex1)) {
						out.push([vertex1,vertex2,vertex3].sort().join(","))
					}
				}
			}
		}
		out = Array.from(new Set(out))
		return out.length
	},
	/*
	check if a size `size` clique exists using the vertex given.
	We do this by finding all size 2 cliques which include it, then using these to find all size 3 cliques, and so on.
	*/
	checkForClique:function(firstVertex,size,input){
		let currentOut = [firstVertex] // all size `currentSize` cliques
		sizeLoop: for (let currentSize=1;currentSize<size;currentSize++) {
			let nextOut = [] // all size `currentSize+1` cliques
			oldCliqueLoop: for (let currentClique of currentOut) {
				let currentCliqueVertices = currentClique.split(",") // for every neighbor of the first vertex, check if each of these vertices is also connected to it.
				newCliqueLoop: for (let nextMember of input[firstVertex]) {
					for (let currentVertex of currentCliqueVertices) {
						if (!input[currentVertex].includes(nextMember)) {
							continue newCliqueLoop
						}
					}
					nextOut.push(structuredClone([...currentCliqueVertices,nextMember]).sort().join())
				}
			}
			currentOut = Array.from(new Set(nextOut))
		}
		return currentOut
	},
	part2:function(input=this.processInput()) {
		for (let vertex of Object.keys(input)) {
			let size13Clique = this.checkForClique(vertex,13,input)
			if (size13Clique.length===1) {
				return size13Clique[0]
			}
		}
	}
}