const unameinput = document.getElementById("username")
const statusSpan = document.getElementById("status")

function setStatus(status){
    statusSpan.innerHTML = status
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function deleteCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
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