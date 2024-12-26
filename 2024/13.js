const AoC2024_13 = {
	processInput:function(input=document.body.innerText) {
		let out = []
		let next = {}
		let lines = input.split("\n")
		for (let lineNum=0;lineNum<lines.length;lineNum++) {
			let values = lines[lineNum].replace(/[^0123456789,]/g,"").split(",").map(x=>BigInt(x))
			if (lineNum%4===0) {
				next.Ax = values[0]
				next.Ay = values[1]
			} else if (lineNum%4===1) {
				next.Bx = values[0]
				next.By = values[1]
			} else if (lineNum%4===2) {
				next.Px = values[0]
				next.Py = values[1]
				out.push(next)
				next = {}
			}
		}
		return out
	},
	determineTokensNeeded:function(Ax,Ay,Bx,By,Px,Py) { // A = a-vector, B = b-vector, P = prize
		/*
		first, find the point of intersection of the line generated by A presses from the origin, and the line generated by B presses from P.
		initial equations:
		                         y/Aᵧ = x/Aₓ          (1)
		                  (y - Pᵧ)/Bᵧ = (x - Pₓ)/Bₓ   (2)
		
		(1) =>                      y = Aᵧx/Aₓ        (3)
		(2) (3) => ((Aᵧx/Aₓ) - Pᵧ)/Bᵧ = (x - Pₓ)/Bₓ   (4)
		
		=>          Bₓ((Aᵧx/Aₓ) - Pᵧ) = Bᵧ(x - Pₓ)
		=>            BₓAᵧx/Aₓ - BₓPᵧ = Bᵧx - BᵧPₓ
		=>             BₓAᵧx/Aₓ - Bᵧx = BₓPᵧ - BᵧPₓ
		=>            x(BₓAᵧ/Aₓ - Bᵧ) = BₓPᵧ - BᵧPₓ
		=>                          x = (BₓPᵧ - BᵧPₓ) / (BₓAᵧ/Aₓ - Bᵧ)
		                              = (AₓBₓPᵧ - AₓBᵧPₓ) / (AᵧBₓ - AₓBᵧ) // final rearrangement needed to avoid precision issues
		*/
		if ((Ax*Bx*Py - Ax*By*Px) % (Ay*Bx - Ax*By) !== 0n) { // intersection point has fractional x-coordinate => impossible. We need this check as BigInt rounds down when dividing
			return 0
		}
		let Ix = (Ax*Bx*Py - Ax*By*Px) / (Ay*Bx - Ax*By) // I = intersection point
		if (Ix % Ax !== 0n) { // fractional A presses => impossible
			return 0
		}
		let APresses = Ix/Ax // change in X from O to I / change in X per A press
		if ((Px - Ix) % Bx !== 0n) { // fractional B presses => impossible
			return 0
		}
		let BPresses = (Px-Ix)/Bx // change in X from I to P / change in X per B press
		if ((APresses>=0)&&(BPresses>=0)) { // if fractional or negative presses are needed the prize is impossible
			return APresses*3n+BPresses
		} else {
			return 0
		}
	},
	part1:function(input=this.processInput()) {
		let out = 0
		for (let prize of input) {
			out += this.determineTokensNeeded(prize.Ax,prize.Ay,prize.Bx,prize.By,prize.Px,prize.Py)
		}
		return Number(out)
	},
	part2:function(input=this.processInput()) {
		let out = 0
		for (let prize of input) {
			out += this.determineTokensNeeded(prize.Ax,prize.Ay,prize.Bx,prize.By,prize.Px+10000000000000n,prize.Py+10000000000000n)
		}
		return Number(out)
	}
}