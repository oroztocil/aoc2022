import { Problem, runProblems, runTests, Test } from "../utils/execution";
import { Interval } from "../utils/intervals";

//
// Solution
//

const parseAssignmentPairs = (input: string): [Interval, Interval][] =>
    input.split("\n")
        .map(line => {
            const pair = line.split(",");
            const assignments = pair.map(assignment => {
                const bounds = assignment.split("-").map(Number);
                return new Interval(bounds[0], bounds[1]);
            });
            return [assignments[0], assignments[1]];
        });

const allTheseElvesDrinkingLoversSpit = (input: string): number =>
    parseAssignmentPairs(input)
        .filter(Interval.overlapsWholeHog)
        .length;

const swallowingWordsWhileGivingHead = (input: string): number =>
    parseAssignmentPairs(input)
        .filter(Interval.overlaps)
        .length;

//
// Execution
//

const tests: Test[] = [
    {
        solution: allTheseElvesDrinkingLoversSpit,
        inputFile: "test.txt",
        expectedResult: 2
    },
    {
        solution: swallowingWordsWhileGivingHead,
        inputFile: "test.txt",
        expectedResult: 4
    }
]

runTests(tests);

const problems: Problem[] = [
    {
        solution: allTheseElvesDrinkingLoversSpit,
        inputFile: "input.txt",
    },
    {
        solution: swallowingWordsWhileGivingHead,
        inputFile: "input.txt",
    }
]

runProblems(problems);
