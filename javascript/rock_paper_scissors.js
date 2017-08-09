 // Initialize Firebase
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBvA9My1TC8DRmJaydWEUtaU9s8ypiuRKc",
    authDomain: "rock-paper-scissors-messaging.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-messaging.firebaseio.com",
    projectId: "rock-paper-scissors-messaging",
    storageBucket: "",
    messagingSenderId: "699639218916"
  };
  firebase.initializeApp(config);

  // Get a reference to the root of the chat data.

  var msgDatabase = firebase.database();
  console.log(msgDatabase)

  var messages = []

  // // When the user presses enter on the message input, write the message to firebase.
  // $("#messageInput").keypress(function (e) {
  //   if (e.keyCode == 13) {
  //     var name = $("#nameInput").val();
  //     var text = $("#messageInput").val();
  //     msgDatabase.push({name:name, text:text});
  //     $("#messageInput").val("");
  //   }
  // });

  // // Add a callback that is triggered for each chat message.
  // msgDatabase.on("child_added", function (snapshot) {
  //   var message = snapshot.val();
  //   $("<div/>").text(message.text).prepend($("<em/>")
  //     .text(message.name + ": ")).appendTo($("#messagesDiv"));
  //   $("#messagesDiv")[0].scrollTop = $("#messagesDiv")[0].scrollHeight;
  // });

//===========================================================================================
// CHAT FUNCTIONS!
//===========================================================================================
function saveToList(event) {
  	$("input").keydown(function(event){

	    if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, 
	    												// we will attempt to save the data
	        var messageText = $('#messageText').val().trim();
	        if (messageText.length > 0) {
	            saveMsgToFB(messageText);
	            makeTextOutput(messageText);
	        }
	        $('#messageText').val("");
	        return false;
	    }
	});
}

function makeTextOutput(messageText){
	// $("#messagesDiv").empty();
	var a = $("<p>");
	var output = a.text("Player 1: " + messageText);
	$("#messagesDiv").append(output);
}

function saveMsgToFB(messageText) {
    // this will save data to Firebase
    msgDatabase.ref("room1").push({
        message: "Player 1: " + messageText,
    });
};
 
function refreshUI(messageLog) {
    var lis = '';
    for (var i = 0; i < messageLog.length; i++) {
        lis += '<p data-key="' + messageLog[i].key + '">' + messageLog[i].name + '</>';
    };
    $("#messagedDiv").html(lis);
};
 
// this will get fired on inital load as well as 
// whenever there is a change in the data
console.log("You're here!")
msgDatabase.ref('room1').once("value", function(snapshot) {
    var data = snapshot.val();
    console.log(data);
    var messageLog = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
        	// "?" = value-if-true, ":" value-if-false
            name = data[key].message ? data[key].message : '';
            console.log(name);
            if (name.trim().length > 0) {
            	var m = $("<p>")
            	m.text(name)
                $("#messagesDiv").append(m);
                }
            }
        }
    });
    // refresh the UI
//     refreshUI(messageLog);
// });
saveToList();

//========================================================
// GAMEPLAY FUNCTIONS
//========================================================

function savePickToFB(playerPick) {
    // this will save data to Firebase
    msgDatabase.ref("room1").push({
        message: "Player 1: " + messageText,
    });
};
 
        
    
  