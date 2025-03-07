# Tic-Tac-Toe

This is a game of Tic-Tac-Toe implemented in TypeScript that runs on the command line in NodeJS.

## To Play

Each player takes turns inputting the coordinates to place their tokens. Columns are labelled with letters A to C, and rows are labelled with numbers 1 to 3. Input parsing is not case or order sensitive and ignores whitespace. To place a token in column A and row 3, for example, the player could input `A3`, `a3`, `3A`, `3a`, or `3    a`.

## Build and Run Scripts

To build: `yarn build`

To run: `yarn start`

To build and run: `yarn dev`

## Node Version

This app was tested in Node version `22.11.0` and Yarn version `1.22.19`

## TODO

1. Add a simple AI (random placement) that can act as player 2

2. Add option to select 1 or 2 player mode

3. Improve the AI (minimax)