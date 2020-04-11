import * as P5 from "p5";
import {
    GameManager
} from "./game-manager";
import {
    GAMEMODES
} from "./game-manager";
import {
    GAMESTATS
} from "./game-manager";
import {
    GAMEDIFFICULTY
} from "./game-manager";
import BoardManager from "./board-manager";
import Button from "./button";
import Events from "./event";
import minmax from "./minmax";
import TicTacNode from "./tictac-node";

const sk = (p5) => {
    let gameManager,
        boardManager,
        mouseClickedEvent,
        titleFont,
        newGameButton,
        modeButton,
        difficultyButton,
        pauseButton,
        undoButton,
        redoButton,
        logButton,
        saveLogButton;

    p5.preload = () => {
        titleFont = p5.loadFont('font/Modak-Regular.ttf');
    }

    p5.setup = () => {
        p5.createCanvas(680, 600);

        boardManager = new BoardManager({
            grid: 3,
            boardSize: 300,
            boardPosition: {
                x: 100,
                y: 150
            },
            boardResetCallback: () => {
                console.log('NEW GAME')
            },
            moveUndoCallback: () => {
                gameManager.setCurrentPlayer(gameManager.getNextPlayer());
                console.log('UNDO')
            },
            moveRedoCallback: () => {
                console.log('REDO')
            },
            moveExecutedCallback: (e) => {
                gameManager.setCurrentPlayer(gameManager.getNextPlayer());
                if (gameManager.isLogging)
                    gameManager.logMove(e, boardManager.board);
                console.log(`Move Executed: ${e.player}:[row:${e.row + 1}, col:${e.col + 1}]`);
            }
        });

        gameManager = new GameManager({
            mode: GAMEMODES.cvh,
            status: GAMESTATS.play,
            difficulty: GAMEDIFFICULTY.easy,
            boardManager: boardManager
        });

        mouseClickedEvent = new Events();

        gameManager.setPlayerOne({
            sign: 'X',
            isHuman: false
        });
        gameManager.setPlayerTwo({
            sign: 'O',
            isHuman: true
        });
        gameManager.setCurrentPlayer({
            sign: 'X',
            isHuman: false
        });

        newGameButton = new Button({
            x: 420,
            y: 150,
            width: 90,
            text: 'NEW',
            mouseClickedEvent: mouseClickedEvent,
            clickCallback: function () {
                console.log("new game!!!");
                gameManager.newGame();
            }
        });

        pauseButton = new Button({
            x: 520,
            y: 150,
            width: 90,
            text: 'PAUSE',
            mouseClickedEvent: mouseClickedEvent,
            clickCallback: () => {
                if (gameManager.getStatus() == GAMESTATS.play) {
                    gameManager.setStatus(GAMESTATS.pause);
                    pauseButton.text = 'PLAY';
                } else {
                    gameManager.setStatus(GAMESTATS.play);
                    pauseButton.text = 'PAUSE';
                }
            }
        });

        undoButton = new Button({
            x: 420,
            y: 200,
            width: 90,
            text: 'UNDO',
            mouseClickedEvent: mouseClickedEvent,
            clickCallback: () => {
                gameManager.setStatus(GAMESTATS.pause);
                pauseButton.text = 'PLAY';
                boardManager.undo();
            }
        });

        redoButton = new Button({
            x: 520,
            y: 200,
            width: 90,
            text: 'REDO',
            mouseClickedEvent: mouseClickedEvent,
            clickCallback: () => {
                gameManager.setStatus(GAMESTATS.pause);
                pauseButton.text = 'PLAY';
                boardManager.redo();
            }
        });

        logButton = new Button({
            x: 420,
            y: 250,
            width: 90,
            text: 'LOG: OFF',
            mouseClickedEvent: mouseClickedEvent,
            clickCallback: () => {
                gameManager.isLogging = !gameManager.isLogging;
                logButton.text = gameManager.isLogging ? "LOG: ON" : "LOG: OFF";
            }
        });

        saveLogButton = new Button({
            x: 520,
            y: 250,
            width: 90,
            text: 'SAVE LOG',
            mouseClickedEvent: mouseClickedEvent,
            clickCallback: () => {
                p5.saveJSON(gameManager.getLogs(), 'log.json');
            }
        });

        difficultyButton = new Button({
            x: 420,
            y: 300,
            width: 190,
            text: 'DIFFICULTY: EASY',
            mouseClickedEvent: mouseClickedEvent,
            clickCallback: () => {
                if (gameManager.getDifficulty() == GAMEDIFFICULTY.easy) {
                    gameManager.setDifficulty(GAMEDIFFICULTY.normal);
                    difficultyButton.text = 'DIFFICULTY: NORMAL';
                } else if (gameManager.getDifficulty() == GAMEDIFFICULTY.normal) {
                    gameManager.setDifficulty(GAMEDIFFICULTY.impossible);
                    difficultyButton.text = 'DIFFICULTY: IMPOSSIBLE';
                } else if (gameManager.getDifficulty() == GAMEDIFFICULTY.impossible) {
                    gameManager.setDifficulty(GAMEDIFFICULTY.easy);
                    difficultyButton.text = 'DIFFICULTY: EASY';
                }

                gameManager.newGame();
            }
        });

        modeButton = new Button({
            x: 420,
            y: 350,
            width: 190,
            text: 'MODE: COMPUTER VS HUMAN',
            mouseClickedEvent: mouseClickedEvent,
            clickCallback: function () {
                if (gameManager.getMode() == GAMEMODES.cvh) {
                    gameManager.setPlayerOne({
                        sign: 'X',
                        isHuman: true
                    });
                    gameManager.setPlayerTwo({
                        sign: 'O',
                        isHuman: true
                    });
                    gameManager.setMode(GAMEMODES.hvh);
                    modeButton.text = 'MODE: HUMAN VS HUMAN';
                } else if (gameManager.getMode() == GAMEMODES.hvh) {
                    gameManager.setPlayerOne({
                        sign: 'X',
                        isHuman: false
                    });
                    gameManager.setPlayerTwo({
                        sign: 'O',
                        isHuman: false
                    });
                    gameManager.setMode(GAMEMODES.cvc);
                    modeButton.text = 'MODE: COMPUTER VS COMPUTER';
                } else if (gameManager.getMode() == GAMEMODES.cvc) {
                    gameManager.setPlayerOne({
                        sign: 'X',
                        isHuman: false
                    });
                    gameManager.setPlayerTwo({
                        sign: 'O',
                        isHuman: true
                    });
                    gameManager.setMode(GAMEMODES.cvh);
                    modeButton.text = 'MODE: COMPUTER VS HUMAN';
                }

                gameManager.newGame();
            }
        });

        mouseClickedEvent.subscribe(onMouseClicked);
    }

    p5.mouseClicked = () => {
        let mouseX = p5.mouseX;
        let mouseY = p5.mouseY;
        let mouseButton = p5.mouseButton;

        mouseClickedEvent.callEventHandlers({
            mouseX,
            mouseY,
            mouseButton
        });
        return false;
    }

    p5.draw = () => {
        p5.background('rgba(100%, 0%, 100%, 0.5)');

        // draw title and signeture
        p5.stroke("black");
        p5.fill("yellow");
        p5.textSize(60);
        p5.textStyle(p5.BOLD);
        p5.textFont(titleFont);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text('TIC TAC TOE :)', 0, 0, 680, 115);
        p5.textSize(20);
        p5.textStyle(p5.NORMAL);
        p5.text('CREATOR: 1KFUN', 430, 470, 200, 200);
        p5.textFont('Courier New');

        // draw board
        boardManager.draw(p5);

        // draw buttons
        newGameButton.draw(p5);
        pauseButton.draw(p5);
        undoButton.draw(p5);
        redoButton.draw(p5);
        logButton.draw(p5);
        saveLogButton.draw(p5);
        difficultyButton.draw(p5);
        modeButton.draw(p5);

        // computer play
        if (p5.frameCount % 20 == 0 && gameManager.canComputerPlay()) computerPlay();

        // draw status 
        drawStatus();
    }

    function onMouseClicked(e) {
        if (isBoardClicked(e.mouseX, e.mouseY)) {
            let cell = getClickedCell(e.mouseX, e.mouseY);
            if (gameManager.canHumanPlay())
                boardManager.execute({
                    row: cell.row,
                    col: cell.col,
                    player: gameManager.getCurrentPlayer().sign
                });
        }
    }

    function computerPlay() {
        let moves = [],
            bestMove,
            difficulty = gameManager.getDifficulty(),
            currentPlayer = gameManager.getCurrentPlayer().sign,
            currentState = new TicTacNode({
                board: boardManager.board,
                player: currentPlayer.sign
            });

        boardManager.getOpenCells().forEach(cell => {
            let node = currentState.clone();
            node.board[cell.row][cell.col] = node.player = currentPlayer;
            moves.push({
                row: cell.row,
                col: cell.col,
                player: currentPlayer,
                score: minmax(node, difficulty, currentPlayer == 'X' ? 'min' : 'max')
            });
        });

        moves = p5.shuffle(moves);

        bestMove = moves.find(m => {
            if (currentPlayer == 'X')
                return m.score == Math.max.apply({}, moves.map(i => i.score))
            else
                return m.score == Math.min.apply({}, moves.map(i => i.score))
        });

        boardManager.execute(bestMove);
    }

    function isBoardClicked(mouseX, mouseY) {
        return mouseX > boardManager.boardPosition.x &&
            mouseX < boardManager.boardPosition.x + boardManager.boardSize &&
            mouseY > boardManager.boardPosition.y &&
            mouseY < boardManager.boardPosition.y + boardManager.boardSize;
    }

    function getClickedCell(mouseX, mouseY) {
        let x, y, cellSize = boardManager.boardSize / boardManager.grid;

        for (let i = 0; i < boardManager.grid; i++) {
            y = boardManager.boardPosition.y + cellSize * i;
            for (let j = 0; j < boardManager.grid; j++) {
                x = boardManager.boardPosition.x + cellSize * j;

                if (mouseX > x &&
                    mouseX < x + cellSize &&
                    mouseY > y &&
                    mouseY < y + cellSize
                ) {
                    return {
                        row: i,
                        col: j
                    }
                }
            }
        }
    }

    function drawStatus() {
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.textStyle(p5.BOLD);
        p5.textSize(15);
        p5.text(gameManager.statusToString(), 100, 470, 400, 200);
    }
}

new P5(sk);