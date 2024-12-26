const AoC2024_22 = {
	processInput:function(input=document.body.innerText){
		return input.split("\n").filter(x=>x!=="").map(x=>BigInt(x))
	},
	nextSecret:function(x) {
		x = (x ^ (x * 64n)) % 16777216n
		x = (x ^ (x / 32n)) % 16777216n
		x = (x ^ (x * 2048n)) % 16777216n
		return x
	},
	part1:function(input=this.processInput()) {
		let out = 0n
		for (let inputPos=0;inputPos<input.length;inputPos++) {
			let currentSecret = input[inputPos]
			for (let i=0;i<2000;i++) {
				currentSecret = this.nextSecret(currentSecret)
			}
			out += currentSecret
		}
		return Number(out)
	},
	priceList:function(input){
		let out = []
		for (let buyerNum=0;buyerNum<input.length;buyerNum++) {
			let currentSecret = input[buyerNum]
			out.push([currentSecret%10n])
			for (let i=0;i<2000;i++) {
				let lastSecret = currentSecret
				currentSecret = this.nextSecret(currentSecret)
				out[buyerNum].push(currentSecret % 10n)
			}
		}
		return out
	},
	/*
	instead of taking a change sequence and calculating the bananas for it, it is quicker to calculate the amount of bananas for all change sequences
	which occur at once. Consider every set of 5 prices in the list, check if an amount of bananas for the resulting change sequence exists,
	and if not, write the 5th entry in the list.
	*/
	calculateBananasFromOneBuyer:function(priceList) {
		let out = {}
		for (let pos=4;pos<priceList.length;pos++) {
			let changeSequenceID = Number(priceList[pos-3]-priceList[pos-4])+","+Number(priceList[pos-2]-priceList[pos-3])+","+Number(priceList[pos-1]-priceList[pos-2])+","+Number(priceList[pos]-priceList[pos-1])
			if (out[changeSequenceID]===undefined) {
				out[changeSequenceID] = priceList[pos]
			}
		}
		return out
	},
	/*
	this time, instead of taking the price list for one buyer, we take all price lists.
	*/
	calculateTotalBananas:function(priceList) {
		let out = {}
		for (let buyer of priceList) {
			let nextPrices = this.calculateBananasFromOneBuyer(buyer)
			for (let sequence of Object.keys(nextPrices)) {
				if (out[sequence]===undefined) {
					out[sequence] = 0n
				}
				out[sequence] += nextPrices[sequence]
			}
		}
		return out
	},
	part2:function(input=this.processInput()) {
		let possiblePrices = Object.values(this.calculateTotalBananas(this.priceList(input)))
		let out = 0n
		for (let price of possiblePrices) {
			if (price>out) {
				out = price
			}
		}
		return Number(out)
	}
}