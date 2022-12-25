import { circularIndex } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

type RefNumber = {
    value: number,
    fake?: boolean
};

// const moveNode = (node: NumberNode, positions: number) => {
//     const 
//     if (positions >= 0) {
//         for (let i = 0; i < positions; i++) {
//             const nextTmp = node.next!;
//             nextTmp.prev = node.prev!;
//             node.next = nextTmp.next!;
//             node.prev = nextTmp;
//             nextTmp.next = node;
//         }
//     } else {
//         for (let i = 0; i < Math.abs(positions); i++) {
//             const prevTmp = node.prev!;
//             prevTmp.next = node.next!;
//             node.next = prevTmp!;
//             node.prev = prevTmp.prev!;
//             prevTmp.prev = node;
//         }
//     }
// }

// const printList = (head: NumberNode) => {
//     let node = head;
//     let output = "";
//     do {
//         output += `${node.value} -> `;
//         node = node.next!;
//     } while (node !== head);

//     console.log(output);
// }

const parseInput = (input: string): RefNumber[] =>
    input.trim().split("\n").map(x => ({ value: Number(x) }));

const moveRefNumber = (arr: RefNumber[], n: RefNumber) => {
    let index = arr.indexOf(n);

    if (n.value >= 0) {
        for (let i = 0; i < n.value; i++) {
            // const tmp = arr[circularIndex(arr, index + i)];
            arr[circularIndex(arr, index)] = arr[circularIndex(arr, index + 1)];
            arr[circularIndex(arr, index + 1)] = n;
            if (arr[circularIndex(arr, index)].fake === true) i--;
            index++;
        }
    } else {
        for (let i = 0; i < Math.abs(n.value); i++) {
            arr[circularIndex(arr, index)] = arr[circularIndex(arr, index - 1)];
            arr[circularIndex(arr, index - 1)] = n;
            if (arr[circularIndex(arr, index)].fake === true) i--;
            index--;
        }
    }
}

const alg1 = (input: string, factor: number, mixCount: number): number => {
    let numbers = parseInput(input);
    // const div = Math.floor(factor / numbers.length);
    const remainder =  factor % numbers.length;
    // console.log("mult", mult);
    const zeroNode = numbers.find(n => n.value === 0)!;
    // numbers = numbers.map(n => ({ value: n.value * remainder }));
    // const paddingItems = Array.from({ length: padding }, () => ({ value: 0, fake: true }));
    // numbers = numbers.concat(paddingItems);

    // let result: RefNumber[] = [...numbers].concat(paddingItems);
    let result: RefNumber[] = [...numbers];
    // console.log(numbers.length);

    for (let i = 0; i < mixCount; i++) {
        numbers.forEach(n => moveRefNumber(result, n));
        // console.log(i);
    }

    // result = [...result].filter(x => x.fake === undefined);
    // console.log(withoutPadding);

    const zeroIndex = result.indexOf(zeroNode);
    return (
        result[circularIndex(result, zeroIndex + 1000)].value + // - remainder +
        result[circularIndex(result, zeroIndex + 2000)].value + // - remainder +
        result[circularIndex(result, zeroIndex + 3000)].value// - remainder
    ) * factor;
}

const alg2 = (input: string): number => 420;

//
// Execution
//

process.exitCode = runTests([
    { solution: input => alg1(input, 1, 1), expected: 3 },
    // { solution: input => alg1(input, 1, 1, 1), expectedResult: 3 },
    { solution: input => alg1(input, 811589153, 10), expected: 1623178306 },
    // { solution: input => alg1(input, 1, 1, 1), expectedResult: 3, input: "1\n2\n-3\n3\n-2\n0\n" }
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: input => alg1(input, 1, 1) },
        // { solution: input => alg1(input, 811589153, 10) },
        // { solution: input => alg1(input, 811589153, 10, 3) },
    ]);
}

// 4943389530923
// 811589153
// 10441094453345
// 10441094453345