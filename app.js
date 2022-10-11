const express = require("express")

const app = express();

app.use(express.static("public"));

let lastGameId = 0
const games = []
const matchmakingPlayers = [] // waiting players

function createGame(player1, player2){
    games.push({
        player1: player1,
        player2: player2,
        id: lastGameId + 1
    });
    lastGameId += 1
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})