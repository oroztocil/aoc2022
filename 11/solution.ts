import { range } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";
import { desc } from "../utils/sort";

//
// Solution
//

type Monke = {
    items: number[];
    op: (item: number) => number;
    divisibility: number;
    trueTarget: number;
    falseTarget: number;
    inspections: number;
}

const parseMonkes = (input: string): Monke[] => {
    const parseOp = (input: string): (item: number) => number => {
        const tokens = input.split(" ");
        const value = tokens[4] !== "old" ? Number(tokens[4]) : null;
        return tokens[3] === "+"
            ? item => item + (value ?? item)
            : item => item * (value ?? item);
    }

    return input
        .trim()
        .split("\n\n")
        .map(block => {
            const params = block
                .split("\n")
                .map(line => line.trim())
                .map(line => line.split(": ")[1]);

            const m: Monke = {
                items: params[1].split(", ").map(Number),
                op: parseOp(params[2]),
                divisibility: Number(params[3].split(" ")[2]),
                trueTarget: Number(params[4].split(" ")[3]),
                falseTarget: Number(params[5].split(" ")[3]),
                inspections: 0
            };

            return m;
        });
};

const round = (monkes: Monke[], multiple: number, selfCare: number = 1) => {
    monkes.forEach(monke => {
        monke.inspections += monke.items.length;
        monke.items.forEach(item => {
            const newValue = Math.floor(monke.op(item) / selfCare) % multiple;
            const target = newValue % monke.divisibility === 0
                ? monke.trueTarget : monke.falseTarget;
            monkes[target].items.push(newValue);
        });
        monke.items = [];
    });
}

const getInspectionCounts = (
    input: string,
    rounds: number,
    selfCare: number): number[] => {
    const monkes = parseMonkes(input);
    const multiple = monkes
        .map(m => m.divisibility)
        .reduce((acc, d) => acc * d, 1);

    range(1, rounds).forEach(() => round(monkes, multiple, selfCare));

    return monkes.map(m => m.inspections).sort(desc);
}

const smallOomf = (input: string): number => {
    const [first, second] = getInspectionCounts(input, 20, 3);
    return first * second;
}

const bigOoomf = (input: string): bigint => {
    const [first, second] = getInspectionCounts(input, 10000, 1);
    return BigInt(first) * BigInt(second);
}

//
// Execution
//

process.exitCode = runTests([
    { solution: smallOomf, expectedResult: 10605 },
    { solution: bigOoomf, expectedResult: 2713310158n },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: smallOomf },
        { solution: bigOoomf },
    ]);
}
