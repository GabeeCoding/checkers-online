import express from "express";

const app = express();

app.use(express.static("public"));

let lastGameId = 0

type Player = {
	username: string,
	key: string,
}

type Game = {
    blue: Player,
	red: Player
	gameId: number,
	board: Board
}

type Checker = {
	Team: string,
	King: boolean
}

type Box = {
	x: number,
	y: number,
	checker: Checker | null
}

type Board = Box[]

const games: Game[] = []
const Players: Player[] = []

function isEven(n: number): boolean {
	return n % 2 == 0
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

function createBoard(){
	let board: Board = []
	for (let x = 1; x < 9; x++) {
		//runs 8 times
		//another for loop for the y axis
		for(let y = 1; y < 9; y++){
			board.push({
				x: x,
				y: y,
				checker: null
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
		board: createBoard()
	});
	lastGameId += 1
	return games[games.length - 1]
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})