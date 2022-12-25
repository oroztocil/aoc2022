import { Coords2d, range } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

const WORLD_HEIGHT = 100;
const REPEAT_SEGMENT_LENGTH = 50;

const getShapes = () =>
    [
        // ####
        new Shape([[480], [240], [120], [60], [30], [15], [7], [3], [1]]),

        // .#.
        // ###
        // .#.
        new Shape([[128, 448, 128], [64, 224, 64], [32, 112, 32], [16, 56, 16],
        [8, 28, 8], [4, 14, 4], [2, 7, 2], [1, 3, 1], [0, 1, 0]]),

        // ..#
        // ..#
        // ###
        new Shape([[64, 64, 448], [32, 32, 224], [16, 16, 112], [8, 8, 56],
        [4, 4, 28], [2, 2, 14], [1, 1, 7], [0, 0, 3], [0, 0, 1]]),

        // #
        // #
        // #
        // #
        new Shape([[256, 256, 256, 256], [128, 128, 128, 128],
        [64, 64, 64, 64], [32, 32, 32, 32], [16, 16, 16, 16], [8, 8, 8, 8],
        [4, 4, 4, 4], [2, 2, 2, 2], [1, 1, 1, 1]]),

        // ##
        // ##
        new Shape([[384, 384], [192, 192], [96, 96], [48, 48], [24, 24],
        [12, 12], [6, 6], [3, 3], [1, 1]]),
    ];

type Move = 1 | -1;

type World = number[];

class Shape {
    constructor(public readonly masks: number[][]) { }

    collides([x, y]: Coords2d, world: World): boolean {
        for (let my = 0; my < this.masks[x].length; my++) {
            if ((world[circularRow(y - my)] & this.masks[x][my]) > 0) {
                return true;
            }
        }
        return false;
    }

    writeToWorld([x, y]: Coords2d, world: World): void {
        for (let my = 0; my < this.masks[x].length; my++) {
            const worldRow = circularRow(y - my);
            world[worldRow] = world[worldRow] ^ this.masks[x][my];
        }
    }
}

const parseMoves = (input: string): Move[] =>
    input.trim().split("").map(c => c === ">" ? 1 : -1);

const getWorldHash = (world: World, top: number): string =>
    range(0, REPEAT_SEGMENT_LENGTH - 1)
        .map(i => circularRow(top - i))
        .map(i => world[i])
        .join(":")

const circularRow = (row: number): number =>
    (row % WORLD_HEIGHT + WORLD_HEIGHT) % WORLD_HEIGHT;

const getTop = (
    input: string,
    rocksRequired: number): number => {
    const shapes = getShapes();
    const moves: Move[] = parseMoves(input);
    const world: number[] = Array.from(
        { length: WORLD_HEIGHT }, (_, y) => y === 0 ? 511 : 257);

    const worldCache = new Map<string, [rocks: number, top: number]>();

    let top = 0;
    let moveIndex = -1;
    let rocksProcessed = 0;
    let heightSkipped = 0;

    while (rocksProcessed < rocksRequired) {
        // Spawn new rock
        const shapeIndex = rocksProcessed % shapes.length;
        const currentShape = shapes[shapeIndex];
        let y = top + 3 + currentShape.masks[0].length;
        let x = 3;

        for (let i = 0; i < currentShape.masks[0].length + 3; i++) {
            world[circularRow(y - i)] = 257;
        }

        while (true) {
            moveIndex = (moveIndex + 1) % moves.length;

            if (heightSkipped === 0 && moveIndex === 0) {
                // Store & check repeated state
                const hash = getWorldHash(world, top);
                if (worldCache.has(hash)) {
                    const [prevProcessed, prevTop] = worldCache.get(hash)!;
                    const processedDiff = rocksProcessed - prevProcessed;
                    const iterationsSkipped = Math.floor(
                        (rocksRequired - rocksProcessed) / processedDiff);

                    rocksRequired -= processedDiff * iterationsSkipped;
                    heightSkipped = (top - prevTop) * iterationsSkipped;
                } else {
                    worldCache.set(hash, [rocksProcessed, top]);
                }
            }

            const currentMove = moves[moveIndex];

            if (!currentShape.collides([x + currentMove, y], world)) {
                x = x + currentMove;
            }

            if (!currentShape.collides([x, y - 1], world)) {
                y = y - 1;
            } else {
                break;
            }
        }

        // Rock has stopped
        currentShape.writeToWorld([x, y], world);
        top = Math.max(top, y);
        rocksProcessed++;
    }

    return top + heightSkipped;
}

//
// Execution
//

process.exitCode = runTests([
    { solution: input => getTop(input, 10), input: ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>", expected: 17 },
    { solution: input => getTop(input, 2022), expected: 3068 },
    { solution: input => getTop(input, 2022), inputFile: "input.txt", expected: 3227 },
    { solution: input => getTop(input, 1000000000000), expected: 1514285714288 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: input => getTop(input, 2022) },
        { solution: input => getTop(input, 1000000000000) },
    ]);
}