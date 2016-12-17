function joinGame() {
    connection.joinGame();
}

function leaveGame() {
    connection.leaveGame();
    window.close();
}

function lockIn() {
    $("#lock-in-button").attr("disabled", true);
    connection.lockIn();
}

function endTurn() {
    // this will become enabled again once your turn comes
    $("#end-turn-button").attr("disabled", true);
    connection.endTurn();
}

connection.onYourTurn(function() {
    $("#end-turn-button").attr("disabled", false);
});

connection.onGameStateChanged(function(newState) {
    $("#game-state").text(newState);
});