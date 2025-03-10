import * as readline from "node:readline/promises";

export class Terminal {
  private terminalInterface: readline.Interface | null = null;

  constructor() {
    this.terminalInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  question(questionString: string) {
    return this.terminalInterface!.question(questionString);
  }
}
