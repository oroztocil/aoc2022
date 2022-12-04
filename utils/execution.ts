import { readFileSync } from "fs";

const DEFAULT_TEST_INPUT = "test.txt";
const DEFAULT_PROBLEM_INPUT = "input.txt";

export type Problem = {
    solution: (input: string) => string | number,
    inputFile?: string,
}

export type Test = Problem & {
    expectedResult: string | number
};

export const runProblems = (problems: Problem[]) => {
    problems.forEach((problem, index) => {
        const input = readFileSync(problem.inputFile ?? DEFAULT_PROBLEM_INPUT, "utf-8").trim();
        const result = problem.solution(input);

        console.log(`Result ${index + 1}: ${result}`)
    });   
}

export const runTests = (tests: Test[]): number => {
    let resultCode = 0;

    tests.forEach((test, index) => {
        const input = readFileSync(test.inputFile ?? DEFAULT_TEST_INPUT, "utf-8").trim();
        const result = test.solution(input);
    
        if (result === test.expectedResult) {
            console.log(`Test ${index + 1} OK.`);
        } else {
            console.log(`Test ${index + 1} FAILED. Expected: ${test.expectedResult}. Got: ${result}.`);
            resultCode = 1;
        }
    });

    return resultCode;
}
