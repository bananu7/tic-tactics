"use strict";

function initComms() {
    console.log('init');

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {        
            console.log('signed in as ' + user.uid);

            firebase.database().ref('games').on("child_added", function(data) {
                $("#games").append($("<div></div>").text(data.val()));
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
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

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBmhRuR6w6d8W1UotiIaTGQ7n3yPlSIwYw",
    authDomain: "tic-tactics-7a476.firebaseapp.com",
    databaseURL: "https://tic-tactics-7a476.firebaseio.com",
    storageBucket: "tic-tactics-7a476.appspot.com",
    messagingSenderId: "934965263370"
};
firebase.initializeApp(config);



// Actual communication logic

function createNewGame() {
    var newGameRef = firebase.database().ref('games').push();
    newGameRef.owner = firebase.auth().currentUser.displayName;
}

