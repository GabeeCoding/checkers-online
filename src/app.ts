import express from "express";

const app = express();

app.use(express.static("public"));

let lastGameId = 0

type Player = {
	username: string,
	key: string,
}

type Game = {
    player1: Player,
	player2: Player
	gameId: number
}

const games: Game[] = []
const Players: Player[] = []

function createGame(player1: Player, player2: Player): Game {
	games.push({
		player1: player1,
		player2: player2,
		gameId: lastGameId + 1
	});
	lastGameId += 1
	return games[games.length - 1]
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})