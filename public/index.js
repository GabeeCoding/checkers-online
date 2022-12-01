//functions for all pages
//trying to make most features work from every page
//mostly everything in the sidebar

function signOut(){
    /*
    removeCookie("session")
    removeCookie("checkersUsername")
    removeCookie("matchmaking")
    window.location = "login.html"
    */
   //send req to server!!!!!!
}

function getPagePath(thisPage, newPage){
    let origin = window.location.origin
    let pathname = window.location.pathname
    let link = origin + pathname
    let base = link.split(thisPage)
    base.pop()
	return base + newPage
}

if(!window.location.pathname.endsWith(".html")){
    window.location = getPagePath("", "index.html")
}