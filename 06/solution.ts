import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

const hasDistinctChars = (str: string): boolean =>
    str.length === (new Set(str)).size;

const getDistinctSubstringEnd = (str: string, subLength: number): number =>
    subLength + Array(str.length - subLength + 1).findIndex((_, index) =>
        hasDistinctChars(str.slice(index, index + subLength)));

const dontAteElves = (input: string): number =>
    getDistinctSubstringEnd(input, 4);

const justDontLikeEm = (input: string): number =>
    getDistinctSubstringEnd(input, 14);

//
// Execution
//

process.exitCode = runTests([
    { solution: dontAteElves, input: "mjqjpqmgbljsphdztnvjfqwrcgsmlb", expected: 7 },
    { solution: dontAteElves, input: "bvwbjplbgvbhsrlpgdmjqwftvncz", expected: 5 },
    { solution: dontAteElves, input: "nppdvjthqldpwncqszvftbrmjlhg", expected: 6 },
    { solution: dontAteElves, input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", expected: 10 },
    { solution: dontAteElves, input: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", expected: 11 },
    { solution: justDontLikeEm, input: "mjqjpqmgbljsphdztnvjfqwrcgsmlb", expected: 19 },
    { solution: justDontLikeEm, input: "bvwbjplbgvbhsrlpgdmjqwftvncz", expected: 23 },
    { solution: justDontLikeEm, input: "nppdvjthqldpwncqszvftbrmjlhg", expected: 23 },
    { solution: justDontLikeEm, input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", expected: 29 },
    { solution: justDontLikeEm, input: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", expected: 26 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: dontAteElves },
        { solution: justDontLikeEm },
    ]);
}
