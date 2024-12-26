const AoC2024_06 = {
	processInput:function(input=document.body.innerText) {
		return input.split("\n").filter(x=>x!=="").map(x=>x.split(""))
	},
	part1:function(input=this.processInput()) {
		let currentPosition = undefined
		firstPositionLoop: for (let coord1=0;coord1<130;coord1++) {
			for (let coord2=0;coord2<130;coord2++) {
				if (input[coord1][coord2]==="^") {
					currentPosition = [coord1,coord2];
					break firstPositionLoop
				}
			}
		}
		let currentDirection = 0 // 0 = north = coord1--; 1 = east = coord2++; 2 = south = coord1++; 3 = west = coord2--
		let checked = [] // store every coordinate's property of whether it has been visited or not
		for (let i=0;i<130;i++) {
			checked.push([])
			for (let j=0;j<130;j++) {
				checked[i].push(false)
			}
		}
		guardLoop: while (true) {
			checked[currentPosition[0]][currentPosition[1]] = true
			let newCoord1 = currentPosition[0]+[-1,0,1,0][currentDirection]
			let newCoord2 = currentPosition[1]+[0,1,0,-1][currentDirection]
			if ((newCoord1<0)||(newCoord1>129)||(newCoord2<0)||(newCoord2>129)) {
				break guardLoop
			} else if (input[newCoord1][newCoord2]==="#") {
				currentDirection = (currentDirection+1)%4
			} else {
				currentPosition = [newCoord1,newCoord2]
			}
		}
		let out = 0
		for (let i of checked) {
			for (let j of i) {
				if (j) {
					out++
				}
			}
		}
		return out
	},
	part2:function(input=this.processInput()) {
		let out = 0
		let initialPosition = undefined
		firstPositionLoop: for (let coord1=0;coord1<130;coord1++) {
			for (let coord2=0;coord2<130;coord2++) {
				if (input[coord1][coord2]==="^") {
					initialPosition = [coord1,coord2];
					break firstPositionLoop
				}
			}
		}
		for (let obstructionCoord1=0;obstructionCoord1<130;obstructionCoord1++) {
			obstructionLoop: for (let obstructionCoord2=0;obstructionCoord2<130;obstructionCoord2++) { // check all possible arrangements of obstruction
				if (input[obstructionCoord1][obstructionCoord2]!==".") {
					continue obstructionLoop // if there is already an obstruction or guard here no point in testing
				}
				let modifiedInput = structuredClone(input)
				modifiedInput[obstructionCoord1][obstructionCoord2] = "#"
				let currentPosition = structuredClone(initialPosition)
				let currentDirection = 0
				let checked = []
				for (let i=0;i<130;i++) {
					checked.push([])
					for (let j=0;j<130;j++) {
						checked[i].push([false,false,false,false])
					}
				}
				guardLoop: while (true) {
					if (checked[currentPosition[0]][currentPosition[1]][currentDirection]) { // the guard has been in this cell facing this direction before
						out++
						continue obstructionLoop
					}
					checked[currentPosition[0]][currentPosition[1]][currentDirection] = true
					let newCoord1 = currentPosition[0]+[-1,0,1,0][currentDirection]
					let newCoord2 = currentPosition[1]+[0,1,0,-1][currentDirection]
					if ((newCoord1<0)||(newCoord1>129)||(newCoord2<0)||(newCoord2>129)) {
						continue obstructionLoop // guard has left map without looping
					} else if (modifiedInput[newCoord1][newCoord2]==="#") {
						currentDirection = (currentDirection+1)%4
					} else {
						currentPosition = [newCoord1,newCoord2]
					}
				}
			}
		}
		return out
	}
}