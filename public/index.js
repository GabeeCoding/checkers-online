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
	let js = JSON.stringify(v)
	ls.setItem(k, js)
	return js
}

function get(k){
	return JSON.parse(ls.getItem(k)) || null
}

function setMatchmakingStatus(x, err){
	let mms = document.querySelector("#mmstat")
	if(err) {
		mms.innerHTML = `<span style="color: rgb(255, 49, 49); margin: 0; padding: 0;">${x}</span>`
	} else {
		mms.innerHTML = x
	}
}

let int = null
function matchmakeInterval(){
	if(int){
		alert("Already matchmaking")
		return
	}
	int = setInterval(() => {
		//setinterval
		//send req to server
		console.log("Hi")
	}, 5000)
}
function matchmake(){
	//send req to server
	setMatchmakingStatus("Waiting for server...")
	fetch(`${path}/startMatchmaking`, {method: "POST"}).then(resp => {
		if(resp.ok){
			//ok
			//check if found game
			resp.json(json => {
				//it is ok
				//check for game
				if(json.gameReady === true){
					let gid = json.gameId

				} else {
					//matchmaking cookie set
					//start interval
				}
			}).catch(err => {
				setMatchmakingStatus("Failed to parse JSON", true)
			})
		} else {
			//not ok, got response, likely user error
			
		}
	}).catch((err) => {
		console.log(err)
		setMatchmakingStatus("Can't connect to server", true)
	})
}