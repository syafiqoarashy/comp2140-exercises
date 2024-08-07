// Import Node.js dependencies

var prompt = require("prompt-sync")({
    sigint: true
});

// Global variables

var empty = " ";
var boardLength = 3;
var playerOne = "X";
var playerTwo = "O";
var playerOnesTurn;
var board;
var winner;

// Messages

var invalidInput = "Wrong input. Please try again.";
var outOfBounds = "Position out of bounds. Please try again.";
var positionFilled = "Position already filled. Please try again.";
var drawMessage = "The game ended in a draw.";
var replayPrompt = "Do you wish to play again?";
var movePrompt = function(sym) {
    return `Player ${sym}, please enter the index of your next move: `;
};
var winMessage = function(player) {
    return `\nPlayer ${player} has won the game.`;
}

// Winning trios

var winningTrios = new Array(
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
);

/**
 * This function will print out the board game into the console.
 * @param {array} board - An array containing the values for each position on the board.
 * @param {number} padding - How many spaces should appear either side of the values.
 */
function printGameBoard(board, padding = 1) {
    var horizontalDivider = "-".repeat((boardLength * (2 * padding + 1) + 2));
    for (var rowIndex = 0; rowIndex < boardLength; rowIndex++) {
        if (rowIndex != 0) {
            console.log(horizontalDivider);
        }
        var start = rowIndex * boardLength;
        var row = board.slice(start, start + boardLength);
        var rowNew = [];
        for(var i = 0; i < row.length; i++) {
            rowNew.push(empty.repeat(padding) + `${row[i]}` + empty.repeat(padding));
        }
        row = rowNew;
        console.log(row.join("|"));
    }
    console.log(" ");
}

/**
 * Resets the game to a valid starting state.
 */
function resetGame() {
    playerOnesTurn = true;
    board = Array.from(Array(boardLength ** 2), function() {
        return " ";
    });
    winner = null;
}

/**
 * Identify which player is currently playing.
 * @returns Get the string corresponding to the player whose turn it is.
 */
function gameGetCurrentPlayer() {
    if (playerOnesTurn) {
        return playerOne;
    }
    return playerTwo;
}

/**
 * To check if there is any winner from the current state of the gameboard.
 * @returns true if there is a winner.
 */
function gameCheckWin() {
    // Get all player owned indices
    var positions = [];
    for(var i = 0; i < board.length; i++) {
        if (board[i] == gameGetCurrentPlayer()) {
            positions.push(i);
        }
        else {
            positions.push(undefined);
        }
    }
    
    // Check if the player is at all indicies in a winning trio
    var winningTriosSomeCount = 0;
    for(var winningTrio of winningTrios) {
        var winningTrioEveryCount = 0;
        for(var i = 0; i < winningTrio.length; i++) {
            if(positions.includes(winningTrio[i])) {
                winningTrioEveryCount++;
            }
        }
        if(winningTrioEveryCount == winningTrio.length) {
            winningTriosSomeCount++;
        }
    }
    if(winningTriosSomeCount > 0) {
        return true;
    }
}

/**
 * Plays a Tic Tac Toe game through to completion.
 */
function gamePlay() {
    while (!gameIsOver()) {
        printGameBoard(board);
        
        // Prompt the next player for a move
        var index = gameGetNextMove();

        // Perform out of bounds checks
        if (!(0 <= index < boardLength ** 2)) {
            console.log(outOfBounds);
            continue;
        }
        
        // Check if position already filled
        if (board[index] != empty) {
            console.log(positionFilled);
            continue;
        }
        // Enact the move on the board
        board[index] = gameGetCurrentPlayer();

        // Check for end game conditions
        if (gameCheckWin()) {
            winner = gameGetCurrentPlayer();
            return;
        }

        // Flip the turn
        playerOnesTurn = !playerOnesTurn;
    }
}

/**
 * Repeatedly prompts the user for their next move until they give a
 * numerical index, which it returns.
 * Doesn't perform out of bounds validity checks on the supplied index.
 * @returns user input move.
 */
function gameGetNextMove() {
    var move, userIn;
    while (true) {
        userIn = prompt(movePrompt(gameGetCurrentPlayer()));
        move = Number(userIn);

        // Check validity and return the move if true
        if (isNaN(move) || move < 0 || move > 8) {
            console.log(invalidInput);
            continue;
        }
        return move;
    }
}

/**
 * To check if all the grid has been filled and no winner is presence.
 * @returns true if no winner and all the available index is filled by users.
 */
function gameHasDrawn() {
    var gameHasDrawnCount = 0;
    for(var i = 0; i < board.length; i++) {
        if(!board.includes(empty)) {
            gameHasDrawnCount++;
        }
    }
    if(gameHasDrawnCount == board.length) {
        return true;
    }
}

/**
 * Check if the game is over
 * @returns Returns true if the game is over.
 */
function gameIsOver() {
    return gameHasDrawn() || winner !== null;
}

/**
 * Prints winning or drawing info after the game has completed.
 */
function gameDisplayWinnerInfo() {
    if (winner === null) {
        console.log(drawMessage);
    } else {
        console.log(winMessage(winner));
    }
}

/**
 * Resets the game for when the app runs & repeats
 */
function main() {
    while (true) {
        resetGame();
        gamePlay();
        gameDisplayWinnerInfo();
        // Ask user if they want to play again
        if (prompt(replayPrompt) != "y") {
            break;
        }
        resetGame();
    }
}

main();