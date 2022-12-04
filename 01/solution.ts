import { sumArray } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";
import { desc } from "../utils/sort";

//
// Solution
//

const getSortedLoads = (input: string): number[] =>
    input.split("\n\n")
        .map(x => x.split("\n").map(Number))
        .map(x => sumArray(x))
        .sort(desc);

const alg1 = (input: string): number =>
    getSortedLoads(input)[0];

const alg2 = (input: string): number =>
    sumArray(getSortedLoads(input).slice(0, 3));

//
// Execution
//

process.exitCode = runTests([
    { solution: alg1, expectedResult: 24000 },
    { solution: alg2, expectedResult: 45000 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: alg1 },
        { solution: alg2 },
    ]);
}
