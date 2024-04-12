

// feed time in hours
// must be smallest to largest
feedTimes = [7, 16]

//timeoutWait = 60000
timeoutWait = 10000;

// Start with -1 (index)
// Next page will be 0
currentPage = -1;

function pageLoad() {
    // preload images
    for (let i=0; i< fishlist.length; i++) {
        thisFish = fishlist[i];
        preloadImage(fishimage[thisFish])
    }
    updateHeader();
	delayNextPage();
	
}

function preloadImage(imUrl) {
    let img = new Image();
    img.src = imUrl;
}

function updateHeader() {
	let feedDue = isFeedDue();
	if (feedDue == true) {
		document.getElementById('feedme').src = "images/food-need.png";
		document.getElementById('feedme').alt = "Feed due";
	}
	else {
	    document.getElementById('feedme').src = "images/food-fed.png";
		document.getElementById('feedme').alt = "Already fed";
	}
}

function delayNextPage() {
	//console.log("Starting Timeout");
	setTimeout (nextPage, timeoutWait);
}

function nextPage() {
    // Update each of the values
    currentPage ++;
    if (currentPage >= fishlist.length) currentPage = 0;
    thisFishName = fishlist[currentPage]
    //console.log ("Loading "+thisFishName+" "+fishtitle[thisFishName]);
    document.getElementById('title').innerHTML = fishtitle[thisFishName];
    document.getElementById('subtitle').innerHTML = fishsubtitle[thisFishName];
    document.getElementById('fishimage').src = fishimage[thisFishName];
    document.getElementById('maintext').innerHTML = fishtext[thisFishName];
    
    updateHeader()
    
    delayNextPage()
}


function switchUrl() {
	console.log("Changing URL")

	var currentPage = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	var currentIndex = pages.indexOf(currentPage);

	var newIndex = 0;	// Default to first page
	if (currentIndex < pages.length-1) {
		newIndex = currentIndex + 1;
	}
		
	location.href = pages[newIndex];
}

function feed() {
	//console.log("Feeding");
	let currentDate = new Date()
	localStorage.setItem("lastfed", currentDate.toISOString());
	updateHeader()
}

function getLastFeed() {
	let lastFed = localStorage.getItem("lastfed");
	//console.log ("Last fed "+lastFed);
	//console.log ("As date "+Date.parse(lastFed));
	return Date.parse(lastFed);
}


function isFeedDue (){
	const currentTime = new Date();
	let lastFeed = getLastFeed();
	
	/* First loop checks today */
	for (let i=feedTimes.length-1; i >= 0; i--) {
		//console.log ("This time is "+feedTimes[i]);
		// Are we later than this time
		if (currentTime.getHours() >= feedTimes[i]) {
			// If yes then have they been fed since
			let feedTime = currentTime;
			feedTime.setHours(feedTimes[i], 0, 0, 0);
			if (lastFeed > feedTime){
			    //console.log ("Fed")
				return false;
			}
			else {
			    //console.log ("Not Fed")
				return true;
			}
		}
	}
	/* If reach here then we are before today's first feed time
	   so compare against yesterday's last feed time */
	let feedTime = currentTime;
	feedTime.setDate(currentTime - 1);
	feedTime.setHours(feedTimes[feedTimes.length-1])
	if (lastFeed > feedTime) {
	    //console.log ("Fed yesterday")
		return false;
	}
	//console.log ("Feed due since yesterday")
	return true;
}

// Removes the local storage entry
function deleteFeed(){
    localStorage.removeItem("lastfed");
}