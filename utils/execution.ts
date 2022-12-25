import { readFileSync } from "fs";

const DEFAULT_TEST_INPUT = "test.txt";
const DEFAULT_PROBLEM_INPUT = "input.txt";

export type Problem = {
    solution: (input: string) => string | number | bigint,
    inputFile?: string,
    input?: string
}

export type Test = Problem & {
    expected: string | number | bigint
};

export const runProblems = (problems: Problem[]) => {
    problems.forEach((problem, index) => {
        const input = problem.input ?? readFileSync(problem.inputFile ?? DEFAULT_PROBLEM_INPUT, "utf-8");
        console.time(`Result ${index + 1}`);
        const result = problem.solution(input);
        console.timeEnd(`Result ${index + 1}`);

        console.log(`Result ${index + 1}:\n${result}`)
    });   
}

export const runTests = (tests: Test[]): number => {
    let resultCode = 0;

    tests.forEach((test, index) => {
        const input = test.input ?? readFileSync(test.inputFile ?? DEFAULT_TEST_INPUT, "utf-8");
        const result = test.solution(input);
        if (result === test.expected) {
            console.log(`Test ${index + 1} OK.`);
        } else {
            console.log(`Test ${index + 1} FAILED. Expected:\n${test.expected}\nGot:\n${result}`);
            resultCode = 1;
        }
    });

    return resultCode;
}
