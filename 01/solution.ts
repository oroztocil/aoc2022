import { readFileSync } from "fs";
import { tests } from "./tests";

function alg1(input: string): number {
    let maxSum = 0;
    let currentSum = 0;

    input.split("\n").forEach(line => {
        if (line === "") {
            if (currentSum > maxSum) {
                maxSum = currentSum;
            }

            currentSum = 0;
        } else {
            currentSum += Number(line);
        }
    });

    return maxSum;
}

function sumArray(arr: number[]): number {
    return arr.reduce((sum, val) => sum + val, 0);
}

function alg2(input: string): number {
    const elfItems = input.split("\n\n").map(x => x.split("\n").map(y => Number(y)));
    const elfLoads = elfItems.map(x => sumArray(x));
    const biggestLoads = elfLoads.sort((a, b) => b - a);
    
    return sumArray(biggestLoads.slice(0, 3));
}

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
