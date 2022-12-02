import { Problem, runProblems, runTests, Test } from "../utils";

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

type MoveFunc =  (codes: [string, string]) => [Move, Move];

const fuckMeUpScotty = (input: string, moveFunc: MoveFunc): number =>
    input.split("\n")
        .reduce((total, game) => {
            const [a, b] = moveFunc(game.split(" ") as [string, string]);
            return total + score[a][b];
        }, 0);

//
// Execution
//

const tests: Test[] = [
    {
        solution: input => fuckMeUpScotty(input, getStupidMoves),
        inputFile: "test.txt",
        expectedResult: 15
    },
    {
        solution: input => fuckMeUpScotty(input, getBigBrainMoves),
        inputFile: "test.txt",
        expectedResult: 12
    }
]

runTests(tests);

const problems: Problem[] = [
    {
        solution: input => fuckMeUpScotty(input, getStupidMoves),
        inputFile: "input.txt",
    },
    {
        solution: input => fuckMeUpScotty(input, getBigBrainMoves),
        inputFile: "input.txt",
    }
]

runProblems(problems);
