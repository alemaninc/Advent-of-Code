const AoC2024_05 = {
	processInput:function(input=document.body.innerText){
		let text = input.split("\n")
		let midpoint = text.indexOf("") // the line number separating order rules from updates
		return {
			orderRules:text.slice(0,midpoint).map(x=>[Number(x.substring(0,2)),Number(x.substring(3,5))]),
			updates:text.slice(midpoint+1).filter(x=>x!=="").map(x=>x.split(",").map(y=>Number(y)))
		}
	},
	part1:function(input=this.processInput()) {
		let out = 0
		updateLoop: for (let update of input.updates) {
			let dependencies = Object.fromEntries(update.map(x=>[x,[]])) // for every page in the update, create a list of the pages which are also in the update that must be printed before it
			for (let rule of input.orderRules) {
				if ((dependencies[rule[1]]!==undefined)&&update.includes(rule[0])) {
					dependencies[rule[1]].push(rule[0])
				}
			}
			let generations = {} // all generation 0 pages must be printed before all generation 1 pages, which must be printed before all generation 2 pages, etc.
			let unknownGenerations = Object.keys(dependencies) // all page numbers whose generation is yet to be determined
			while (unknownGenerations.length>0) {
				pageLoop: for (let i=unknownGenerations.length-1;i>=0;i--) {
					for (let page of dependencies[unknownGenerations[i]]) { // check every dependent page in case its generation is not yet known
						if (generations[page]===undefined) {continue pageLoop}
					}
					generations[unknownGenerations[i]] = dependencies[unknownGenerations[i]].map(x=>generations[x]).reduce((x,y)=>Math.max(x,y),-1)+1 // generation = highest generation of any dependency + 1
					unknownGenerations.splice(i,1)
				}
			}
			// for every subset of 2 pages in the update, check if the second one has a higher generation than the first one
			for (let i=0;i<update.length-1;i++) {
				if (generations[update[i]]>=generations[update[i+1]]) {
					continue updateLoop
				}
			}
			out += update[(update.length-1)/2]
		}
		return out
	},
	part2:function(input=this.processInput()) {
		let out = 0
		updateLoop: for (let update of input.updates) {
			// exact copy of part 1 code
			let dependencies = Object.fromEntries(update.map(x=>[x,[]]))
			for (let rule of input.orderRules) {
				if ((dependencies[rule[1]]!==undefined)&&update.includes(rule[0])) {
					dependencies[rule[1]].push(rule[0])
				}
			}
			let generations = {}
			let unknownGenerations = Object.keys(dependencies)
			while (unknownGenerations.length>0) {
				pageLoop: for (let i=unknownGenerations.length-1;i>=0;i--) {
					for (let page of dependencies[unknownGenerations[i]]) {
						if (generations[page]===undefined) {continue pageLoop}
					}
					generations[unknownGenerations[i]] = dependencies[unknownGenerations[i]].map(x=>generations[x]).reduce((x,y)=>Math.max(x,y),-1)+1
					unknownGenerations.splice(i,1)
				}
			}
			// end of part 1 copy.
			// now, we continue to the next update if the current one isn't valid:
			let validUpdate = true
			for (let i=0;i<update.length-1;i++) {
				if (generations[update[i]]>=generations[update[i+1]]) {
					validUpdate = false
				}
			}
			if (!validUpdate) {
				update = update.sort((a,b)=>generations[a]-generations[b])
				out += update[(update.length-1)/2]
			}
		}
		return out
	}
}