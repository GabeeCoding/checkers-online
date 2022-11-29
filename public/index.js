//functions for all pages
//trying to make most features work from every page
//mostly everything in the sidebar

function signOut(){
    removeCookie("session")
    removeCookie("checkersUsername")
    removeCookie("matchmaking")
    window.location = "login.html"
}