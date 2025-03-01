import { Token } from "./token";
import { Board } from "./board";
import { Terminal } from "./terminal";

const parseInput = (inputRaw: string) => {
  const input = inputRaw.replace(/\s+/g, "").toLowerCase();

  const col = input.includes("a") ? 0 :
    input.includes("b") ? 1 :
      input.includes("c") ? 2 :
        -1;

  const row = input.includes("1") ? 0 :
    input.includes("2") ? 1 :
      input.includes("3") ? 2 :
        -1;

  if (input.length === 2 && row >= 0 && row >= 0) {
    return { row, col };
  } else {
    return undefined;
  }
};

export class Game {
  private board: Board;
  private terminal: Terminal;

  constructor() {
    this.terminal = new Terminal();
    this.board = new Board();
  }

  start() {
    this.board.print();
    this.promptTurn();
  }

  private promptError() {
    console.log("Invalid placement. Please try again.");
    this.promptTurn();
  }

  private promptTurn() {
    const nextPlayer = this.board.nextPlayer.valueOf() === Token.X ? 1 : 2;
    const prompt = `Player ${nextPlayer}, place your token\n`;

    const handleUserInput = (userInput: string) => {
      const parsedInput = parseInput(userInput);
      if (parsedInput) {
        try {
          this.board.place(parsedInput, this.board.nextPlayer);
          this.board.print();
          if (this.checkIfPlayerWon(nextPlayer)) {
            console.log(`Player ${nextPlayer} won`);
          } else {
            this.promptTurn();
          }
        } catch (err) {
          this.promptError();
        }
      } else {
        this.promptError();
      }
    };

    const handleInputError = (_err: any) => {
      this.promptError();
    };

    this.terminal
      .question(prompt)
      .then(handleUserInput)
      .catch(handleInputError);
  }

  private checkIfPlayerWon(player: 1 | 2) {
    const playerToken = (player === 1 ? Token.X : Token.O).valueOf();

    // check columns
    for (let col = 0; col < this.board.width; col++) {
      let playerHasCol = true;
      for (let row = 0; row < this.board.height; row++) {
        const boardToken =
          this.board.getTokenAtPosition({ row, col }).valueOf();
        if (boardToken !== playerToken) {
          playerHasCol = false;
        }
      }
      if (playerHasCol) return true;
    }

    // check rows
    for (let row = 0; row < this.board.height; row++) {
      let playerHasRow = true;
      for (let col = 0; col < this.board.width; col++) {
        const boardToken =
          this.board.getTokenAtPosition({ row, col }).valueOf();
        if (boardToken !== playerToken) {
          playerHasRow = false;
        }
      }
      if (playerHasRow) return true;
    }

    // check diagonals
    const diagTokens = {
      center: this.board.getTokenAtPosition({ row: 1, col: 1 }).valueOf(),
      topLeft: this.board.getTokenAtPosition({ row: 0, col: 0 }).valueOf(),
      topRight: this.board.getTokenAtPosition({ row: 0, col: 2 }).valueOf(),
      bottomLeft: this.board.getTokenAtPosition({ row: 2, col: 0 }).valueOf(),
      bottomRight: this.board.getTokenAtPosition({ row: 2, col: 2 }).valueOf()
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
}
