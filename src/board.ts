import { Token } from "./token";

const BOARD_SIZE = 3;

export class Board {
  private boardSize: number = BOARD_SIZE;
  private board: Token[];
  private turn: Token.X | Token.O;

  constructor() {
    this.board = Array(this.boardSize * this.boardSize).fill(Token.Null);
    this.turn = Token.X;
  }

  place(position: { row: number, col: number }, token: Token) {
    if (
      token.valueOf() === this.turn.valueOf() &&
      this.getTokenAtPosition(position).valueOf() === Token.Null.valueOf()
    ) {
      this.board[this.getIndexFromPosition(position)] = token;
      this.toggleTurn();
    } else {
      throw "Invalid placement";
    }
  }

  getTokenAtPosition(position: { row: number, col: number }) {
    const index = this.getIndexFromPosition(position);

    if (index >= 0) return this.board[index];
    else return Token.Err;
  }

  private getIndexFromPosition(position: { row: number, col: number }) {
    if (
      position.row >= 0 &&
      position.row < this.boardSize &&
      position.col >= 0 &&
      position.col < this.boardSize
    ) {
      return (
        Math.floor(position.col) + this.boardSize * Math.floor(position.row)
      );
    } else {
      return -1;
    }
  }

  print() {
    let boardString = "    A   B   C\n  ┌───┬───┬───┐\n";

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const tokenString = this.getTokenAtPosition({ row, col }).valueOf();

        const startString = col === 0 ? `${row + 1} │` : "│";
        const endString = col < this.width - 1 ? "" : "│\n";

        boardString += `${startString} ${tokenString} ${endString}`;
      }
      if (row < this.height - 1) {
        boardString += "  ├───┼───┼───┤\n";
      } else {
        boardString += "  └───┴───┴───┘";
      }
    }

    console.log(boardString);
  }

  private toggleTurn() {
    let newTurn = this.turn;
    switch (this.turn) {
      case Token.X:
        newTurn = Token.O;
        break;
      case Token.O:
        newTurn = Token.X;
        break;
      default:
        throw "Turn is in invalid state";
        break;
    }
    this.turn = newTurn;
  }

  tokenIsInRow(token: Token.X | Token.O) {
    const playerToken = token.valueOf();

    // check columns
    for (let col = 0; col < this.width; col++) {
      let playerHasCol = true;
      for (let row = 0; row < this.height; row++) {
        const boardToken =
          this.getTokenAtPosition({ row, col }).valueOf();
        if (boardToken !== playerToken) {
          playerHasCol = false;
        }
      }
      if (playerHasCol) return true;
    }

    // check rows
    for (let row = 0; row < this.height; row++) {
      let playerHasRow = true;
      for (let col = 0; col < this.width; col++) {
        const boardToken =
          this.getTokenAtPosition({ row, col }).valueOf();
        if (boardToken !== playerToken) {
          playerHasRow = false;
        }
      }
      if (playerHasRow) return true;
    }

    // check diagonals
    const diagTokens = {
      center: this.getTokenAtPosition({ row: 1, col: 1 }).valueOf(),
      topLeft: this.getTokenAtPosition({ row: 0, col: 0 }).valueOf(),
      topRight: this.getTokenAtPosition({ row: 0, col: 2 }).valueOf(),
      bottomLeft: this.getTokenAtPosition({ row: 2, col: 0 }).valueOf(),
      bottomRight: this.getTokenAtPosition({ row: 2, col: 2 }).valueOf()
    };

    if (diagTokens.center === playerToken && (
      (
        diagTokens.topLeft === playerToken &&
        diagTokens.bottomRight === playerToken
      ) || (
        diagTokens.topRight === playerToken &&
        diagTokens.bottomLeft === playerToken
      )
    )) {
      return true;
    }

    return false;
  }

  isFull() {
    const emptyToken = Token.Null.valueOf();

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const boardToken =
          this.getTokenAtPosition({ row, col }).valueOf();

        if (boardToken === emptyToken) return false;
      }
    }

    return true;
  }

  get width() {
    return this.boardSize;
  }

  get height() {
    return this.boardSize;
  }

  get nextPlayer() {
    return this.turn;
  }
}
