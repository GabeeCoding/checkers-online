const unameinput = document.getElementById("username")

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
        alert("Already have a key! resetting...")
        deleteCookie("key")
    }
    fetch(`${endpoint}/newPlayer`, {
        headers: {
            username: username
        }
    }).then((resp) => {
        //check for response success
        
    })
}