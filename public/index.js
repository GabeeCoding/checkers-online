//functions for all pages
//trying to make most features work from every page
//mostly everything in the sidebar

let path = window.location.origin
if(path.endsWith("/")){
	path = path.slice(0, -1)
}

function signOut(){
	removeCookie("session")
	removeCookie("checkersUsername")
	removeCookie("matchmaking")
   //send req to server!!!!!!
   fetch(`${path}/logout`, {method: "POST"}).then(resp => {
		if(resp.ok){
			goToPage("login.html")
		} else {
			alert("Got response, failed to sign out")
		}
   }).catch((err) => {
		alert(`Failed to logout: ${err}`)
   })
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
		url = split.join("/") + page
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

let ls = window.localStorage

function set(k, v){
	ls.setItem(k, v)
	return v
}

function get(k){
	return ls.getItem(k) || null
}

function setMatchmakingStatus(x){
	let mms = document.querySelector("#mmstat")
	mms.innerHTML = x
}

function matchmake(){
	//send req to server
	
	fetch(`${path}/startMatchmaking`, {method: "POST"}).then(resp => {
		if(resp.ok){
			//ok
			//matchmaking cookie set
			//check if found game
		} else {
			//not ok, got response, likely user error
			
		}
	}).catch((err) => {
		setMatchmakingStatus("Can't connect to server")
	})
}