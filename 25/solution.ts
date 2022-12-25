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
    { solution: () => decimalToSnafu(1), expectedResult: "1" },
    { solution: () => decimalToSnafu(2), expectedResult: "2" },
    { solution: () => decimalToSnafu(3), expectedResult: "1=" },
    { solution: () => decimalToSnafu(4), expectedResult: "1-" },
    { solution: () => decimalToSnafu(5), expectedResult: "10" },
    { solution: () => decimalToSnafu(6), expectedResult: "11" },
    { solution: () => decimalToSnafu(7), expectedResult: "12" },
    { solution: () => decimalToSnafu(8), expectedResult: "2=" },
    { solution: () => decimalToSnafu(9), expectedResult: "2-" },
    { solution: () => decimalToSnafu(10), expectedResult: "20" },
    { solution: () => decimalToSnafu(15), expectedResult: "1=0" },
    { solution: () => decimalToSnafu(20), expectedResult: "1-0" },
    { solution: () => decimalToSnafu(2022), expectedResult: "1=11-2" },
    { solution: () => decimalToSnafu(12345), expectedResult: "1-0---0" },
    { solution: () => decimalToSnafu(314159265), expectedResult: "1121-1110-1=0" },
    { solution: () => snafuToDecimal("1"), expectedResult: 1 },
    { solution: () => snafuToDecimal("2"), expectedResult: 2 },
    { solution: () => snafuToDecimal("1="), expectedResult: 3 },
    { solution: () => snafuToDecimal("1-"), expectedResult: 4 },
    { solution: () => snafuToDecimal("10"), expectedResult: 5 },
    { solution: () => snafuToDecimal("11"), expectedResult: 6 },
    { solution: () => snafuToDecimal("12"), expectedResult: 7 },
    { solution: () => snafuToDecimal("2="), expectedResult: 8 },
    { solution: () => snafuToDecimal("2-"), expectedResult: 9 },
    { solution: () => snafuToDecimal("20"), expectedResult: 10 },
    { solution: () => snafuToDecimal("1=0"), expectedResult: 15 },
    { solution: () => snafuToDecimal("1-0"), expectedResult: 20 },
    { solution: () => snafuToDecimal("1=11-2"), expectedResult: 2022 },
    { solution: () => snafuToDecimal("1-0---0"), expectedResult: 12345 },
    { solution: () => snafuToDecimal("1121-1110-1=0"), expectedResult: 314159265 },
    { solution: nowWeFloat, expectedResult: "2=-1=0" },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: nowWeFloat },
    ]);
}
