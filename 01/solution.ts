import { desc, sumArray } from "../utils/arrays";
import { Problem, runProblems, runTests, Test } from "../utils/execution";

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

const tests: Test[] = [
    {
        solution: alg1,
        inputFile: "test.txt",
        expectedResult: 24000
    },
    {
        solution: alg2,
        inputFile: "test.txt",
        expectedResult: 45000
    }
]

runTests(tests);

const problems: Problem[] = [
    {
        solution: alg1,
        inputFile: "input.txt",
    },
    {
        solution: alg2,
        inputFile: "input.txt",
    }
]

runProblems(problems);
