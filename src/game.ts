import { Token } from "./token";
import { EndState } from "./end-state";
import { Board } from "./board";
import { Terminal } from "./terminal";
import { AI } from "./ai";

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

const parseMode = (inputRaw: string) => {
  const input = inputRaw.replace(/\s+/g, "").toLowerCase();

  if (input === "1") return 1;
  else if (input === "2") return 2;
  else if (input === "one") return 1;
  else if (input === "two") return 2;

  return NaN;
}

export class Game {
  private board: Board;
  private terminal: Terminal;
  private ai: AI;
  private playerMode: number = NaN;

  constructor() {
    this.terminal = new Terminal();
    this.board = new Board();
    this.ai = new AI(this.board);
  }

  start() {
    this.promptMode();
  }

  private promptMode() {
    const handleUserInput = (userInput: string) => {
      const parsedInput = parseMode(userInput);

      if (!isNaN(parsedInput)) {
        this.playerMode = parsedInput;
        this.board.print();
        this.promptTurn();
      } else {
        this.promptModeError();
      }
    }

    const handleInputError = (_err: any) => {
      this.promptModeError();
    };

    this.terminal
      .question("How many players?\n")
      .then(handleUserInput)
      .catch(handleInputError);
  }

  private promptModeError() {
    console.log("Invalid number of players. Please enter 1 or 2.");
    this.promptMode();
  }

  private promptError() {
    console.log("Invalid placement. Please try again.");
    this.promptTurn();
  }

  private nextTurn() {
    const nextPlayer = this.board.nextPlayer.valueOf() === Token.X ? 1 : 2;

    if (this.playerMode === 1 && nextPlayer === 2) {
      console.log("AI is placing token...");
      this.ai.place(Token.O);
      this.board.print();
      if (!this.handleGameOver(nextPlayer)) this.nextTurn();
    } else {
      this.promptTurn();
    }
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

          if (!this.handleGameOver(nextPlayer)) this.nextTurn();
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

  private handleGameOver(nextPlayer: 1 | 2) {
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
      return false;
    }

    return true;
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
}
