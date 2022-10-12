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

function createGame(player1: Player, player2: Player): Game {
	games.push({
		blue: player1,
		red: player2,
		gameId: lastGameId + 1,
		board: []
	});
	lastGameId += 1
	return games[games.length - 1]
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})