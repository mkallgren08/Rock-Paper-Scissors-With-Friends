 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyALrMRDk7vo4mOBQOv78yWt-zlILqPl650",
    authDomain: "rock-paper-scissors-8cbc9.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-8cbc9.firebaseio.com",
    projectId: "rock-paper-scissors-8cbc9",
    storageBucket: "",
    messagingSenderId: "522153913575"
  };
  firebase.initializeApp(config);

  // Get a reference to the root of the chat data.
  var database = firebase.database();

  // // When the user presses enter on the message input, write the message to firebase.
  // $("#messageInput").keypress(function (e) {
  //   if (e.keyCode == 13) {
  //     var name = $("#nameInput").val();
  //     var text = $("#messageInput").val();
  //     database.push({name:name, text:text});
  //     $("#messageInput").val("");
  //   }
  // });

  // // Add a callback that is triggered for each chat message.
  // database.on("child_added", function (snapshot) {
  //   var message = snapshot.val();
  //   $("<div/>").text(message.text).prepend($("<em/>")
  //     .text(message.name + ": ")).appendTo($("#messagesDiv"));
  //   $("#messagesDiv")[0].scrollTop = $("#messagesDiv")[0].scrollHeight;
  // });

function saveToList(event) {
  	$("input").keydown(function(event){
	    if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, we will attempt to save the data
	        var messageText = $('#messageText').val().trim();
	        if (messageText.length > 0) {
	        	// var p = '<p>' + messageText + '</p>';
	            // $("#messagesDiv").append(p);
	            saveToFB(messageText);
	        }
	        $('#messageText').val("");
	        return false;
	    }
	});
}

function saveToFB(messageText) {
    // this will save data to Firebase
    database.push({
        message: messageText
    });
};
 
function refreshUI(messageLog) {
    var lis = '';
    for (var i = 0; i < messageLog.length; i++) {
        lis += '<p data-key="' + messageLog[i].key + '">' + messageLog[i].name + '</>';
    };
    $(database).html(lis);
};
 
// this will get fired on inital load as well as 
// whenever there is a change in the data

database.on("value", function(snapshot) {
    var data = snapshot.val();
    var messageLog = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            name = data[key].message ? data[key].message : '';
            if (name.trim().length > 0) {
                messageLog.push({
                    message: name,
                    key: key
                })
            }
        }
    }
    // refresh the UI
    refreshUI(messageLog);
});
saveToList();


 
        
    
  