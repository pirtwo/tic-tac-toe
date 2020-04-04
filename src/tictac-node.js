export default class TicTacNode {
    constructor({
        board = [],
        player,
        parent = null
    }) {
        this.board = board;
        this.player = player;
        this.parent = parent;
    }

    isTerminal() {
        return this.getWinner() !== null || !this.board.find(r => r.includes(0));
    }

    getValue() {
        if (this.getWinner() == 'X')
            return 1;
        if (this.getWinner() == 'O')
            return -1;
        else return 0;
    }

    getSuccessors() {
        let child,
            successors = [];

        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] == 0) {
                    child = this.clone();
                    child.parent = this;
                    child.board[i][j] = child.player = this.getRival();
                    successors.push(child);
                }
            }
        }

        return successors;
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

    getRival() {
        return this.player == 'X' ? 'O' : 'X';
    }

    clone() {
        return new TicTacNode({
            board: this.board.map(r => r.slice(0)),
            player: this.player,
            parent: this.parent
        });
    }
}