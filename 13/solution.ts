import { chunkArray } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

type PacketElement = number | Packet;
type Packet = PacketElement[];
type Order = boolean | "whoknows";

const parseInput = (input: string): Packet[] =>
    input
        .trim()
        .replaceAll("\n\n", "\n")
        .split("\n")
        .map(x => eval(x));

const checkArrayOrder = ([left, right]: [Packet, Packet]): Order => {
    const checkElementOrder = (l: PacketElement, r: PacketElement): Order => {
        switch (typeof l) {
            case "number":
                switch (typeof r) {
                    case "number": return l === r ? "whoknows" : l < r;
                    case "object": return checkArrayOrder([[l], r]);
                    case "undefined": return false;
                }
            case "object":
                switch (typeof r) {
                    case "number": return checkArrayOrder([l, [r]]);
                    case "object": return checkArrayOrder([l, r]);
                    case "undefined": return false;
                }
            case "undefined":
                return typeof r === "undefined" ? "whoknows" : true;
        }
    }

    for (let i = 0; i < Math.max(left.length, right.length); i++) {
        const [l, r] = [left[i], right[i]];
        const result = checkElementOrder(l, r);

        if (typeof result === "boolean") {
            return result;
        }
    }

    return "whoknows";
}

const evaluateOrDie = (input: string): number => {
    const packets = parseInput(input);
    const pairs = chunkArray(packets, 2) as [Packet, Packet][];
    return pairs
        .map(checkArrayOrder)
        .reduce((acc, isRight, index) => isRight ? acc + index + 1 : acc, 0);
}

const eatHotChipAndLie = (input: string): number => {
    const packets = parseInput(input);
    const [divA, divB] = [[[2]], [[6]]];
    packets.push(divA, divB);
    packets.sort((a, b) => checkArrayOrder([a, b]) ? -1 : 1);
    return (packets.indexOf(divA) + 1) * (packets.indexOf(divB) + 1);
}

//
// Execution
//

process.exitCode = runTests([
    { solution: evaluateOrDie, expectedResult: 13 },
    { solution: eatHotChipAndLie, expectedResult: 140 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: evaluateOrDie },
        { solution: eatHotChipAndLie },
    ]);
}
