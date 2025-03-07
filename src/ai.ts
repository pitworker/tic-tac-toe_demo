import { Token } from "./token";
import { Board } from "./board";

export class AI {
  private board: Board;

  constructor(board: Board) {
    this.board = board;
  }

  place(token: Token.X | Token.O) {
    const nextSquare = this.findNextSquare(token);

    if (nextSquare) {
      try {
        this.board.place(nextSquare, token);
      } catch (_err) {
        throw "AI called on wrong token";
      }
    } else {
      throw "Board is full";
    }
  }

  private findNextSquare(token: Token.X | Token.O) {
    if (this.board.isFull()) return undefined;

    let nextSquare = this.getRandomNextSquare();

    while (
      this.board.getTokenAtPosition(nextSquare).valueOf() !==
      Token.Null.valueOf()
    ) {
      nextSquare = this.getRandomNextSquare();
    }

    return nextSquare;
  }

  private getRandomNextSquare() {
    return {
      row: Math.floor(Math.random() * this.board.height),
      col: Math.floor(Math.random() * this.board.width)
    };
  }
}
