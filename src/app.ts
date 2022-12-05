import express, { response } from "express";
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
    blue: Player,
	red: Player
	gameId: number,
	board: Board,
	turn: Team
}

type Team = "blue" | "red"

type Checker = {
	Team: Team,
	King: boolean
}

type Box = {
	x: number,
	y: number,
	checker: Checker | null
}

type Board = Box[]

const games: Game[] = []
const sessions: Player[] = []

function getCheckerAtCoords(game: Game, x: number, y: number): Box | undefined {
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
						Team: "blue",
						King: false
					}
				}
			}
			if(between(y, 6, 8)){
				if(checkForBlackBox(x,y)){
					//place red checker
					checker = {
						Team: "red",
						King: false,
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
		blue: player1,
		red: player2,
		gameId: lastGameId + 1,
		board: createBoard(),
		turn: "red"
	});
	player1.inQueue = false
	player2.inQueue = false
	lastGameId += 1
	return games[games.length - 1]
}

app.post("/logout", (req, resp, next) => {
	//remove cookies
	resp.clearCookie("session")
	resp.clearCookie("checkersUsername")
	resp.clearCookie("matchmaking")
	resp.status(200).json({message: "Logged out"}).end();
})

app.post("/matchmake", (req, resp, next) => {
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
		if(session.inQueue){
			//if the other player is in queue
			//
			otherPlayer = session
			console.log("Found player", session.username)
		}
	})

})

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
