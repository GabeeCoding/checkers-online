//Draws an 8x8 grid 
let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
// Box width
let bw = canvas.width;
// Box height
let bh = canvas.height;
// Padding
let p = 0;

let n = (canvas.width / 8) - 0.1
let centerBoxLength = n/2

function drawBoard() {
	//vertical lines
	for (let x = 0; x <= bw; x += n) {
		context.moveTo(0.5 + x + p, p);
		context.lineTo(0.5 + x + p, bh + p);
	}

	//horizontal lines
	for (let x = 0; x <= bh; x += n) {
		context.moveTo(p, 0.5 + x + p);
		context.lineTo(bw + p, 0.5 + x + p);
	}
	context.strokeStyle = "black";
	context.stroke();
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
	return {x: centerBoxLength+(n*nx), y: centerBoxLength+(n*nx)}
}

const clear = () => {
	context.clearRect(0,0,1000,1000)
}

//

drawBoard();
{
	let {x,y} = coords(1,1)
	let diameter = n - 10
	drawCircle(x, y, diameter/2, "rgb(255, 30, 0)", "rgb(161, 19, 0)", 5)
}

let canvasElem = document.querySelector("canvas");

canvasElem.addEventListener("mousedown", (e) => {
	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	console.log(x,y)
	for (let i = 1; i < 9; i++) {
		let {startCoords, _} = coords(i, 0)
	}
})