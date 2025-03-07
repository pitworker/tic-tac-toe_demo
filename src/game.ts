import { Token } from "./token";
import { EndState } from "./end-state";
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

          const gameStatus = this.getStatus();
          const nextPlayerWon = nextPlayer === 1 ?
            EndState.Player1Won.valueOf() :
            EndState.Player2Won.valueOf();

          if (
            gameStatus.isOver &&
            gameStatus.endState.valueOf() === nextPlayerWon
          ) {
            console.log(`Player ${nextPlayer} won`);
          } else if (
            gameStatus.isOver &&
            gameStatus.endState.valueOf() === EndState.PlayersTied.valueOf()
          ) {
            console.log("The game ended in a draw");
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

  getStatus() {
    if (this.board.tokenIsInRow(Token.X)) {
      return {
        isOver: true,
        endState: EndState.Player1Won
      };
    } else if (this.board.tokenIsInRow(Token.O)) {
      return {
        isOver: true,
        endState: EndState.Player2Won
      };
    } else if (this.board.isFull()) {
      return {
        isOver: true,
        endState: EndState.PlayersTied
      };
    }

    return {
      isOver: false,
      endState: EndState.Unfinished
    };
  }

  /*
  private playerHasWon(player: 1 | 2) {
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

  private gameIsDraw() {
    const emptyToken = Token.Null.valueOf();

    for (let row = 0; row < this.board.height; row++) {
      for (let col = 0; col < this.board.width; col++) {
        const boardToken =
          this.board.getTokenAtPosition({ row, col }).valueOf();

        if (boardToken === emptyToken) return false;
      }
    }

    return true;
  }
  */
}
