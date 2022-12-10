import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

const getRegisterChanges = (input: string): number[] =>
    input
        .trim()
        .split("\n")
        .flatMap(line => {
            const [name, arg] = line.split(" ");
            switch (name) {
                case "noop": return [0];
                case "addx": return [0, Number(arg)];
                default: throw new Error("Sus instruction detected");
            }
        });

const doYouSeeCirclingThrough = (input: string): number => {
    const changes = getRegisterChanges(input);

    const result = changes.reduce(({ reg, signalSum }, change, cycle) => {
        if ((cycle - 20 + 1) % 40 === 0) {
            return {
                reg: reg + change,
                signalSum: signalSum + (cycle + 1) * (reg)
            };
        } else {
            return { reg: reg + change, signalSum: signalSum };
        }
    }, { reg: 1, signalSum: 0 });

    return result.signalSum;
}

const thatsHowOneReturnsFromTwo = (input: string): string => {
    const changes = getRegisterChanges(input);

    const result = changes.reduce(({ reg, screen }, change, cycle) => {
        const newReg = reg + change;
        const newScreen = screen
            + ((cycle % 40 >= reg - 1 && cycle % 40 <= reg + 1) ? "#" : ".")
            + (((cycle + 1) % 40 === 0) ? "\n" : "");
        return { reg: newReg, screen: newScreen };
    }, { reg: 1, screen: "" });

    return result.screen;
}

//
// Execution
//

process.exitCode = runTests([
    { solution: doYouSeeCirclingThrough, expectedResult: 13140 },
    {
        solution: thatsHowOneReturnsFromTwo, expectedResult:
            "##..##..##..##..##..##..##..##..##..##..\n" +
            "###...###...###...###...###...###...###.\n" +
            "####....####....####....####....####....\n" +
            "#####.....#####.....#####.....#####.....\n" +
            "######......######......######......####\n" +
            "#######.......#######.......#######.....\n"
    },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: doYouSeeCirclingThrough },
        { solution: thatsHowOneReturnsFromTwo },
    ]);
}
