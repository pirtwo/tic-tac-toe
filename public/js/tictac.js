var boardManager;
var mouseClickedEvent = new Event();

var isLogging = false,
    titleFont,
    gameLog = [],
    gameMode,
    gameStatus,
    playerOne,
    playerTwo,
    currentPlayer,
    newGameButton,
    pauseButton,
    undoButton,
    redoButton,
    logButton,
    saveLogButton;

const GAMESTATS = {
    'PLAY': 0,
    'PAUSE': 1
}

const GAMEMODES = {
    // computer vs human
    'CvsH': 0,

    // human vs human
    'HvsH': 1,

    // computer vs computer
    'CvsC': 2
}

function preload() {
    titleFont = loadFont('font/Modak-Regular.ttf');
}

function setup() {
    createCanvas(600, 600);

    gameMode = GAMEMODES.CvsH;
    gameStatus = GAMESTATS.PLAY;
    playerOne = {
        isHuman: false,
        sign: 'X'
    };
    playerTwo = {
        isHuman: true,
        sign: 'O'
    };;
    currentPlayer = playerOne;

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
            currentPlayer = getNextPlayer();
            console.log('UNDO')
        },
        moveRedoCallback: () => {
            currentPlayer = getNextPlayer();
            console.log('REDO')
        },
        moveExecutedCallback: (e) => {
            if (isLogging) logMove(e, boardManager.board);
            console.log(`Move Executed: ${e.player}:[row:${e.row + 1}, col:${e.col + 1}]`)
        },
    });

    newGameButton = new Button({
        x: 410,
        y: 150,
        width: 90,
        text: 'NEW',
        clickCallback: () => {
            currentPlayer = playerOne;
            boardManager.resetBoard();
        }
    });

    pauseButton = new Button({
        x: 410,
        y: 200,
        width: 90,
        text: 'PAUSE',
        clickCallback: () => {
            if (gameStatus == GAMESTATS.PLAY) {
                gameStatus = GAMESTATS.PAUSE;
                pauseButton.text = 'PLAY';
            } else {
                gameStatus = GAMESTATS.PLAY;
                pauseButton.text = 'PAUSE';
            }
        }
    });

    undoButton = new Button({
        x: 410,
        y: 250,
        width: 90,
        text: 'UNDO',
        clickCallback: () => {
            gameStatus = GAMESTATS.PAUSE;
            pauseButton.text = 'PLAY';
            boardManager.undo();
        }
    });

    redoButton = new Button({
        x: 410,
        y: 300,
        width: 90,
        text: 'REDO',
        clickCallback: () => {
            gameStatus = GAMESTATS.PAUSE;
            pauseButton.text = 'PLAY';
            boardManager.redo();
        }
    });

    logButton = new Button({
        x: 410,
        y: 350,
        width: 90,
        text: 'LOG: OFF',
        clickCallback: () => {
            isLogging = !isLogging;
            logButton.text = isLogging ? "LOG: ON" : "LOG: OFF";
        }
    });

    saveLogButton = new Button({
        x: 410,
        y: 400,
        width: 90,
        text: 'SAVE LOG',
        clickCallback: () => {
            saveJSON(gameLog, 'log.json');
        }
    });

    mouseClickedEvent.subscribe(onMouseClicked);
}

function mouseClicked(e) {
    mouseClickedEvent.callEventHandlers({
        mouseX,
        mouseY,
        mouseButton
    });
    return false;
}

function onMouseClicked(e) {
    if (isBoardClicked(e.mouseX, e.mouseY) && canHumanPlay()) {
        let cell = getClickedCell(e.mouseX, e.mouseY);
        humanPlay({
            player: currentPlayer.sign,
            row: cell.row,
            col: cell.col
        });
    }
}

function canHumanPlay() {
    return gameStatus != GAMESTATS.PAUSE && gameMode != GAMEMODES.CvsC && currentPlayer.isHuman;
}

function canComputerPlay() {
    return gameStatus != GAMESTATS.PAUSE && gameMode != GAMEMODES.HvsH && !currentPlayer.isHuman;
}

function humanPlay(move) {
    boardManager.execute(move);
    currentPlayer = getNextPlayer();
}

function computerPlay() {
    if (gameStatus == GAMESTATS.PAUSE) return;

    let moves = [],
        board = boardManager.board;

    let currentState = new TicTacNode({
        board: boardManager.board,
        player: currentPlayer.sign
    });

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] != 0) continue;
            let node = currentState.clone();
            node.board[i][j] = node.player = currentPlayer.sign;            
            moves.push({
                row: i,
                col: j,
                player: currentPlayer.sign,
                score: minmax(node, 10, currentPlayer.sign == 'X' ? 'min' : 'max')
            });
        }
    }

    moves = shuffle(moves);

    let bestMove = moves.find(m => m.score == Math.max.apply({}, moves.map(i => i.score)));

    boardManager.execute(bestMove);
    currentPlayer = getNextPlayer();
}

function logMove(move, board) {
    let log = {
        player: move.player,
        move: {
            row: move.row,
            col: move.col
        },
        board: board.map(r => r.slice(0))
    }

    gameLog.push(log);
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

function getNextPlayer() {
    return currentPlayer.sign == playerOne.sign ? playerTwo : playerOne;
}

function drawStatus() {
    let status = "";
    if (gameStatus == GAMESTATS.PAUSE) 
        status = `STATUS: PAUSED`;        
    else if (boardManager.getWinner() == 'X')
        status = `STATUS: X IS WINNER`;
    else if (boardManager.getWinner() == 'O')
        status = `STATUS: O IS WINNER`;
    else if (boardManager.getWinner() == 'tie')
        status = `STATUS: GAME IS TIE`;
    else if (boardManager.getWinner() == null) {
        if (currentPlayer.sign == 'X')
            status = `STATUS: X TURN`;
        if (currentPlayer.sign == 'O')
            status = `STATUS: O TURN`;
    }

    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(15);
    text(status, 100, 470, 400, 200);
}

function draw() {
    background('rgba(100%, 0%, 100%, 0.5)');

    // draw title and signeture
    stroke("black");
    fill("yellow");
    textSize(60);
    textStyle(BOLD);
    textFont(titleFont);
    textAlign(CENTER, CENTER);
    text('TIC TAC TOE :)', 100, 0, 400, 115);
    textSize(20);
    textStyle(NORMAL);
    text('CREATOR: 1KFUN', 400, 470, 200, 200);
    textFont('Courier New');

    // draw board
    boardManager.draw();

    // draw buttons
    newGameButton.draw();
    pauseButton.draw();
    undoButton.draw();
    redoButton.draw();
    logButton.draw();
    saveLogButton.draw();

    // computer play
    if (frameCount % 20 == 0 && canComputerPlay()) computerPlay();

    // draw status 
    drawStatus();
}