var boardManager;
var mouseClickedEvent = new Event();

var isPaused = false,
    titleFont,
    status = "",
    newGameButton,
    pauseButton,
    undoButton,
    redoButton;

function preload() {
    titleFont = loadFont('font/Modak-Regular.ttf');
}

function setup() {
    createCanvas(600, 600);

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
            console.log('UNDO')
        },
        moveRedoCallback: () => {
            console.log('REDO')
        },
        moveExecutedCallback: (e) => {
            console.log(`Move Executed: ${e.player}:[row:${e.row + 1}, col:${e.col + 1}]`)
        },
    });

    mouseClickedEvent.subscribe(humanPlay);

    newGameButton = new Button({
        x: 410,
        y: 150,
        width: 90,
        text: 'NEW',
        clickCallback: () => {
            boardManager.resetBoard();
        }
    });

    pauseButton = new Button({
        x: 410,
        y: 200,
        width: 90,
        text: 'PAUSE',
        clickCallback: () => {
            isPaused = !isPaused;
            pauseButton.text = isPaused ? 'PLAY' : 'PAUSE';
        }
    });

    undoButton = new Button({
        x: 410,
        y: 250,
        width: 90,
        text: 'UNDO',
        clickCallback: () => {
            isPaused = true;
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
            isPaused = true;
            pauseButton.text = 'PLAY';
            boardManager.redo();
        }
    });
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

    // computer play
    if (boardManager.currentPlayer == boardManager.computerPlayer) {
        if (frameCount % 10 == 0)
            computerPlay();
    }

    // draw status 
    gameStatus();
}

function mouseClicked(e) {
    mouseClickedEvent.callEventHandlers({
        mouseX,
        mouseY,
        mouseButton
    });
    return false;
}

function gameStatus() {
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textSize(15);
    
    if (boardManager.getWinner() == 'X')
        status = `STATUS: X IS WINNER`;
    if (boardManager.getWinner() == 'O')
        status = `STATUS: O IS WINNER`;
    if (boardManager.getWinner() == 'tie')
        status = `STATUS: GAME IS TIE`;
    if (boardManager.getWinner() == null) {
        if (boardManager.currentPlayer == boardManager.humanPlayer)
            status = `STATUS: YOUR TURN`;
        if (boardManager.currentPlayer == boardManager.computerPlayer)
            status = `STATUS: AI TURN`;
    }

    text(status, 100, 470, 400, 200);
}

function humanPlay(e) {
    if (isPaused) return;

    let mouseX = e.mouseX,
        mouseY = e.mouseY;
    if (mouseX > boardManager.boardPosition.x &&
        mouseX < boardManager.boardPosition.x + boardManager.boardSize &&
        mouseY > boardManager.boardPosition.y &&
        mouseY < boardManager.boardPosition.y + boardManager.boardSize &&
        boardManager.currentPlayer == boardManager.humanPlayer
    ) {
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
                    boardManager.execute({
                        player: boardManager.humanPlayer,
                        row: i,
                        col: j
                    });
                }
            }
        }
    }
}

function computerPlay() {
    if (isPaused) return;

    let moves = [],
        board = boardManager.board;

    let currentState = new TicTacNode({
        board: boardManager.board,
        player: boardManager.computerPlayer
    });

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            if (board[i][j] != 0) continue;

            let node = currentState.clone();

            node.board[i][j] = boardManager.computerPlayer;
            node.player = boardManager.humanPlayer;

            moves.push({
                row: i,
                col: j,
                player: boardManager.computerPlayer,
                score: minmax(node, 5, 'min')
            });
        }
    }

    moves = shuffle(moves);

    let bestMove = moves.find(m => m.score == Math.max.apply({}, moves.map(i => i.score)));

    boardManager.execute(bestMove);
}