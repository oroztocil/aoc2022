import { sumArray } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

const snafuToDecimal = (snafu: string): number => {
    const digits = snafu.split("");
    const result = digits.reduceRight((acc, c) => {
        if (c === "=") {
            return {
                value: acc.value - 2 * acc.order,
                order: acc.order * 5
            };
        } else if (c === "-") {
            return {
                value: acc.value - acc.order,
                order: acc.order * 5
            };
        } else {
            return {
                value: acc.value + Number(c) * acc.order,
                order: acc.order * 5
            };
        }
    }, { value: 0, order: 1 });

    return result.value;
}

export const decimalToSnafu = (d: number): string => {
    let result = "";
    let carry = 0;

    while (d > 0) {
        const remainder = d % 5;
        if (remainder === 3) {
            result = "=" + result;
            carry = 1;
        } else if (remainder === 4) {
            result = "-" + result;
            carry = 1;
        } else {
            result = remainder + result;
            carry = 0;
        }
        d = Math.floor(d / 5) + carry;
    }

    return result;
}

const nowWeFloat = (input: string): string => {
    const decimals = input
        .trim()
        .split("\n")
        .map(line => snafuToDecimal(line));
    const sum = sumArray(decimals);
    return decimalToSnafu(sum);
}

//
// Execution
//

process.exitCode = runTests([
    { solution: () => decimalToSnafu(1), expected: "1" },
    { solution: () => decimalToSnafu(2), expected: "2" },
    { solution: () => decimalToSnafu(3), expected: "1=" },
    { solution: () => decimalToSnafu(4), expected: "1-" },
    { solution: () => decimalToSnafu(5), expected: "10" },
    { solution: () => decimalToSnafu(6), expected: "11" },
    { solution: () => decimalToSnafu(7), expected: "12" },
    { solution: () => decimalToSnafu(8), expected: "2=" },
    { solution: () => decimalToSnafu(9), expected: "2-" },
    { solution: () => decimalToSnafu(10), expected: "20" },
    { solution: () => decimalToSnafu(15), expected: "1=0" },
    { solution: () => decimalToSnafu(20), expected: "1-0" },
    { solution: () => decimalToSnafu(2022), expected: "1=11-2" },
    { solution: () => decimalToSnafu(12345), expected: "1-0---0" },
    { solution: () => decimalToSnafu(314159265), expected: "1121-1110-1=0" },
    { solution: () => snafuToDecimal("1"), expected: 1 },
    { solution: () => snafuToDecimal("2"), expected: 2 },
    { solution: () => snafuToDecimal("1="), expected: 3 },
    { solution: () => snafuToDecimal("1-"), expected: 4 },
    { solution: () => snafuToDecimal("10"), expected: 5 },
    { solution: () => snafuToDecimal("11"), expected: 6 },
    { solution: () => snafuToDecimal("12"), expected: 7 },
    { solution: () => snafuToDecimal("2="), expected: 8 },
    { solution: () => snafuToDecimal("2-"), expected: 9 },
    { solution: () => snafuToDecimal("20"), expected: 10 },
    { solution: () => snafuToDecimal("1=0"), expected: 15 },
    { solution: () => snafuToDecimal("1-0"), expected: 20 },
    { solution: () => snafuToDecimal("1=11-2"), expected: 2022 },
    { solution: () => snafuToDecimal("1-0---0"), expected: 12345 },
    { solution: () => snafuToDecimal("1121-1110-1=0"), expected: 314159265 },
    { solution: nowWeFloat, expected: "2=-1=0" },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: nowWeFloat },
    ]);
}
