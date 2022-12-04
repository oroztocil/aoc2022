import { Problem, runProblems, runTests, Test } from "../utils/execution";

//
// Solution
//

const alg1 = (input: string): number => 42;

const alg2 = (input: string): number => 420;

//
// Execution
//

const tests: Test[] = [
    {
        solution: alg1,
        inputFile: "test.txt",
        expectedResult: 42
    },
    {
        solution: alg2,
        inputFile: "test.txt",
        expectedResult: 420
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
