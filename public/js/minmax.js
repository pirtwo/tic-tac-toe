function minmax(node, depth, currentPlayer = 'max') {
    let value;

    if (depth == 0 || node.isTerminal()) {
        return node.getValue() * (depth + 1);
    }

    if (currentPlayer == 'max') {
        value = -Infinity;
        node.getSuccessors().forEach(child => {
            value = max(value, minmax(child, depth - 1, 'min'));
        });
    }

    if (currentPlayer == 'min') {
        value = Infinity;
        node.getSuccessors().forEach(child => {
            value = min(value, minmax(child, depth - 1, 'max'));
        });
    }

    return value;
}

class TicTacNode {
    constructor({
        board = [],
        player,
        parent = null,
        depth = 0
    }) {
        this.board = board;
        this.player = player;
        this.parent = parent;
        this.depth = depth;
    }

    getValue() {
        let winner = this.getWinner();

        if (winner == 'X')
            return 1;
        else if (winner == 'O')
            return -1;
        else {
            let score = 0;
            let player = this.player == 'X' ? 'O' : 'X';

            // middele
            score += this.board[1][1] == player ? 0.2 : 0;

            // corners
            score += this.board[0][0] == player ? 0.15 : 0;
            score += this.board[0][2] == player ? 0.15 : 0;
            score += this.board[2][0] == player ? 0.15 : 0;
            score += this.board[2][2] == player ? 0.15 : 0;

            // other cells
            score += this.board[0][1] == player ? 0.05 : 0;
            score += this.board[1][0] == player ? 0.05 : 0;
            score += this.board[1][2] == player ? 0.05 : 0;
            score += this.board[2][1] == player ? 0.05 : 0;

            return player == 'X' ? score : -score;
        }
    }

    getSuccessors() {
        let child,
            successors = [];

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] == 0) {
                    child = this.clone();
                    child.parent = this;
                    child.player = this.player == 'X' ? 'O' : 'X';
                    child.depth = this.depth + 1;
                    child.board[i][j] = this.player;
                    successors.push(child);
                }
            }
        }

        return successors;
    }

    isTerminal() {
        return this.getWinner() !== null;
    }

    getWinner() {
        let xWins =
            (this.board[0][0] == 'X' && this.board[0][1] == 'X' && this.board[0][2] == 'X') ||
            (this.board[1][0] == 'X' && this.board[1][1] == 'X' && this.board[1][2] == 'X') ||
            (this.board[2][0] == 'X' && this.board[2][1] == 'X' && this.board[2][2] == 'X') ||
            (this.board[0][0] == 'X' && this.board[1][0] == 'X' && this.board[2][0] == 'X') ||
            (this.board[0][1] == 'X' && this.board[1][1] == 'X' && this.board[2][1] == 'X') ||
            (this.board[0][2] == 'X' && this.board[1][2] == 'X' && this.board[2][2] == 'X') ||
            (this.board[0][0] == 'X' && this.board[1][1] == 'X' && this.board[2][2] == 'X') ||
            (this.board[0][2] == 'X' && this.board[1][1] == 'X' && this.board[2][0] == 'X');

        let oWins =
            (this.board[0][0] == 'O' && this.board[0][1] == 'O' && this.board[0][2] == 'O') ||
            (this.board[1][0] == 'O' && this.board[1][1] == 'O' && this.board[1][2] == 'O') ||
            (this.board[2][0] == 'O' && this.board[2][1] == 'O' && this.board[2][2] == 'O') ||
            (this.board[0][0] == 'O' && this.board[1][0] == 'O' && this.board[2][0] == 'O') ||
            (this.board[0][1] == 'O' && this.board[1][1] == 'O' && this.board[2][1] == 'O') ||
            (this.board[0][2] == 'O' && this.board[1][2] == 'O' && this.board[2][2] == 'O') ||
            (this.board[0][0] == 'O' && this.board[1][1] == 'O' && this.board[2][2] == 'O') ||
            (this.board[0][2] == 'O' && this.board[1][1] == 'O' && this.board[2][0] == 'O');

        if (xWins) return 'X';
        if (oWins) return 'O';
        return null;
    }

    clone() {
        let newBoard = [];
        this.board.forEach(row => newBoard.push(row.slice()));
        return new TicTacNode({
            board: newBoard,
            player: this.player,
            parent: this.parent,
            depth: this.depth
        });
    }
}