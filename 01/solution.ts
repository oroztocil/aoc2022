import { readFileSync } from "fs";
import { tests } from "./tests";

const sumArray = (arr: number[]): number =>
    arr.reduce((sum, val) => sum + val, 0);

const getSortedLoads = (input: string): number[] => 
    input.split("\n\n")
        .map(x => x.split("\n").map(Number))
        .map(x => sumArray(x))
        .sort((a, b) => b - a);

const alg1 = (input: string): number =>
    getSortedLoads(input)[0];

const alg2 = (input: string): number =>
    sumArray(getSortedLoads(input).slice(0, 3));

type Solution = (input: string) => string | number;

const solutions: Solution[] = [alg1, alg2];

// Run tests
tests.forEach(test => {
    // Read input
    const testInput = readFileSync(test.input, "utf-8").trim();

    // Run solution algorithm
    const testResult = solutions[test.solutionIndex](testInput);

    // Compare expected result
    if (testResult === test.expectedResult) {
        console.log(`Test OK: ${test.input}`);
    } else {
        console.log(`Test FAILED: ${test.input}`);
        console.log(`Expected: ${test.expectedResult}`);
        console.log(`Got: ${testResult}`);
    }
});

const input = readFileSync("input.txt", "utf-8").trim();

const result1 = alg1(input);
console.log(`Part 1: ${result1}`);

const result2 = alg2(input);
console.log(`Part 2: ${result2}`);
