const unameinput = document.getElementById("username")
const statusSpan = document.getElementById("status")

function setStatus(status){
    statusSpan.innerHTML = status
}

const endpoint = window.location.origin

function startGame(){
    //button pressed
    //check for username input
    let username = unameinput.value
    if(username === ""){
        alert("Enter a username");
        return
    }
    let oldKey = getCookie("key")
    if(oldKey){
        console.warn("Already have a key!!!!")
    }
    fetch(`${endpoint}/newPlayer`, {
        headers: {
            username: username
        }
    }).then((resp) => {
        //check for response success
        setStatus("Parsing json response...")
        resp.json((json) => {
            setStatus("Parsed")
            if(json.userError === true){
                additional = json.message
            }
            setStatus("An error occured while trying to play game")
        })
        if(!resp.ok){
            //not ok
            let additional = ""
            
        } else {
            //check for game, if game exists, move to game.html page
            
            setStatus("Success")
        }
    }).catch(err => {
        setStatus("Can't connect to server, view console for more details")
        if(err){
            console.log(err)
        } else {
            console.log("Failed to connect to server endpoint, no additional information")
        }
    })
}