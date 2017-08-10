 // Initialize Firebase
//=================================================================
 $(document).ready(function() {
 console.log("=================================================================")

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
  //console.log(msgDatabase)

  var numPlayers;

  var Player1;

  var Player2;

  var players = []

  var myID = "";

  var title = ""
//======================================================
  // USER/PLAYER LOGS
//======================================================
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = msgDatabase.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = msgDatabase.ref(".info/connected");

// Writes the number of active wathcers to the HTML
connectionsRef.on("value", function(snap) {
	console.log("=================================================================")
  $("#watchers").html(snap.numChildren());
  numPlayers = msgDatabase.ref("numPlayers").set(snap.numChildren());
  console.log("Number of Watchers: " + snap.numChildren())

});

function makeMainPlayerIDs(snapshot){
	var data = Object.keys(snapshot.val());
	    console.log(data);
	    players = [];
	    for( var i = 0; i < 2; i++) {
	        	// "?" = value-if-true, ":" value-if-false
	            name = data[i]
	            //console.log(name);
	            if (i == 0) {
	            	Player1 = name;
	            	console.log("Player1 ID: " + Player1);
	            	players.push(Player1)
	            	console.log("Player array: " + players)
	            } else if ( i === 1){
	            	Player2 = name;
	            	console.log("Player2 ID: " + Player2);
	            	players.push(Player2)
	            	console.log("Player array: " + players)
	            }	            
		}
};

// When the client's connection state changes...
connectedRef.on("value", function(snap) {
  // If they are connected..
  if (snap.val()) {
    // Add user to the connections list.
    var con = connectionsRef.push(true);
    
    // Remove user from the connection list when they disconnect.;
    con.onDisconnect().remove();

    // Creates the IDs for player 1 and player 2
    connectionsRef.on("value", function(snapshot) {
			makeMainPlayerIDs(snapshot);
			highlightPlayer(myID);
			returnName(myID);
	});

  }

});

function highlightPlayer(myID){
 if (myID !== players[0] && myID !== players[1]){
 	$(".player2-panel").css({"border" : "0px solid transparent"},
 		{"background-color": "white"}
 		)
 	 $(".player1-panel").css({"border" : "0px solid transparent"},
 		{"background-color": "white"}
 		)		
 	} else if (myID === players[1]){
 	$(".player2-panel").css({"border" : "5px solid red"},
 		{"background-color": "red"}
 		)
 	$(".player1-panel").css({"border" : "0px solid transparent"},
 		{"background-color": "white"}
 		)
 	} else{
 	$(".player1-panel").css({"border" : "5px solid blue"},
 		{"background-color": "blue"}
 		)
 	 $(".player2-panel").css({"border" : "0px solid transparent"},
 		{"background-color": "white"}
 		)		
 	}
}
//This assigns you the ID at the end of the queue - don't reload! 
connectionsRef.once("value", function(snap) {
		var data2 = Object.keys(snap.val())
		console.log("data2: " + data2)
		myID = data2[data2.length-1]
		console.log("myID.2: " + myID);
		highlightPlayer(myID)
	});

msgDatabase.ref("/connections").on("child_changed", function(snap){
	highlightPlayer(myID)
})

function disconnectAlert(){
	var a = $("<p>")
	a.text("A player has left!")
	$("#messagesDiv").prepend(a);
};

//===========================================================================================
// CHAT FUNCTIONS!
//===========================================================================================
function clearMsgLogs(roomToDelete){
	msgDatabase.ref(roomToDelete).remove();
	msgDatabase.ref(roomToDelete).push({
         message: "Logs cleared!",
	});
	msgDatabase.ref(roomToDelete).once("value", function(snapshot, prevChildKey){
	   var newPost = snapshot.val()
  		var n = $("<p>")
		n.text("Logs cleared!")
   		$("#messagesDiv").html(n);
	});
};

function returnName(myID){
	if (myID === players[0] && myID !== players[1]){
		title = "Player 1: "
	} else if (myID === players[1] && myID !== players[0]){
		title =  "Player 2: "
	} else {
		title =  "Spectator: "
	}
	console.log("Title: " + title)
}

function saveToList(event) {
  	$("input").keydown(function(event){

	    if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, 
	    												// we will attempt to save the data
	        var messageText = $('#messageText').val().trim();
	        if (messageText.length > 0) {
	        	//var title = returnName(myID);
	            saveMsgToFB(title + messageText);
	            //makeTextOutput(messageText);
	            console.log("Title: " + title);
	        }
	        $('#messageText').val("");
	        return false;
	    }
	});
}

function makeTextOutput(messageText){
	// $("#messagesDiv").empty();
	var a = $("<p>");
	//var title = returnName(myID);
	var output = a.text(messageText);
	$("#messagesDiv").prepend(output);
}

function saveMsgToFB(messageText) {
    // this will save data to Firebase
    msgDatabase.ref("room1").push({
        message: messageText,
    });
};
 
// this will get fired on inital load as well as 
// whenever there is a change in the data
console.log("You're here!")
// Retrieve new posts as they are added to our database
msgDatabase.ref('room1').on("child_added", function(snapshot, prevChildKey) {
  var newPost = snapshot.val();
  console.log("Last Message: " + newPost.message);

  var n = $("<p>")
	n.text(newPost.message)
   	$("#messagesDiv").prepend(n);
});

saveToList();

$("#clear-logs").on("click", function(event){
	clearMsgLogs('room1');
});


//========================================================
// GAMEPLAY FUNCTIONS
//========================================================

var arena = msgDatabase.ref("arena")
var p1ticker = 0;
var p2ticker = 0;


$(".p1-weapon-pick").click( function(){
	if (myID === players[0] && p1ticker === 0){
	var p1weaponPick = $(this).val()
	p1ticker++
	console.log(p1weaponPick);
	saveWeaponToFB(Player1, p1weaponPick);
	}
});

$(".p2-weapon-pick").click( function(){
	if (myID === players[1] && p2ticker === 0){
	var p2weaponPick = $(this).val()
	p2ticker++
	console.log(p2weaponPick);
	saveWeaponToFB(Player2, p2weaponPick);
	}
});


function saveWeaponToFB(player, weaponPick) {
    msgDatabase.ref("arena").push({
        player: weaponPick,
    });
};

//console.log("Player 1 string ID: " + players[0].toString())
msgDatabase.ref().on("value", function(snap){
console.log("My string ID: " + myID)


});      
    
 }); 