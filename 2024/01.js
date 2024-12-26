const AoC2024_01 = {
	processInput:function(input=document.body.innerText){
		return input.split("\n").filter(x=>x!=="").map(x=>x.split("   "))
	},
	part1:function(input=this.processInput()){
		let out = 0
		let list1 = input.map(x=>x[0]).sort((a,b)=>a-b)
		let list2 = input.map(x=>x[1]).sort((a,b)=>a-b)
		for (let i=0;i<list1.length;i++) {
			out += Math.abs(list1[i]-list2[i])
		}
		return out
	},
	part2:function(input=this.processInput()){
		let out = 0
		let list1 = input.map(x=>x[0])
		let list2 = input.map(x=>x[1])
		let list2frequency = {}
		for (let i of list2) {
			if (list2frequency[i]===undefined) {
				list2frequency[i]=1
			} else {
				list2frequency[i]++
			}
		}
		for (let i of list1) {
			out += i*(list2frequency[i]??0)
		}
		return out
	}
}