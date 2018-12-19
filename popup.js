$(document).ready(function() {
	$("#start").click(function(){
		let tvname = $("#tvname").val();
    let tvpassword = $("#tvpassword").val();
    if (tvname != "" && tvpassword != "") {
      chrome.runtime.sendMessage({"task": "start", "tvname": tvname, "tvpassword": tvpassword});
    }
	}); 
  $("#stop").click(function(){
    chrome.runtime.sendMessage({"task": "stop"});
  }); 
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "show_page") {
    	console.log("test");
      	window.open(request.url, "_self");
    }
    if (request.message == "alert") {
      alert(request.data)
    }
  }
);


