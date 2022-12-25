import { runProblems, runTests } from "../utils/execution";
import { Interval } from "../utils/intervals";

//
// Solution
//

const parseAssignmentPairs = (input: string): [Interval, Interval][] =>
    input
        .trim()
        .split("\n")
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

process.exitCode = runTests([
    { solution: allTheseElvesDrinkingLoversSpit, expected: 2 },
    { solution: swallowingWordsWhileGivingHead, expected: 4 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: allTheseElvesDrinkingLoversSpit },
        { solution: swallowingWordsWhileGivingHead },
    ]);
}
