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

let og = window.location.origin
let pn = window.location.pathname
let hasHtmlExt = window.location.pathname.endsWith(".html")

function goToPage(page){
	//use fancy url magic
	let url = og + pn
	if(hasHtmlExt){
		//if it has the html extensino
		//split it
		let spl = pn.split("/")
		let doc = spl[spl.length - 1]
		let split = pn.split(doc)
		split.pop()
		return split.join("/") + page
	} else {
		//it doesnt
		if(pn.endsWith("/")){
			//ends with /
			url += page
		} else {
			url = url + "/" + page
		}
	}
	window.location = url
	//return url
}
