"use strict";

var currentUser;

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
            currentUser = user;
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

    firebase.database().ref('games').on("child_removed", function(data) {
        $("#" + data.key).parent().remove();
    });
}

function newGameDiv(data) {
    var elem = $("<div></div>")
        .addClass("game")
        .append($("<h1></h1>").text(data.val().name))
        .append($("<span></span>").css("visibility", "hidden").attr("id", data.key))
        .append(
            $("<a>Open!</a>")
                .attr("href", "#")
                .on("click", function() {
                    var gameWindow = window.open("game.html");
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
    this.playerId = currentUser.uid;
}
GameConnection.prototype.placeUnit = function(unit) {
    this.gameDbRef.child("units").push(unit);
};
GameConnection.prototype.getGameState = function() {
    return this.gameDbRef.child("state").once("value");
}
GameConnection.prototype.lockIn = function() {
    this.gameDbRef.transaction((game) => {
        if (game.state != "placement")
            return;

        game.players[this.playerId].lockedIn = true;

        var allLockedIn = true;
        var numberOfPlayers = 0;

        for (var playerId in game.players) {
            if (!object.hasOwnProperty(playerId))
                continue;

            if (!game.players[playerId].lockedIn) {
                allLockedIn = false;
                break;
            }

            numberOfPlayers += 1;
        }

        if (numberOfPlayers >= 2 && allLockedIn) {
            this.startPlay();
        }
        return game;
    });

}
GameConnection.prototype.onGameStateChanged = function(cb) {
    this.gameDbRef.child("state").on("value", cb);
}
GameConnection.prototype.onYourTurn = function(cb) {
    this.gameDbRef.child("currentPlayer").on("value", (data) => {
        if (data.val() == this.playerId) {
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
    this.gameDbRef.transaction(function(game) {
        if (game.state != "play")
            return;

        var currentPlayerIndex = game.players.indexOf(game.currentPlayer);
        var nextPlayerIndex = currentPlayerId + 1;
        if (nextPlayerIndex >= game.players.length) {
            nextPlayerIndex = 0;
        }

        game.currentPlayer = game.players[nextPlayerIndex];
        return game;
    });
}
GameConnection.prototype.leaveGame = function() {
    this.gameDbRef.transaction((game) => {
        delete game.players[this.playerId];

        for (var playerId in game.players) {
            if (!object.hasOwnProperty(playerId))
                continue;

            // If there's a player in the game still, just leave it be
            return game;
        }

        // If no players has kept the game alive, remove it
        return null;
    });
};

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
    this.gameDdRef.transaction(function(game) {
        game.currentPlayer = playerList[0];
        game.state = "play";
    });
}

// Actual communication logic

function createNewGame() {
    // you automatically join games you create
    // mostly to prevent them from being automatically cleared
    var startingPlayers = {};
    startingPlayers[currentUser.uid] = { joined: true };

    var newGameObject = {
        owner: firebase.auth().currentUser.displayName,
        objects: [],
        name: currentUser.email + "'s game",
        state: "lobby",
        players: startingPlayers,
        // this has to be set to random player once the game starts
        currentPlayer: null,
        // just to guarantee the goddamn thing actually creates
        token: "token",
    };

    firebase.database().ref('games').push().set(newGameObject);
}

