"use strict";

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
                    var gameWindow = window.open("draw.html");
                    gameWindow.connection = makeGameConnection(data);
                    window.gw = gameWindow;
                })
        );
    return elem;
}

function makeGameConnection(gameData) {
    return {
        annoyVen: function() {
            console.log("ven is annoyed")
        }
    };
}

// Actual communication logic

function createNewGame() {
    var newGameObject = {
        owner: firebase.auth().currentUser.displayName,
        objects: [],
        // just to guarantee the goddamn thing actually creates
        token: "token"
    };


    firebase.database().ref('games').push().set(newGameObject);
}

