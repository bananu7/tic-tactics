function joinGame() {
    connection.joinGame();
    /* TODO should probably start game here */
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

function startGame(gameConfig, container) {
    let {units, money} = gameConfig;

    // build the DOM
    var boardEl = document.createElement('div');
    boardEl.id = 'board';
    container.appendChild(boardEl);
    var unitListEl = document.createElement('div');
    unitListEl.id = 'unit-list';
    container.appendChild(unitListEl);

    function redraw() {
      draw(objects, boardEl);
    }

    // first, draw the game (it only has markers for now)
    redraw();

    // start the game in placement mode.
    placement({units, objects, unitListEl, redraw, money, end: function (objects) {
      console.log('done placing');
      container.removeChild(unitListEl);
    }});
}
