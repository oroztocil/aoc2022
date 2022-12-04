import { splitArray } from "../utils/arrays";
import { Problem, runProblems, runTests, Test } from "../utils/execution";
import { intersect } from "../utils/sets";

//
// Solution
//

const parseSack = (input: string): number[] =>
    input.split("").map(parseItem);

const parseItem = (char: string): number => {
    const code = char.charCodeAt(0);
    return code - (code >= 96 ? 96 : 38);
}

const splitCompartments = (items: number[]): [Set<number>, Set<number>] => {
    return [
        new Set(items.slice(0, items.length / 2)),
        new Set(items.slice(items.length / 2))
    ];
}

const notDoingBitwiseStuff = (input: string): number =>
    input.split("\n")
        .map(parseSack)
        .map(splitCompartments)
        .reduce((sum, sackCompartments) => sum + intersect(sackCompartments)[0], 0);

const inJavascriptBruh = (input: string): number => {
    const lines = input.split("\n")
    const sacks = lines.map(items => new Set<number>(parseSack(items)));
    const groupSacks = splitArray(sacks, 3);
    return groupSacks.reduce((sum, group) => sum + intersect(group)[0], 0);
}

//
// Execution
//

const tests: Test[] = [
    {
        solution: notDoingBitwiseStuff,
        inputFile: "test.txt",
        expectedResult: 157
    },
    {
        solution: inJavascriptBruh,
        inputFile: "test.txt",
        expectedResult: 70
    }
]

runTests(tests);

const problems: Problem[] = [
    {
        solution: notDoingBitwiseStuff,
        inputFile: "input.txt",
    },
    {
        solution: inJavascriptBruh,
        inputFile: "input.txt",
    }
]

runProblems(problems);
