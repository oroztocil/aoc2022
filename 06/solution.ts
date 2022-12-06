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
    { solution: dontAteElves, input: "mjqjpqmgbljsphdztnvjfqwrcgsmlb", expectedResult: 7 },
    { solution: dontAteElves, input: "bvwbjplbgvbhsrlpgdmjqwftvncz", expectedResult: 5 },
    { solution: dontAteElves, input: "nppdvjthqldpwncqszvftbrmjlhg", expectedResult: 6 },
    { solution: dontAteElves, input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", expectedResult: 10 },
    { solution: dontAteElves, input: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", expectedResult: 11 },
    { solution: justDontLikeEm, input: "mjqjpqmgbljsphdztnvjfqwrcgsmlb", expectedResult: 19 },
    { solution: justDontLikeEm, input: "bvwbjplbgvbhsrlpgdmjqwftvncz", expectedResult: 23 },
    { solution: justDontLikeEm, input: "nppdvjthqldpwncqszvftbrmjlhg", expectedResult: 23 },
    { solution: justDontLikeEm, input: "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", expectedResult: 29 },
    { solution: justDontLikeEm, input: "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", expectedResult: 26 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: dontAteElves },
        { solution: justDontLikeEm },
    ]);
}
