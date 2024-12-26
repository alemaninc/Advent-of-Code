const AoC2024_25 = {
	processInput:function(input=document.body.innerText){
		let locks = []
		let keys = []
		let schematics = input.split("\n\n").map(x=>x.split("\n"))
		for (let schematic of schematics) {
			let next = [0,0,0,0,0]
			// regardless of whether we are dealing with a lock or key, the height of each pin is the number of #'s in rows 2~6
			for (let pinNum=0;pinNum<5;pinNum++) {
				for (let height=0;height<5;height++) {
					if (schematic[height+1][pinNum]==="#") {
						next[pinNum]++
					}
				}
			}
			// locks always have the first row filled with #'s, keys always have it filled with .'s
			if (schematic[0][0]==="#") {
				locks.push(next)
			} else {
				keys.push(next)
			}
		}
		return {locks,keys}
	},
	part1:function(input=this.processInput()) {
		let out = 0
		for (let lock of input.locks) {
			lockAndKeyLoop: for (let key of input.keys) {
				for (let pinNum=0;pinNum<5;pinNum++) {
					if (lock[pinNum]+key[pinNum]>5) {
						continue lockAndKeyLoop
					}
				}
				out++
			}
		}
		return out
	}
}