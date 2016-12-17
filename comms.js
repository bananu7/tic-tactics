"use strict";

var userId;

function initComms() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBmhRuR6w6d8W1UotiIaTGQ7n3yPlSIwYw",
        authDomain: "tic-tactics-7a476.firebaseapp.com",
        databaseURL: "https://tic-tactics-7a476.firebaseio.com",
        storageBucket: "tic-tactics-7a476.appspot.com",
        messagingSenderId: "934965263370"
    };
    firebase.initializeApp(config);

    console.log('init');

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {        
            console.log('signed in as ' + user.uid);
            userId = user.uid;
            attachUpdateHooks();
        } else {
            firebase.auth().signInWithEmailAndPassword('example@example.com', 'example').catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('auth error: ' + error.message)
            });
        }
    });
}

function attachUpdateHooks() {
    firebase.database().ref('games').on("child_added", function(data) {
        $("#games").append(newGameDiv(data));
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function newGameDiv(data) {
    var elem = $("<div></div>")
        .addClass("game")
        .append($("<h1></h1>").text(data.key))
        .append(
            $("<a>join!</a>")
                .attr("href", "#")
                .on("click", function() {
                    var gameWindow = window.open("place.html");
                    gameWindow.connection = new GameConnection(data);
                    window.gw = gameWindow;
                })
        );
    return elem;
}

// This object is passed to the game window
function GameConnection(gameData) {
    //this.gameDate = gameData;
    this.gameDbRef = firebase.database().ref("games").child(gameData.key);
    this.playerId = userId;
}
GameConnection.prototype.placeUnit = function(unit) {
    this.gameDbRef.child("units").push(unit);
};
GameConnection.prototype.getGameState = function() {
    return this.gameDbRef.child("state").once("value");
}
GameConnection.prototype.lockIn = function() {
    this.gameDbRef.child("players").child(this.playerId).child("lockedIn").set("true");
    this.gameDbRef.child("players").once("value").then(function(data) {
        var playerList = data.val();
        // if all players have locked in
        if (playerList.filter(p => !p.lockedIn).length == 0
            && 
            playerList.length >= 2) {
            this.startPlay(playerList);
        }
    });
}
GameConnection.prototype.onGameStateChanged = function(cb) {
    this.gameDbRef.child("state").on("value", cb);
}
GameConnection.prototype.onYourTurn = function(cb) {
    this.gameDbRef.child("currentPlayer").on("value", function(data) {
        if (data.val() = this.playerId) {
            cb();
        }
    });
}
GameConnection.prototype.onActionHappened = function() {
    this.gameDbRef.child("actions").on("child_added", cb);
}
GameConnection.prototype.makeAction = function(action) {
    this.gameDbRef.child("actions").push().set(action);
}
GameConnection.prototype.endTurn = function() {
    this.gameDbRef.child("players").once("value", function(data) {
        var playerList = data.val();
        this.gameDbRef.child("currentPlayer").once("value", function(data) {
            var currentPlayer = data.val();
            var currentPlayerId = playerList.indexOf(currentPlayer);
            var nextPlayerId = currentPlayerId + 1;
            if (nextPlayerId >= playerList.length) {
                nextPlayerId = 0;
            }
        });
    });
}

// Makes you a part of the game
GameConnection.prototype.joinGame = function() {
    this.gameDbRef.child("players").child("this.playerId").set({ 
        joined: true,
        lockedIn: false
    });
}
// Closes the lobby
GameConnection.prototype.startGame = function() {
    // The game starts by unit placement
    this.gameDbRef.child("state").set("placement");
}
GameConnection.prototype.startPlay = function() {
    this.gameDbRef.child("currentPlayer").set(playerList[0]);
}

// Actual communication logic

function createNewGame() {
    var newGameObject = {
        owner: firebase.auth().currentUser.displayName,
        objects: [],
        state: "lobby",
        players: [],
        // this has to be set to random player once the game starts
        currentPlayer: null,
        // just to guarantee the goddamn thing actually creates
        token: "token",        
    };

    firebase.database().ref('games').push().set(newGameObject);
}

