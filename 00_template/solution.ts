import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

const alg1 = (input: string): number => 42;

const alg2 = (input: string): number => 420;

//
// Execution
//

process.exitCode = runTests([
    { solution: alg1, expectedResult: 42 },
    // { solution: alg2, expectedResult: 420 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        // { solution: alg1 },
        // { solution: alg2 },
    ]);
}
