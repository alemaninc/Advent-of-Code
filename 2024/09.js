const AoC2024_09 = {
	processInput:function(input=document.body.innerText) {
		let out = []
		for (let pos=0;pos<input.length;pos++) { // use -1 to represent empty
			let id = (pos%2===0)?(pos/2):-1
			for (let i=0;i<Number(input[pos]);i++) {
				out.push(id)
			}
		}
		return out
	},
	part1:function(input=this.processInput()) {
		/*
		Using indexOf methods leads to O(n^2) time complexity which is too much here.
		Instead we will use two addresses (starting at the beginning and end of the input).
		Increment 'left' until we find an empty item, and decrement 'right' until we find a non-empty item, then swap them.
		*/
		let left = 0
		let right = input.length-1
		sortLoop: while (true) {
			while (input[left]!==-1) {
				left++
			}
			while (input[right]===-1) {
				right--
			}
			if (left>=right) {
				break sortLoop
			}
			let temp = input[left]
			input[left] = input[right]
			input[right] = temp
		}
		let out = 0
		for (let pos=0;pos<input.length;pos++) {
			if (input[pos]!==-1) {
				out += pos*input[pos]
			}
		}
		return out
	},
	part2:function(input=this.processInput()) {
		/*
		left1 and right1 are function-scoped, left2 and right2 are loop-scoped.
			left1 is the position of the earliest empty address.
			right1 is the position of the latest file.
			left2 is used to find an empty space of the appropriate size.
			right2 is used to determine the file size.
		*/
		let left1 = 0
		let right1 = input.length-1
		let maximumFileSize = 9 // time saver
		sortLoop: while (true) {
			while (input[left1]!==-1) { // find earliest empty
				left1++
			}
			while (input[right1]===-1) { // find latest non-empty
				right1--
			}
			if (left1>=right1) {
				break sortLoop
			}
			// find where the current file ends
			let right2 = right1
			while (input[right1]===input[right2]) {
				right2--
			}
			let fileSize = right1-right2
			right1 = right2 // in case this file does not get moved, do not check it over and over
			if (fileSize>maximumFileSize) {
				continue sortLoop
			}
			let left2 = left1
			fileLoop: while (true) { // find an empty space that's large enough
				if (left2>right2) { // no empty space exists for a file of this size
					maximumFileSize--
					continue sortLoop
				}
				if (input[left2]===-1) { // check whether the next [fileSize] spaces are empty
					for (let i=0;i<fileSize;i++) {
						if (input[left2+i]!==-1) {
							left2 += i+1
							continue fileLoop
						}
					}
					// left2 = start of empty space, right2 = start of file - 1.
					for (let i=0;i<fileSize;i++) {
						let left3 = left2+i
						let right3 = right2+i+1
						let temp = input[left3]
						input[left3] = input[right3]
						input[right3] = temp
					}
					continue sortLoop
				} else {
					left2++
				}
			}
		}
		return input.map((x,i)=>(x===-1)?0:(x*i)).reduce((x,y)=>x+y)
	}
}