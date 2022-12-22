import { Coords3d, getNeighbors3d, range3d, sumArray as sum } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";
import { desc } from "../utils/sort";

//
// Solution
//

type Block = "cube" | "air" | "trap";
type World = Block[][][];

const parseInput = (input: string): Coords3d[] =>
    input
        .trim()
        .split("\n")
        .map(line => line.split(",").map(Number) as Coords3d);

const initWorld = (cubes: Coords3d[]): [world: World, maxima: Coords3d] => {
    const maxima = [0, 1, 2]
        .map(d => cubes.map(c => c[d]).sort(desc)[0]) as Coords3d;
    const world: Block[][][] = Array.from(
        { length: maxima[0] + 1 }, (_, x) => Array.from(
            { length: maxima[1] + 1 }, (_, y) => Array.from(
                { length: maxima[2] + 1 }, (_, z) =>
                x === 0 || y === 0 || z === 0 ? "air" : "trap"
            )
        )
    );

    cubes.forEach(([x, y, z]) => world[x][y][z] = "cube");
    return [world, maxima];
}

const countContacts = (c: Coords3d, world: World, type: Block): number =>
    getNeighbors3d(c)
        .filter(n => world[n[0]]?.[n[1]]?.[n[2]] === type)
        .length;

const covidIsFake = (input: string): number => {
    const cubes = parseInput(input);
    const [world, _] = initWorld(cubes);
    const cubeContacts = cubes.map(c => countContacts(c, world, "cube"));
    return 6 * cubes.length - sum(cubeContacts);
}

const stillGotIt = (input: string): number => {
    const cubes = parseInput(input);
    const [world, maxima] = initWorld(cubes);

    // Flood world with air (contains Covid, which is fake)
    const queue = range3d([0, 0, 0], maxima)
        .filter(c => world[c[0]][c[1]][c[2]] === "air");

    while (queue.length > 0) {
        const c = queue.pop()!;
        world[c[0]][c[1]][c[2]] = "air";
        const neighbors = getNeighbors3d(c)
            .filter(n => world[n[0]]?.[n[1]]?.[n[2]] === "trap");
        queue.push(...neighbors);
    }

    const cubeContacts = cubes.map(c => countContacts(c, world, "cube"));
    const trapContacts = cubes.map(c => countContacts(c, world, "trap"));

    return 6 * cubes.length - sum(cubeContacts) - sum(trapContacts);
}

//
// Execution
//

process.exitCode = runTests([
    { solution: covidIsFake, input: "1,1,1\n2,1,1\n", expectedResult: 10 },
    { solution: covidIsFake, expectedResult: 64 },
    { solution: stillGotIt, expectedResult: 58 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: covidIsFake },
        { solution: stillGotIt },
    ]);
}
