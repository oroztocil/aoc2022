import { createArray2d, forEachConsPair, range } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";
import { desc } from "../utils/sort";

//
// Solution
//

type Coords = [x: number, y: number];

class Cave {
    public readonly floor: number;
    public readonly cutoff: number;

    constructor(private readonly tiles: boolean[][]) {
        this.cutoff = tiles
            .map(col => col.lastIndexOf(true))
            .sort(desc)[0];
        this.floor = this.cutoff + 2;
    }

    isFree = ([x, y]: Coords): boolean =>
        !this.tiles[x][y] && y < this.floor;

    setBlocked = ([x, y]: Coords) =>
        this.tiles[x][y] = true;

    tryMove = ([x, y]: Coords): [moved: boolean, where: Coords] => {
        for (const dx of [0, -1, 1]) {
            if (this.isFree([x + dx, y + 1])) {
                return [true, [x + dx, y + 1]];
            }
        }

        return [false, [x, y]];
    }
}

const parseCave = (input: string, width: number, height: number): Cave => {
    const tiles = createArray2d(width, height, () => false);

    const walls: Coords[][] = input
        .trim()
        .split("\n")
        .map(line => line
            .split(" -> ")
            .map(segment => segment
                .split(",")
                .map(Number) as Coords));

    walls.forEach(wall => {
        forEachConsPair(wall, (a, b) => {
            range(a[0], b[0]).forEach(x => tiles[x][a[1]] = true);
            range(a[1], b[1]).forEach(y => tiles[a[0]][y] = true);
        });
    });

    return new Cave(tiles);
}

const simulateSand = (cave: Cave, useCutoff: boolean): number => {
    let sandCount = 0;

    while (true) {
        let sandPosition: Coords = [500, 0];
        let moved = true;

        if (!cave.isFree(sandPosition)) {
            return sandCount;
        }

        while (moved) {
            [moved, sandPosition] = cave.tryMove(sandPosition);
            if (useCutoff && sandPosition[1] >= cave.cutoff) {
                return sandCount;
            }
        }

        cave.setBlocked(sandPosition);
        sandCount++;
    }
}

const whyCouldntTheShrimpShareTheSandcastle = (input: string): number =>
    simulateSand(parseCave(input, 600, 20), true);

const becauseItWasALittleShellfish = (input: string): number =>
    simulateSand(parseCave(input, 700, 20), false);

// joke by chatGPT © 2022

//
// Execution
//

process.exitCode = runTests([
    { solution: whyCouldntTheShrimpShareTheSandcastle, expected: 24 },
    { solution: becauseItWasALittleShellfish, expected: 93 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: whyCouldntTheShrimpShareTheSandcastle },
        { solution: becauseItWasALittleShellfish },
    ]);
}
