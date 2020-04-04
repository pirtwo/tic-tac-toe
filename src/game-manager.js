const GAMESTATS = {
    'play': 0,
    'pause': 1
}

const GAMEMODES = {
    'cvh': 0, // computer vs human
    'hvh': 1, // human vs human
    'cvc': 2 // computer vs computer
}

const GAMEDIFFICULTY = {
    'easy': 0,
    'normal': 3,
    'impossible': 10
}

class GameManager {
    constructor({
        mode,
        status,
        difficulty,
        isLogging = false,
        boardManager
    }) {
        this.logs = [];
        this.isLogging = isLogging;
        this.mode = undefined;
        this.status = undefined;
        this.difficulty = undefined;
        this.boardManager = boardManager;

        this._playerOne = undefined;
        this._playerTwo = undefined;
        this._currentPlayer = undefined;

        this.setMode(mode);
        this.setStatus(status);
        this.setDifficulty(difficulty);
    }

    newGame() {
        this.setCurrentPlayer(this._playerOne);
        this.boardManager.reset();
    }

    pause() {
        this.setStatus(GAMESTATS.pause);
    }

    resume() {
        this.setStatus(GAMESTATS.play);
    }

    logMove(move) {
        this.logs.push({
            player: move.player,
            move: {
                row: move.row,
                col: move.col
            },
            board: this.boardManager.board.map(r => r.slice(0))
        });
    }

    canHumanPlay() {
        return this.status != GAMESTATS.pause &&
            this.mode != GAMEMODES.cvc &&
            this._currentPlayer.isHuman &&
            (this.boardManager.getWinner() == null && this.boardManager.hasOpenCell());
    }

    canComputerPlay() {
        return this.status != GAMESTATS.pause &&
            this.mode != GAMEMODES.hvh &&
            !this._currentPlayer.isHuman &&
            (this.boardManager.getWinner() == null && this.boardManager.hasOpenCell());
    }

    setMode(value) {
        if (Object.values(GAMEMODES).indexOf(value) == -1)
            throw Error(`invalid value: ${value} for game mode.`);
        this.mode = value;
    }

    setStatus(value) {
        if (Object.values(GAMESTATS).indexOf(value) == -1)
            throw Error(`invalid value: ${value} for game status.`);
        this.status = value;
    }

    setDifficulty(value) {
        if (Object.values(GAMEDIFFICULTY).indexOf(value) == -1)
            throw Error(`invalid value: ${value} for game difficulty.`);
        this.difficulty = value;
    }

    setCurrentPlayer({
        sign,
        isHuman
    }) {
        this._currentPlayer = {
            sign,
            isHuman
        };
    }

    setPlayerOne({
        sign,
        isHuman
    }) {
        this._playerOne = {
            sign,
            isHuman
        };
    }

    setPlayerTwo({
        sign,
        isHuman
    }) {
        this._playerTwo = {
            sign,
            isHuman
        };
    }

    getCurrentPlayer() {
        return this._currentPlayer;
    }

    getNextPlayer() {
        return this._currentPlayer.sign == this._playerOne.sign ?
            this._playerTwo :
            this._playerOne;
    }

    getLogs() {
        return this.logs;
    }

    getMode() {
        return this.mode;
    }

    getStatus() {
        return this.status;
    }

    getDifficulty() {
        return this.difficulty;
    }

    statusToString() {
        let status = "";
        if (this.status == GAMESTATS.PAUSE)
            status = `STATUS: PAUSED`;
        else if (this.boardManager.getWinner() == 'X')
            status = `STATUS: X IS WINNER`;
        else if (this.boardManager.getWinner() == 'O')
            status = `STATUS: O IS WINNER`;
        else if (this.boardManager.getWinner() == 'tie')
            status = `STATUS: GAME IS TIE`;
        else if (this.boardManager.getWinner() == null) {
            if (this._currentPlayer.sign == 'X')
                status = `STATUS: X TURN`;
            if (this._currentPlayer.sign == 'O')
                status = `STATUS: O TURN`;
        }

        return status;
    }
}