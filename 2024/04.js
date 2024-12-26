const AoC2024_04 = {
	processInput:function(input=document.body.innerText){
		return input.split("\n").filter(x=>x!=="").map(x=>x.split(""))
	},
	part1:function(input=this.processInput()) {
		let out = 0
		for (let direction=0;direction<8;direction++) { // 0 = north, 1 = northeast, 2 = east, 3 = southeast, etc. - for each direction, iterate through all cells and go 3 in the direction given
			let dx = [0,1,1,1,0,-1,-1,-1][direction]
			let dy = [1,1,0,-1,-1,-1,0,1][direction]
			for (let startRow=0;startRow<140;startRow++) {
				for (let startCol=0;startCol<140;startCol++) {
					let word = ""
					for (let letter=0;letter<4;letter++) {
						word += input[startRow+dx*letter]?.[startCol+dy*letter]??"#"
					}
					if (word==="XMAS") {
						out++
					}
				}
			}
		}
		return out
	},
	part2:function(input=this.processInput()) {
		let out = 0
		for (let row=1;row<139;row++) { // iterate through all the cells that can be the A of an X-MAS
			for (let col=1;col<139;col++) {
				if (input[row][col]==="A") { // if an A is found, check the two diagonals that can be a 'MAS' and check if the two endpoints are M and S in any order
					let diagonal1 = [input[row-1][col-1],input[row+1][col+1]]
					let diagonal2 = [input[row-1][col+1],input[row+1][col-1]]
					if (diagonal1.includes("M")&&diagonal1.includes("S")&&diagonal2.includes("M")&&diagonal2.includes("S")) {
						out++
					}
				}
			}
		}
		return out
	}
}