const AoC2024_08 = {
	processInput:function(input=document.body.innerText) {
		return input.split("\n").filter(x=>x!=="").map(x=>x.split(""))
	},
	findAntennae:function(input) {
		let antennae = {}
		let maxRows = input.length
		let maxCols = input[0].length
		for (let row=0;row<maxRows;row++) {
			for (let col=0;col<maxCols;col++) {
				let char = input[row][col]
				if (char!==".") {
					if (antennae[char]===undefined) {
						antennae[char] = []
					}
					antennae[char].push([row,col])
				}
			}
		}
		return antennae
	},
	part1:function(input=this.processInput()) {
		let antennae = this.findAntennae(input)
		let maxRows = input.length
		let maxCols = input[0].length
		let uniqueAntinodes = {}
		for (let char of Object.keys(antennae)) {
			for (let i=1;i<antennae[char].length;i++) {
				for (let j=0;j<i;j++) {
					let iCoord1 = antennae[char][i][0]
					let iCoord2 = antennae[char][i][1]
					let jCoord1 = antennae[char][j][0]
					let jCoord2 = antennae[char][j][1]
					let antinodes = [[iCoord1*2-jCoord1,iCoord2*2-jCoord2],[jCoord1*2-iCoord1,jCoord2*2-iCoord2]]
					for (let antinode of antinodes) {
						if ((antinode[0]>=0)&&(antinode[0]<maxRows)&&(antinode[1]>=0)&&(antinode[1]<maxCols)) {
							uniqueAntinodes[antinode[0]+","+antinode[1]] = true
						}
					}
				}
			}
		}
		return Object.keys(uniqueAntinodes).length
	},
	part2:function(input=this.processInput()) {
		let antennae = this.findAntennae(input)
		let maxRows = input.length
		let maxCols = input[0].length
		let uniqueAntinodes = {}
		for (let char of Object.keys(antennae)) {
			for (let i=1;i<antennae[char].length;i++) {
				for (let j=0;j<i;j++) {
					let iCoord1 = antennae[char][i][0]
					let iCoord2 = antennae[char][i][1]
					let jCoord1 = antennae[char][j][0]
					let jCoord2 = antennae[char][j][1]
					let ijDistMult = 1
					ijLoop:while (true) {
						let nextNode = [jCoord1+(iCoord1-jCoord1)*ijDistMult,jCoord2+(iCoord2-jCoord2)*ijDistMult]
						if ((nextNode[0]>=0)&&(nextNode[0]<maxRows)&&(nextNode[1]>=0)&&(nextNode[1]<maxCols)) {
							uniqueAntinodes[nextNode[0]+","+nextNode[1]] = true
							ijDistMult++
						} else {
							break ijLoop
						}
					}
					let jiDistMult = 1
					jiLoop:while (true) {
						let nextNode = [iCoord1+(jCoord1-iCoord1)*jiDistMult,iCoord2+(jCoord2-iCoord2)*jiDistMult]
						if ((nextNode[0]>=0)&&(nextNode[0]<maxRows)&&(nextNode[1]>=0)&&(nextNode[1]<maxCols)) {
							uniqueAntinodes[nextNode[0]+","+nextNode[1]] = true
							jiDistMult++
						} else {
							break jiLoop
						}
					}
				}
			}
		}
		return Object.keys(uniqueAntinodes).length
	}
}