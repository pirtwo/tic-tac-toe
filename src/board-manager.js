export default class BoardManager {
    constructor({
        grid = 3,
        boardSize,
        boardPosition,
        moveExecutedCallback,
        moveUndoCallback,
        moveRedoCallback,
        boardResetCallback,
    }) {
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        this.grid = grid;
        this.boardSize = boardSize;
        this.boardPosition = boardPosition;
        this.undoList = [];
        this.redoList = [];

        // callbacks
        this.moveExecutedCallback = moveExecutedCallback;
        this.moveUndoCallback = moveUndoCallback;
        this.moveRedoCallback = moveRedoCallback;
        this.boardResetCallback = boardResetCallback;
    }

    execute(move) {
        if (this.isCellOpen(move) && !this.getWinner()) {
            this.board[move.row][move.col] = move.player;
            this.undoList.push(move);
            this.moveExecutedCallback(move);
        }
    }

    undo() {
        let move = this.undoList.pop();
        if (move) {
            this.redoList.push(move);
            this.board[move.row][move.col] = 0;
            this.moveUndoCallback(move);
        }
    }

    redo() {
        let move = this.redoList.pop();
        if (move) {
            this.execute(move);
            this.moveRedoCallback(move);
        }
    }

    hasOpenCell() {
        return this.board.find(r => r.includes(0)) !== null;
    }

    isCellOpen(move) {
        return this.board[move.row][move.col] === 0;
    }

    getWinner() {
        if (
            (this.board[0][0] == 'X' && this.board[0][1] == 'X' && this.board[0][2] == 'X') ||
            (this.board[1][0] == 'X' && this.board[1][1] == 'X' && this.board[1][2] == 'X') ||
            (this.board[2][0] == 'X' && this.board[2][1] == 'X' && this.board[2][2] == 'X') ||
            (this.board[0][0] == 'X' && this.board[1][0] == 'X' && this.board[2][0] == 'X') ||
            (this.board[0][1] == 'X' && this.board[1][1] == 'X' && this.board[2][1] == 'X') ||
            (this.board[0][2] == 'X' && this.board[1][2] == 'X' && this.board[2][2] == 'X') ||
            (this.board[0][0] == 'X' && this.board[1][1] == 'X' && this.board[2][2] == 'X') ||
            (this.board[0][2] == 'X' && this.board[1][1] == 'X' && this.board[2][0] == 'X')
        ) {
            return 'X';
        } else if (
            (this.board[0][0] == 'O' && this.board[0][1] == 'O' && this.board[0][2] == 'O') ||
            (this.board[1][0] == 'O' && this.board[1][1] == 'O' && this.board[1][2] == 'O') ||
            (this.board[2][0] == 'O' && this.board[2][1] == 'O' && this.board[2][2] == 'O') ||
            (this.board[0][0] == 'O' && this.board[1][0] == 'O' && this.board[2][0] == 'O') ||
            (this.board[0][1] == 'O' && this.board[1][1] == 'O' && this.board[2][1] == 'O') ||
            (this.board[0][2] == 'O' && this.board[1][2] == 'O' && this.board[2][2] == 'O') ||
            (this.board[0][0] == 'O' && this.board[1][1] == 'O' && this.board[2][2] == 'O') ||
            (this.board[0][2] == 'O' && this.board[1][1] == 'O' && this.board[2][0] == 'O')
        ) {
            return 'O';
        } else if (!this.board.find(row => row.includes(0))) {
            return 'tie';
        } else {
            // Game is on going
            return null;
        }
    }

    getOpenCells() {
        let openCells = [];
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] == 0) openCells.push({
                    row: i,
                    col: j
                });
            }
        }
        return openCells;
    }

    reset() {
        this.board = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        this.undoList = [];
        this.redoList = [];
        this.boardResetCallback();
    }

    draw() {
        let x = this.boardPosition.x,
            y = this.boardPosition.y,
            size = 300,
            cuts = 3,
            cellSize = size / cuts;

        let topLeft = {
                x: x,
                y: y
            },
            topRight = {
                x: x + size,
                y: y
            },
            bottomLeft = {
                x: x,
                y: y + size
            },
            bottomRight = {
                x: x + size,
                y: y + size
            };

        // draw container
        rectMode(CORNER);
        stroke('black');
        strokeWeight(2);
        noFill();
        square(x, y, size);

        // draw cells
        for (let i = 1; i < cuts; i++) {
            line(topLeft.x, topLeft.y + cellSize * i, topRight.x, topRight.y + cellSize * i);
        }

        for (let i = 1; i < cuts; i++) {
            line(topLeft.x + cellSize * i, topLeft.y, bottomLeft.x + cellSize * i, bottomLeft.y);
        }

        rectMode(CENTER);
        textSize(50);
        fill('black');

        let cx, cy;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                cx = x + j * cellSize + cellSize / 2;
                cy = y + i * cellSize + cellSize / 2;

                noFill();
                if (this.board[i][j] == 'X') {
                    line(cx - 15, cy - 15, cx + 15, cy + 15);
                    line(cx - 15, cy + 15, cx + 15, cy - 15);
                }

                if (this.board[i][j] == 'O') {
                    circle(cx, cy, 40);
                }
            }
        }
    }
}