import { Coords2d, coords2dKey, transpose } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

type Tile = "#" | ".";

type WorldArray = Tile[][];

const parseInput = (input: string): WorldArray => {
    const rows = input
        .trim()
        .split("\n")
        .map(line => line.split("") as Tile[]);
    return transpose(rows);
};

const printWorld = (world: WorldArray) =>
    transpose(world).forEach(row => console.log(row.join("")));

const worldFromPositions = (positions: Coords2d[]): WorldArray => {
    const [[fromX, fromY], [toX, toY]] = getWorldBounds(positions);
    return [];
}

const getWorldBounds = (positions: Coords2d[]): [from: Coords2d, to: Coords2d] => {
    const sortedByX = [...positions].sort((a, b) => a[0] - b[0]);
    const sortedByY = [...positions].sort((a, b) => a[1] - b[1]);
    const from = [sortedByX[0][0], sortedByY[0][1]] as Coords2d;
    const to = [sortedByX[sortedByX.length - 1][0], sortedByY[sortedByY.length - 1][1]] as Coords2d;
    return [from, to];
}

const alg1 = (input: string): number => {
    const world = parseInput(input);
    const elves: Coords2d[] = [];

    const elfMap = new Dictionary<Coords2d, number>(coords2dKey);

    world.forEach((col, x) => col.forEach((el, y) => {
        if (el === "#") {
            elves.push([x, y]);
            elfMap.set([x, y], 1);
        }
    }));

    const moveFuncs = [

    ];

    console.log(elves);

    // elves.sort(([ax, ay]: Coords2d, [bx, by]: Coords2d) =>
    //     ax !== bx ? ax - bx : ay - by);

    const [[fromX, fromY], [toX, toY]] = getWorldBounds(elves);

    console.log(fromX, fromY, toX, toY);

    // printWorld(world);

    // Simulate 10 rounds


    // Calculate area
    return (toX - fromX) * (toY - fromY);
};

const alg2 = (input: string): number => 420;

//
// Execution
//

process.exitCode = runTests([
    { solution: alg1, expectedResult: 110 },
    // { solution: alg2, expectedResult: 420 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        // { solution: alg1 },
        // { solution: alg2 },
    ]);
}
