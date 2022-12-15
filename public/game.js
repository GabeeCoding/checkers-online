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

canvas.addEventListener("mousemove", (e) => {
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
	setStatus("hover", `${boxCoords.x}, ${boxCoords.y}`)
})

//get game cache interval

let cache = null
function processGameData(json){
	cache = json
	let game = json.game
	let yourTeam = json.yourTeam
	setStatus("team", yourTeam)
	setStatus("yourturn", game.turn === yourTeam ? "Yes" : "No");
	setStatus("oppname", yourTeam === "blue" ? game.redName : game.blueName);
	setStatus("oppconn", yourTeam === "blue" ? (game.redConnected ? "Yes" : "No") : (game.blueConnected ? "Yes" : "No"));
	let yourCheckers,oppCheckers = null;
	game.board.forEach(box => {
		let team = box.checker.team
		if(team === yourTeam){
			yourCheckers += 1
		} else if(team !== yourTeam){
			oppCheckers += 1
		}
	})
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
		fetch(`${path}/gamedata`).then(resp => {
			resp.json().then(json => {
				//json is game data
				setStatus("cs", "Successfully got cache")
				processGameData(json)
				
			}).catch(err => {
				setStatus("cs", "Failed to parse JSON", true);
				console.log(err)
			})
		}).catch(err => {
			setStatus("cs", "Failed to get game data, can't connect to server", true)
		}).finally(() => { busy = false });
	}
	
}

if(gameId){
	//if game id exists
	//start interval
	console.log("Started interval")
	setInterval(interval, 1337);
}