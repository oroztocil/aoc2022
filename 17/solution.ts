import { time } from "console";
import { randomInt } from "crypto";
import { readFileSync } from "fs";
import { debug } from "util";
import { Coords2d, range } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";
import { asc, desc } from "../utils/sort";

//
// Solution
//

const getShapes = () =>
    [
        // ####
        new Shape([[480], [240], [120], [60], [30], [15], [7], [3], [1]]),

        // .#.
        // ###
        // .#.
        new Shape([[128, 448, 128], [64, 224, 64], [32, 112, 32], [16, 56, 16], [8, 28, 8], [4, 14, 4], [2, 7, 2], [1, 3, 1], [0, 1, 0]]),

        // ..#
        // ..#
        // ###
        new Shape([[64, 64, 448], [32, 32, 224], [16, 16, 112], [8, 8, 56], [4, 4, 28], [2, 2, 14], [1, 1, 7], [0, 0, 3], [0, 0, 1]]),

        // #
        // #
        // #
        // #
        new Shape([[256, 256, 256, 256], [128, 128, 128, 128], [64, 64, 64, 64], [32, 32, 32, 32], [16, 16, 16, 16], [8, 8, 8, 8], [4, 4, 4, 4], [2, 2, 2, 2], [1, 1, 1, 1]]),

        // ##
        // ##
        new Shape([[384, 384], [192, 192], [96, 96], [48, 48], [24, 24], [12, 12], [6, 6], [3, 3], [1, 1]]),
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

    collidesWithWalls(x: number): boolean {
        for (let my = 0; my < this.masks[x].length; my++) {
            if ((257 & this.masks[x][my]) > 0) {
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

const worldHeight = 2 ** 12;

const circularRow = (row: number): number =>
    (row % worldHeight + worldHeight) % worldHeight;

const getTowerTop = (
    input: string,
    rockCount: number): number => {
    const shapes = getShapes();
    const moves: Move[] = parseMoves(input);

    let world: number[] = Array.from(
        { length: worldHeight }, (_, y) => y === 0 ? 511 : 257);

    let trueTop = 0;
    let moveIndex = 0;
    let rocksProcessed = 0;

    const printWorld = (world: World) => {
        const revWorld = [...world].reverse();
        console.log(revWorld.map(row => row.toString(2)).join("\n"));
    }

    const tlabel = "t" + randomInt(1000);
    console.time(tlabel);

    while (rocksProcessed < rockCount) {
        // Spawn new rock
        const shapeIndex = rocksProcessed % shapes.length;
        const currentShape = shapes[shapeIndex];
        let y = trueTop + currentShape.masks[0].length;
        let x = 3;

        for (let i = 0; i < currentShape.masks[0].length; i++) {
            world[circularRow(y + i)] = 257;
        }

        for (let i = 0; i < 4; i++) {
            const currentMove = moves[moveIndex];

            if (!currentShape.collidesWithWalls(x + currentMove)) {
                x = x + currentMove;
            }

            moveIndex = (moveIndex + 1) % moves.length;
        }

        while (true) {
            const currentMove = moves[moveIndex];

            if (!currentShape.collides([x, y - 1], world)) {
                y = y - 1;
            } else {
                break;
            }

            if (!currentShape.collides([x + currentMove, y], world)) {
                x = x + currentMove;
            }

            moveIndex = (moveIndex + 1) % moves.length;
        }

        // Rock has stopped
        currentShape.writeToWorld([x, y], world);
        trueTop = Math.max(trueTop, y);
        rocksProcessed++;

        if (rocksProcessed % 10000000 === 0) {
            console.log(trueTop);
            console.timeEnd(tlabel)
            console.time(tlabel)
        }
    }

    return trueTop;
}

//
// Execution
//

process.exitCode = runTests([
    { solution: input => getTowerTop(input, 10), input: ">>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>", expectedResult: 17 },
    { solution: input => getTowerTop(input, 2022), expectedResult: 3068 },
    { solution: input => getTowerTop(input, 2022), inputFile: "input.txt", expectedResult: 3227 },
    // { solution: input => getTowerTop(input, 1000000000000, 100, 90), expectedResult: 1514285714288 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: input => getTowerTop(input, 2022) },
        // { solution: input => getTowerTop(input, 1000000000000) },
    ]);
}