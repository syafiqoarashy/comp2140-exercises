const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BOARD_LENGTH = 3;
const PLAYER_ONE = 'X';
const PLAYER_TWO = 'O';
const EMPTY = ' ';

const INVALID_INPUT = 'Wrong input. Please try again';
const OUT_OF_BOUNDS = 'Position out of bounds. Please try again.';
const POSITION_FILLED = 'Position already filled. Please try again.';
const DRAW_MESSAGE = 'The game ended in a draw.';
const REPLAY_PROMPT = 'Do you wish to play again? [y/N] ';

const WINNING_TRIOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

function printGameBoard(board, padding = 1) {
    const horizontalDivider = '-'.repeat(BOARD_LENGTH * (2 * padding + 1) + 2);

    for (let rowIndex = 0; rowIndex < BOARD_LENGTH; rowIndex++) {
        if (rowIndex !== 0) {
            console.log(horizontalDivider);
        }

        const start = rowIndex * BOARD_LENGTH;
        let row = board.slice(start, start + BOARD_LENGTH);
        row = row.map(value => `${' '.repeat(padding)}${value}${' '.repeat(padding)}`);

        console.log('|' + row.join('|') + '|');
    }

    console.log();
}

class Game {
    constructor() {
        this.reset();
    }

    reset() {
        this._playerOnesTurn = true;
        this._board = Array(BOARD_LENGTH ** 2).fill(EMPTY);
        this._winner = null;
    }

    async play() {
        while (!this.isOver()) {
            printGameBoard(this._board);

            const index = await this.getNextMove();

            if (index < 0 || index >= BOARD_LENGTH ** 2) {
                console.log(OUT_OF_BOUNDS);
                continue;
            }

            if (this._board[index] !== EMPTY) {
                console.log(POSITION_FILLED);
                continue;
            }

            this._board[index] = this.getCurrentPlayer();

            if (this.checkWin()) {
                this._winner = this.getCurrentPlayer();
                break;
            }

            this._playerOnesTurn = !this._playerOnesTurn;
        }
        printGameBoard(this._board);
    }

    getNextMove() {
        return new Promise((resolve) => {
            rl.question(`Player ${this.getCurrentPlayer()}, please enter the index of your next move: `, (move) => {
                if (Number.isInteger(parseInt(move))) {
                    resolve(parseInt(move));
                } else {
                    console.log(INVALID_INPUT);
                    resolve(this.getNextMove());
                }
            });
        });
    }

    getCurrentPlayer() {
        return this._playerOnesTurn ? PLAYER_ONE : PLAYER_TWO;
    }

    checkWin() {
        const positions = this._board
            .map((value, index) => value === this.getCurrentPlayer() ? index : -1)
            .filter(index => index !== -1);

        for (const winningTrio of WINNING_TRIOS) {
            if (winningTrio.every(index => positions.includes(index))) {
                return true;
            }
        }
        return false;
    }

    hasDrawn() {
        return !this._board.includes(EMPTY);
    }

    isOver() {
        return (this.hasDrawn() || this._winner != null);
    }

    displayWinnerInfo() {
        if (this._winner == null) {
            console.log(DRAW_MESSAGE);
        } else {
            console.log(`\nPlayer ${this._winner} has won the game!!`);
        }
    }
}

async function playGame() {
    const game = new Game();
    while (true) {
        await game.play();
        game.displayWinnerInfo();

        const playAgain = await new Promise(resolve => {
            rl.question(REPLAY_PROMPT, answer => resolve(answer.toLowerCase() === 'y'));
        });

        if (!playAgain) {
            rl.close();
            break;
        }

        game.reset();
    }
}

playGame();