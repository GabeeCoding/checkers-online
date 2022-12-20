//Draws an 8x8 grid 
let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
let bw,bh,n,centerBoxLength
/*
// Box width
let bw = canvas.width;
// Box height
let bh = canvas.height;

let n = (canvas.width / 8) - 0.1
let centerBoxLength = n/2
*/

function recalc(){
	// Box width
	bw = canvas.width;
	// Box height
	bh = canvas.height;

	n = (bw / 8) - 0.1
	centerBoxLength = n/2
}

recalc()

function drawBoard() {
	//vertical lines
	recalc()
	context.strokeStyle = "#000000"
	context.fillStyle = "#000000"
	context.beginPath();
	for (let x = 0; x <= bw; x += n) {
		context.moveTo(0.5 + x, 0);
		context.lineTo(0.5 + x + 0, bh);
	}

	//horizontal lines
	for (let x = 0; x <= bh; x += n) {
		context.moveTo(0, 0.5 + x);
		context.lineTo(bw, 0.5 + x);
	}
	context.strokeStyle = "black";
	context.stroke();
	paintBoard()
	context.strokeStyle = "#000000"
    context.fillStyle = "#000000"
}

function isEven(n) {
	return n % 2 === 0
}

function checkForBlackBox(x, y){
	let xEven = isEven(x);
	let yEven = isEven(y)
	if(xEven) {
		if(yEven){
			return false
		} else {
			return true
		}
	} else {
		if(yEven) {
			return true
		} else {
			return false
		}
	}
}

const paintBox = (color, xc,yc) => {
	context.fillStyle = color || "black"
	context.fillRect((n*xc), (n*yc), n, n)
	context.fillStyle = "black"
}

const paintBoard = () => {
	/*
	let last = "black"
	for(let y = 0; y < 9; y++){
		for(let x = 0; x < 9; x++){
			if(last === "white"){
				last = "black"
				//last box was white
				//paint it
				paintBox("black", x, y)
			} else {
				last = "white"
			}
		}
	}
	*/
	for(let y = 0; y < 9; y++){
		for(let x = 0; x < 9; x++){
			if(checkForBlackBox(x,y)){
				paintBox("black", x, y)
			}
		}
	}
}

const drawCircle = (x, y, radius, fill, stroke, strokeWidth) => {
	context.beginPath()
	context.arc(x, y, radius, 0, Math.PI * 2, false)
	if (fill) {
		context.fillStyle = fill
		context.fill()
	}
	if (stroke) {
		context.lineWidth = strokeWidth
		context.strokeStyle = stroke
		context.stroke()
	}
	context.lineWidth = 1
}

const coords = (nx, ny) => {
	//If we want to get the length of box 1,1
	//We do the centerboxlength*1
	//If we want the 2,2 box
	//We do centerBoxLength*3
	//If we want the 3,3 box
	//We do centerBoxLength*5
	
	//If we want the 5,5 box
	//We do centerBoxLength*
	nx -= 1
	ny -= 1
	return {x: centerBoxLength+(n*nx), y: centerBoxLength+(n*ny)}
}

const clear = () => {
	context.clearRect(0,0,bw,bh)
	//context.reset()
}

const createChecker = (team, xc, yc) => {
	console.log(xc,yc)
	let {x,y} = coords(xc,yc)
	let diameter = n - 16
	let fill, stroke
	if(team === "red"){
		fill = "rgb(255, 30, 0)"
		stroke = "rgb(161, 19, 0)"
	} else {
		if(team === "blue"){
			fill = "rgb(20, 74, 252)"
			stroke = "rgb(14, 50, 165)"
		}
	}
	drawCircle(x, y, diameter/2, fill, stroke, 5)
}

function redraw(){
	clear();
	drawBoard()
}

//
drawBoard();