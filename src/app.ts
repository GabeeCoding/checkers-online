import express, { Response, response } from "express";
import cookieParser from "cookie-parser";
import { randomUUID } from "crypto";
import * as dotenv from "dotenv"
dotenv.config()
const app = express();
app.use(express.static("public"));
app.use(cookieParser());

let lastGameId = 0

type Player = {
	username: string,
	sessionId: string,
	inQueue: boolean,
}

type Game = {
	blueName: string,
	redName: string,
	blueConnected: boolean,
	redConnected: boolean,
	gameId: number,
	board: Board,
	turn: Team
}

type Team = "blue" | "red"

type Checker = {
	team: Team,
	king: boolean
}

type Box = {
	x: number,
	y: number,
	checker: Checker | null
}

type Board = Box[]

const games: Game[] = []
const sessions: Player[] = []

function getBoxFromCoords(game: Game, x: number, y: number): Box | undefined {
	return game.board.find((box) => box.x === x && box.y === y)
}

function isEven(n: number): boolean {
	return n % 2 === 0
}

function checkForBlackBox(x: number, y: number){
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

function between(n: number, start: number, end: number): boolean {
	if(n >= start){
		if(n <= end){
			return true
		}
	}
	return false
}

function createBoard(){
	let board: Board = []
	for (let x = 1; x < 9; x++) {
		//runs 8 times
		//another for loop for the y axis
		for(let y = 1; y < 9; y++){
			let checker: Checker
			if(between(y, 1, 3)){
				//if y is between 1 and 3
				//place blue checkers
				if(checkForBlackBox(x, y)){
					//place blue checker
					checker = {
						team: "blue",
						king: false
					}
				}
			}
			if(between(y, 6, 8)){
				if(checkForBlackBox(x,y)){
					//place red checker
					checker = {
						team: "red",
						king: false,
					}
				}
			}
			board.push({
				x: x,
				y: y,
				checker: checker! || null
			})
		}
	}

	//add the checkers
	return board
}

function createGame(player1: Player, player2: Player): Game {
	games.push({
		blueName: player1.username,
		redName: player2.username,
		gameId: lastGameId + 1,
		board: createBoard(),
		turn: "red",
		blueConnected: false,
		redConnected: false,
	});
	player1.inQueue = false
	player2.inQueue = false
	lastGameId += 1
	return games[games.length - 1]
}

function getPlayerFromUsername(username: string): Player | undefined {
	return sessions.find(session => session.username === username)
}

function getGameFromUsername(username: string): Game | undefined {
	return games.find(game => game.blueName === username || game.redName === username)
}

function getTeam(Game: Game, PlayerName: string): Team {
	if(Game.blueName === PlayerName){
		return "blue"
	} else if(Game.redName === PlayerName){
		return "red"
	}
	throw new Error(`Can't find team of player ${PlayerName}, game id is ${Game.gameId}`)
}

app.post("/logout", (req, resp) => {
	//remove cookies
	//TODO:REMOVE old player
	resp.clearCookie("session")
	resp.clearCookie("checkersUsername")
	resp.clearCookie("matchmaking")
	resp.status(200).json({message: "Logged out"}).end();
})

app.post(["/startMatchmaking", "/matchmake"], (req, resp) => {
	//start matchmaking
	const sessionId = req.cookies.session
	const name = req.cookies.checkersUsername
	if(!name){
		resp.status(400).json({message: "Username doesn't exist?"}).end()
		return
	}
	if(!sessionId){
		resp.status(400).json({message: "Missing sessionid"}).end()
		return
	}
	//set a matchmaking cookie, set the user to matchmaking, find any other users who are already
	//if there is someone else, set up a game
	//all links seem to be strong from testing
	let thisSession = sessions.find(plr => plr.sessionId === sessionId)
	if(!thisSession){
		resp.status(400).json({message: "Couldn't find session"}).end()
		return
	}
	//check if we are already in a game perhaps
	let game = getGameFromUsername(name)
	if(game){
		//we are in a game
		resp.clearCookie("matchmaking")
		resp.json({gameReady: true, gameId: game.gameId}).end();
		return
	}
	let otherPlayer: Player | null = null
	sessions.forEach(session => {
		if(session.inQueue && session !== thisSession){
			//found
			otherPlayer = session
		}
	})
	if(otherPlayer){
		//if we found another player
		//set up a game
		//how do we set up a game so that it does not include session ids
		//use usernames!!!!!!
		//its so amazing
		//hmm
		//are usernames unique???
		//yeah
		//ok
		//ok
		//alright
		//uhhhh
		//i dont know
		//nvm
		let game = createGame(thisSession, otherPlayer)
		resp.clearCookie("matchmaking")
		resp.json({gameReady: true, gameId: game.gameId}).end();
	} else {
		resp.cookie("matchmaking", true)
		thisSession.inQueue = true
		//ok
		resp.json({gameReady: false}).status(200).end();
	}
})

app.get("/gamedata", (req, resp) => {
	const sessionId = req.cookies.session
	const name = req.cookies.checkersUsername
	let gid = req.headers.gameid
	if(!name){
		resp.status(400).json({message: "Username doesn't exist?"}).end()
		return
	}
	if(!sessionId){
		resp.status(400).json({message: "Missing sessionid"}).end()
		return
	}
	if(!gid){
		resp.status(400).json({message: "Missing game id"}).end();
		return
	}
	//set a matchmaking cookie, set the user to matchmaking, find any other users who are already
	//if there is someone else, set up a game
	//all links seem to be strong from testing
	let thisSession = sessions.find(plr => plr.sessionId === sessionId)
	if(!thisSession){
		resp.status(400).json({message: "Couldn't find session"}).end()
		return
	}
	//check if we are already in a game perhaps
	let game = getGameFromUsername(name)
	if(game){
		if(game.gameId.toString() !== gid){
			resp.status(400).json({message: "Invalid gameId! Go away hackers!!!!!!"}).end();
			return
		}
		//we are in a game
		//return the game thing
		//check our team
		let t = getTeam(game, name);
		if(t === "blue"){
			game.blueConnected = true
		} else if(t === "red"){
			game.redConnected = true
		}
		return resp.json({game: game, yourTeam: t}).end();
	} else {
		return resp.status(404).json({message: "Game not found"}).end();
	}
})

function calculatePossibleMoves(game: Game, PlayerUsername: string, fromBox: Box){
	//calculate the possible moves
	let board = game.board
	//sooooo red team is at the bottom
	//blue team is at the top
	//have the from checker coords
	let isBlue = PlayerUsername === game.blueName
	//current y:
	let currentY = fromBox.y
	//lets say 1
	//so keep adding the y
	//actually....
	/*
	console.log("iterating")
	
	*/
	/*
	//get the checker x and y
	fromBox.x, fromBox.y
	let incDir = (n: number, i: number): number => {
		return isBlue ? n + i : n - i
	}
	//fromy needs to change by 1
	let ny = incDir(fromBox.y, 1);
	//new y
	//new x?
	//there can be multiple x choices
	//two to be exact
	//huh maybe the loops were required
	*/
	let calcMoves = (y: number) => {
		//got the from thingyssss
		//ok this is how we check the moves
		//y is the line we are going to
		//y is newY
		let newXLeft = fromBox.x - 1
		
	}
	if(isBlue){
		//we are blue
		//ascend
		//y: 1-3
		for(let y = currentY + 1; y <= 8; y++){
			console.log(y, "Blue")
		}
	} else {
		console.log("red")
		//we are red
		//at the bottom
		//y: 5-8
		//increment y down
		console.log(currentY)
		for(let y = currentY - 1; y >= 1; y--){
			console.log(y, "Red")
		}
	}
}
calculatePossibleMoves(createGame({inQueue: false, sessionId: "123", username: "red"}, {inQueue: false, sessionId: "123", username: "blue"}), "blue", {checker: {team: "blue", king: false}, x: 2, y: 3})

app.post("/move", (req, resp) => {
	const sessionId = req.cookies.session
	const name = req.cookies.checkersUsername
	let gid = req.headers.gameid
	let fromx = req.headers.cfromx && parseInt((Array.isArray(req.headers.cfromx) ? req.headers.cfromx[0] : req.headers.cfromx))
	let fromy = req.headers.cfromy && parseInt((Array.isArray(req.headers.cfromy) ? req.headers.cfromy[0] : req.headers.cfromy))
	let tox = req.headers.ctox && parseInt((Array.isArray(req.headers.ctox) ? req.headers.ctox[0] : req.headers.ctox));
	let toy = req.headers.ctoy && parseInt((Array.isArray(req.headers.ctoy) ? req.headers.ctoy[0] : req.headers.ctoy))
	if(!name){
		resp.status(400).json({message: "Username doesn't exist?"}).end()
		return
	}
	if(!sessionId){
		resp.status(400).json({message: "Missing sessionid"}).end()
		return
	}
	if(!gid){
		resp.status(400).json({message: "Missing game id"}).end();
		return
	}
	if(!fromx || !fromy || !tox || !toy){
		resp.status(400).json({message: "Failed to parse checker positions"}).end();
		return;
	}
	if([fromx, fromy, tox, toy].some(coord => coord > 8 || coord < 1)){
		return resp.status(400).json({message: "Invalid range of coords"}).end();
	}
	//set a matchmaking cookie, set the user to matchmaking, find any other users who are already
	//if there is someone else, set up a game
	//all links seem to be strong from testing
	let thisSession = sessions.find(plr => plr.sessionId === sessionId)
	if(!thisSession){
		resp.status(400).json({message: "Couldn't find session"}).end()
		return
	}
	let game = getGameFromUsername(name)
	if(game){
		if(game.gameId.toString() !== gid){
			resp.status(400).json({message: "Invalid gameId! Go away hackers!!!!!!"}).end();
			return
		}
		//we are in a game
		//move checker
		let t = getTeam(game, name);
		if(game.turn !== t){
			return resp.status(400).json({message: "It is not your turn yet"}).end();
		}
		//do validation
		//
		let fromChecker = getBoxFromCoords(game, fromx, fromy)
		let toChecker = getBoxFromCoords(game, tox, toy);
		if(!fromChecker){
			return resp.status(400).json({message: "From box doesn't exist"}).end();
		}
		if(!fromChecker.checker){
			return resp.status(400).json({message: `Missing checker at ${fromx}, ${fromy}`}).end();
		}
		if(fromChecker.checker.team !== t){
			return resp.status(400).json({message: "This checker doesn't belong to you"}).end();
		}
		//move it
		let wasKing = fromChecker.checker.king
		fromChecker.checker = null
		console.log(wasKing)
		if(!toChecker){
			return resp.status(400).json({message: "To box doesn't exist"}).end();
		}
		toChecker.checker = {
			king: (toChecker.y === 8 || toChecker.y === 1) ? true : false,
			team: t,
		}
		//flip the turn
		game.turn = game.turn === "blue" ? "red" : "blue"
		return resp.status(200).json({message: "Successfully moved checker"}).end();
	} else {
		return resp.status(404).json({message: "Game not found"}).end();
	}
})

/*
app.post("/matchmake", (req, resp) => {
	//matchmake the user
	const sessionId = req.cookies.session
	const name = req.cookies.checkersUsername
	if(!name){
		resp.status(400).json({message: "Username doesn't exist?"}).end()
		return
	}
	if(!sessionId){
		resp.status(400).json({message: "Missing sessionid"}).end()
		return
	}
	let thisSession = sessions.find(plr => plr.sessionId === sessionId)
	if(!thisSession){
		resp.status(400).json({message: "Couldn't find session"}).end()
		return
	}
	thisSession.inQueue = true
	console.log(sessions.find(s => s.sessionId === sessionId)!.inQueue)
	let otherPlayer: Player
	sessions.forEach((session) => {
		console.log(session === thisSession, "eq")
		if(session.inQueue && session !== thisSession){
			//if the other player is in queue
			//
			otherPlayer = session
			console.log("Found player", session.username)
		}
	})
})
*/
app.post("/newPlayer", (req, resp) => {
	const name = req.cookies.checkersUsername
	console.log("/newPlayer says =>", name, name === "", name == "")
	if(!name){
		resp.status(400).json({message: "Username doesn't exist?"}).end()
		return
	}
	if(sessions.find(session => session.username === name)){
		resp.status(400).json({message: "Failed to register Player, username is taken"}).end();
		return
	}
	let oldKey = req.cookies.session
	if(oldKey){
		//if the old key exists
		//TODO: check if key DOESNT exist in session table, then continue anyway
		if(sessions.find(session => session.sessionId === oldKey)){
			resp.status(400).json({message: "Failed to register new Player, key already exists"}).end()
			return
		}
	}
	//generate a "session" cookie
	let sessionid = randomUUID();
	resp.cookie("session", sessionid);
	sessions.push({
		inQueue: false,
		sessionId: sessionid,
		username: name
	});
	resp.status(200).json({message: "Successfully registered player"}).end();
})
/*
app.get("/newPlayer", (req, resp) => {
	const name = Array.isArray(req.headers.username) ? req.headers.username[0] : req.headers.username
	if(!name){
		resp.status(400).json({message: "Invalid username header"}).end()
		return
	}
	let oldKey = req.cookies.key
	if(oldKey){
		//if the old key exists
		resp.status(400).json({message: "Player already exists"}).end()
		return
	}
	if(Players.find(plr => plr.username.toLowerCase() === name.toLowerCase())){
		resp.status(400).json({message: "Username is already taken", userError: true}).end();
		return
	}
	//generate a key
	//add them to player table
	let key = randomUUID({disableEntropyCache: true});
	Players.push({
		key: key,
		username: name,
		inGame: false,
		inQueue: true
	})
	resp.cookie("key", key, {maxAge: 86400000})

	//matchmake player
	let plr1: Player, plr2: Player
	Players.forEach((plr) => {
		if(plr.inQueue && !plr.inGame){
			//in queue, not in game
			if(plr1 === undefined){
				plr1 = plr
			}
			if(plr2 === undefined){
				plr2 = plr
			}
		}
	});
	if(plr1! !== undefined && plr2! !== undefined) {
		//if both players exist
		//make a new game
		let game = createGame(plr1, plr2)
		resp.json({ready: true, game: game, message: "Game is ready"}).end();
		return
	}
	console.log(games)
	resp.status(200).json({message: "Successfully created player, added to queue"}).end()
})
*/

/*
app.patch("/move", (req, resp) => {
	if(req.headers["content-type"] !== "application/json"){
		resp.status(400).json({message: `Invalid content-type, expected application/json, got ${req.headers["content-type"]}`}).end()
		return
	}
	let atx = req.body.atx
	let aty = req.body.aty
	atx = parseInt(atx)
	aty = parseInt(aty)
	let tox = req.body.tox
	let toy = req.body.toy
	tox = parseInt(tox)
	toy = parseInt(toy);
	let ret: any = false
	{
		[atx, aty, tox, toy].forEach(v => {
			if(isNaN(v)){
				ret = true
			}
		})
	}
	if(ret === true){
		resp.status(400).json({message: "Failed to parse checker position(s)"}).end()
		return
	}
	let k = req.cookies.key
	if(!k){
		resp.status(400).json({message: "No key"}).end()
		return
	}

	let game = findGameFromKey(k)
	if(!game){
		resp.status(400).json({message: "Couldn't find game"}).end();
		return
	}
	//found game
	//move checker
	let box = getCheckerAtCoords(game, atx, aty)
	if(!box){
		resp.status(400).json({message: "Couldn't find box!"}).end();
		return
	}
	if(box.checker === null){
		resp.status(400).json({message: "No checker to move"}).end();
		return
	}

	let boxAtPoint = getCheckerAtCoords(game, tox, toy)
	if(!boxAtPoint){
		resp.status(400).json({message: "No box at coords given!"}).end();
		return
	}
	if(boxAtPoint.checker){
		//you cant do this!!!!
		resp.status(400).json({message: "Illegal move", userError: true}).end();
		return
	}
	//this would be a good time to check for double moves
	//and to remove the checker
	//maybe bundle that with headers
	//for now lets get the basics
	//TODO: check for team when moving for security
	let checkerClone = box.checker
	box.checker = null
	boxAtPoint.checker = checkerClone
	console.log(game.board)
	resp.send(200).json({message: "Success"}).end();
})
*/

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})

