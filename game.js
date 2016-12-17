function joinGame() {
    connection.joinGame();
}

function lockIn() {
    $("#lock-in-button").attr("disabled", true);
    connection.lockIn();
}

function endTurn() {
    connection.endTurn();
}
