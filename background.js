console.log("in background");
let URL = "https://whatsup-display.herokuapp.com/tv/checkforchange"
// let URL = "http://localhost:5000/tv/checkforchange"
let key = "";
let websiteNumber = 0;
let tvname, tvpassword, timer, siteTimer;

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request["task"] == "start") {
			tvname = request["tvname"];
            tvpassword = request["tvpassword"];
            start();
		}
        if (request["task"] == "stop") {
            console.log("stop")
            finalStop();
        }
	}
);


function start() {
    timer = setInterval(function(){
        makeRequest(tvname, tvpassword);
    }, 5000);
}

function finalStop() {
    chrome.runtime.reload();
}

function stop() {
    key = "";
    websiteNumber = 0;
    clearInterval(timer)
    clearTimeout(siteTimer)
    clearTimeout(siteTimer)
}



function makeRequest(tvname, tvpassword) {
	$.ajax({
        url: URL,
        crossDomain: true,
        dataType: 'json',
        type: "POST",
        data: {
          "key":key.toString(),
          "tvname": tvname.toString(),
          "password": tvpassword.toString()
        },
        success: function(result) {
            let websites = result["data"]
        	if (websites.length < 1) {
                displayAlert("No data or Wrong Credentials")
                stop(); 
        	}
            if (result["isChanged"]) {
                key = result["key"]
                console.log("key: ", key);
                clearTimeout(siteTimer);
                nextWebsite(websites)
            }
        	           
        },
        error: function(textStatus, errorThrown) {
            console.log("Something went wrong");
        }
    });
}


function nextWebsite(websites) {
    let len = websites.length;
	displayWebsite(websites[websiteNumber % len]["url"])
    console.log(websites[websiteNumber % websites.length]["time"], websites[websiteNumber % websites.length]["url"])
	siteTimer = setTimeout(function() {
        nextWebsite(websites)
    }, websites[websiteNumber++ % len]["time"])
}

function displayAlert(text) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length < 1) {
            stop();
            return;
        }
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {"message": "alert", "data": text});
    });
}

function displayWebsite(websiteUrl) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length < 1) {
            stop();
            return;
        }
	    var activeTab = tabs[0];
	    chrome.tabs.sendMessage(activeTab.id, {"message": "show_page", "url": websiteUrl});
	});
}

