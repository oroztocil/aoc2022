import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

type Move = "rock" | "paper" | "scissors";
type Strat = "draw" | "win" | "lose";

const trans: Record<string, Move> = {
    "A": "rock",
    "B": "paper",
    "C": "scissors",
    "X": "rock",
    "Y": "paper",
    "Z": "scissors"
}

const transStrats: Record<string, Strat> = {
    "X": "lose",
    "Y": "draw",
    "Z": "win"
}

const counterMoves: Record<Move, Record<Strat, Move>> = {
    "rock": { "draw": "rock", "win": "paper", "lose": "scissors" },
    "paper": { "draw": "paper", "win": "scissors", "lose": "rock" },
    "scissors": { "draw": "scissors", "win": "rock", "lose": "paper" },
}

const score: Record<Move, Record<Move, number>> = {
    "rock": { "rock": 4, "paper": 8, "scissors": 3 },
    "paper": { "rock": 1, "paper": 5, "scissors": 9 },
    "scissors": { "rock": 7, "paper": 2, "scissors": 6 },
}

const getStupidMoves = (codes: [string, string]): [Move, Move] =>
    [trans[codes[0]], trans[codes[1]]];

const getBigBrainMoves = (codes: [string, string]): [Move, Move] => {
    const first = trans[codes[0]];
    const second = counterMoves[first][transStrats[codes[1]]];
    return [first, second];
}

type MoveFunc = (codes: [string, string]) => [Move, Move];

const fuckMeUpScotty = (input: string, moveFunc: MoveFunc): number =>
    input
        .trim()
        .split("\n")
        .reduce((total, game) => {
            const [a, b] = moveFunc(game.split(" ") as [string, string]);
            return total + score[a][b];
        }, 0);

//
// Execution
//

process.exitCode = runTests([
    { solution: input => fuckMeUpScotty(input, getStupidMoves), expected: 15 },
    { solution: input => fuckMeUpScotty(input, getBigBrainMoves), expected: 12 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: input => fuckMeUpScotty(input, getStupidMoves) },
        { solution: input => fuckMeUpScotty(input, getBigBrainMoves) },
    ]);
}