//game script
//both players are in the game page
//thats cool
//or maybe are they?????????
///make a server side variable
//isConnected
//get
//set
//funcs

function gid(id){
    return document.getElementById(id)
}
function setStatus(e, x, err){
    let element = gid(e)
	if(err) {
		element.innerHTML = `<span style="color: rgb(255, 49, 49); margin: 0; padding: 0;">${x}</span>`
	} else {
		element.innerHTML = x
	}
}
//gamestatus
//yourturn: bool
//hover
//oppname: string
//yc: int
//oppc: int

let gameId = get("gameId")

if(gameId === null){
	alert("Game ID not found, returning to home page")
	goToPage("index.html")
}

function getCanvasCoordsFromEvent(e){
	let rect = canvas.getBoundingClientRect();
	let x = e.clientX - rect.left;
	let y = e.clientY - rect.top;
	let boxCoords = {
		x: null,
		y: null
	}
	for (let i = 1; i < 9; i++) {
		let startCoords = coords(i, 0).x + centerBoxLength
		let prevCoords = coords(i - 1, 0).x + centerBoxLength
		if(x >= prevCoords){
			if(x <= startCoords){
				boxCoords.x = i
			}
		}
	}
	for (let i = 1; i < 9; i++) {
		let startCoords = coords(0, i).y + centerBoxLength
		let prevCoords = coords(0, i - 1).y + centerBoxLength
		if(y >= prevCoords){
			if(y <= startCoords){
				boxCoords.y = i
			}
		}
	}
	return boxCoords
}

canvas.addEventListener("mousemove", (e) => {
	let boxCoords = getCanvasCoordsFromEvent(e)
	setStatus("hover", `${boxCoords.x}, ${boxCoords.y}`)
})

let fromClick = false;
let fromClickCoords = {x: 0, y: 0}

canvas.addEventListener("click", (e) => {
	let {x,y} = getCanvasCoordsFromEvent(e);
	let yourTurn = game ? game.turn === "blue" : false
	if(x && y){
		//how to draw background behind a checker?
		//clear that box
		//fill the background
		//fill it with a checker
		//if it was there
		if(cache){
			//if cache exists
			//
			if(!yourTurn){
				//its not your turn
				return;
			}
			let box = cache.game.board.find(box => box.x === x && box.y === y)
			if(!box){
				return;
			}
			let checker = box.checker
			if(fromClick){
				//this is the second click
				if(checker){
					//there is a checker there
					//impossible move
					//fromClick = false;
					//fromClickCoords = {x: 0, y: 0}
					//reset click?
					return;
				} else {
					//no checker there
					//go
					
				}
			} else {
				//this is the first click
				//if there is a checker
				if(checker !== null){
					//a checker exists
					//paint it cyan
					//paintBox("cyan", boxCoords.x-1, boxCoords.y-1)
					//createChecker(checker.team, boxCoords.x, boxCoords.y)
					//yeah
					//that works
					//how do I prevent redrawing on selection?
					//server asks to redraw
					//or
					//only redraw if its not your turn
					//lets not focus on drawing yet
					fromClick = true;
					fromClickCoords = {
						x: x,
						y: y
					}
					console.log("Set fromClick")
				} else {
					//there is no checker here
					return;
				}
			}
			
		}
	}
})

//get game cache interval

let cache = null
//cache.game.board is board
function processGameData(json){
	cache = json
	let game = json.game
	let yourTeam = json.yourTeam
	let yourTurn = game.turn === yourTeam
	setStatus("team", yourTeam)
	setStatus("yourturn", yourTurn ? "Yes" : "No");
	let oppConnected = false
	if(yourTeam === "blue"){
		oppConnected = game.redConnected
	} else if(yourTeam === "red"){
		oppConnected = game.blueConnected
	}
	if(oppConnected){
		setStatus("gamestatus", "Opponent has connected");
	}
	setStatus("oppname", yourTeam === "blue" ? game.redName : game.blueName);
	setStatus("oppconn", yourTeam === "blue" ? (game.redConnected ? "Yes" : "No") : (game.blueConnected ? "Yes" : "No"));
	let yourCheckers = 0;
	let oppCheckers = 0;
	redraw()
	for (let box of game.board) {
		if(!box.checker) continue;
		let team = box.checker.team
		if(team === yourTeam){
			createChecker(team, box.x, box.y)
			yourCheckers += 1
		} else if(team !== yourTeam){
			createChecker(team, box.x, box.y)
			oppCheckers += 1
		}
	}
	setStatus("oppc", oppCheckers)
	setStatus("yc", yourCheckers)
}

let busy = false
function interval(){
	//every x seconds
	//do some stuff
	//send
	if(!busy){
		//debounce
		busy = true
		fetch(`${path}/gamedata`, {headers: {gameid: gameId}}).then(resp => {
			resp.json().then(json => {
				//json is game data
				if(resp.ok){
					setStatus("cs", "Successfully got cache")
					processGameData(json)
				} else {
					setStatus("cs", `Cache request failed: ${resp.status} ${resp.statusText}<br>Message: ${json.message ? json.message : "No message provided"}`, true);
				}
			}).catch(err => {
				setStatus("cs", "Failed to parse JSON", true);
				console.log(err)
			})
		}).catch(err => {
			setStatus("cs", "Failed to get game data, can't connect to server", true)
			console.log(err)
		}).finally(() => { busy = false });
	}
}

if(gameId){
	//if game id exists
	//start interval
	console.log("Started interval")
	setInterval(interval, 1337);
}
