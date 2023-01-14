import { Dir } from "fs";
import { Coords2d, createArray2d, transpose } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";
import { desc } from "../utils/sort";

//
// Solution
//

type Instruction = number | "L" | "R";
type Tile = "." | "#" | " ";
type World = {
    rows: Tile[][];
    columns: Tile[][];
}

const parseInstructions = (input: string): Instruction[] =>
    input
        .trim()
        .replaceAll("L", "|L|")
        .replaceAll("R", "|R|")
        .split("|") as Instruction[];

const parse2dInput = (input: string): [World, Instruction[]] => {
    const [mapInput, instructionInput] = input.split("\n\n");

    const worldLines = mapInput.split("\n").map(line => line);
    const worldWidth = worldLines.map(line => line.length).sort(desc)[0];

    const columns: Tile[][] = createArray2d(worldWidth + 2, worldLines.length + 2, () => " ");
    worldLines.forEach((line, y) => line.split("").forEach((c, x) => {
        columns[x + 1][y + 1] = c as Tile;
    }));

    const rows = transpose(columns);

    return [{ rows, columns }, parseInstructions(instructionInput)];
}

const parseCubeInput = (input: string): [World, Instruction[]] => {
    const [mapInput, instructionInput] = input.split("\n\n");

    const worldLines = mapInput.split("\n").map(line => line);
    const worldWidth = worldLines.map(line => line.length).sort(desc)[0];

    const columns: Tile[][] = createArray2d(worldWidth + 2, worldLines.length + 2, () => " ");
    worldLines.forEach((line, y) => line.split("").forEach((c, x) => {
        columns[x + 1][y + 1] = c as Tile;
    }));

    const rows = transpose(columns);

    return [{ rows, columns }, parseInstructions(instructionInput)];
}

const printWorld = (world: World) => {
    console.log(world.rows.map(row => row.join(""))
        .join("\n"));
}

enum Direction {
    Right = 0,
    Down = 1,
    Left = 2,
    Up = 3,
}

const directionMoves = new Map<Direction, [number, number]>([
    [Direction.Right, [1, 0]],
    [Direction.Down, [0, 1]],
    [Direction.Left, [-1, 0]],
    [Direction.Up, [0, -1]],
]);

type State = {
    x: number;
    y: number;
    direction: Direction;
}

const alg1 = (input: string): number => {
    const getLeftmostFloor = (y: number): number =>
        world.rows[y].findIndex(t => t !== " ");

    const getRightmostFloor = (y: number): number =>
        Math.max(
            world.rows[y].lastIndexOf("."),
            world.rows[y].lastIndexOf("#")
        );

    const getTopmostFloor = (x: number): number =>
        world.columns[x].findIndex(t => t !== " ");

    const getBottommostFloor = (x: number): number =>
        Math.max(
            world.columns[x].lastIndexOf("."),
            world.columns[x].lastIndexOf("#")
        );

    const getNextCoords = ([x, y]: Coords2d, direction: Direction): Coords2d => {
        const [dx, dy] = directionMoves.get(direction)!;
        const [nx, ny] = [x + dx, y + dy];

        if (world.columns[nx][ny] !== " ") {
            return [nx, ny];
        } else {
            switch (direction) {
                case Direction.Right: return [getLeftmostFloor(ny), ny];
                case Direction.Down: return [nx, getTopmostFloor(nx)];
                case Direction.Left: return [getRightmostFloor(ny), ny];
                case Direction.Up: return [nx, getBottommostFloor(nx)];
            }
        }
    }

    const [world, instructions] = parse2dInput(input);

    // console.log(world);
    // printWorld(world);

    const result: State = instructions.reduce(({ x, y, direction }, inst) => {
        // console.log(x, y, Direction[direction]);
        if (inst === "L") {
            switch (direction) {
                case Direction.Right: return { x, y, direction: Direction.Up };
                case Direction.Down: return { x, y, direction: Direction.Right };
                case Direction.Left: return { x, y, direction: Direction.Down };
                case Direction.Up: return { x, y, direction: Direction.Left };
            }
        } else if (inst === "R") {
            switch (direction) {
                case Direction.Right: return { x, y, direction: Direction.Down };
                case Direction.Down: return { x, y, direction: Direction.Left };
                case Direction.Left: return { x, y, direction: Direction.Up };
                case Direction.Up: return { x, y, direction: Direction.Right };
            }
        } else {
            const steps = Number(inst);
            // console.log(`going ${steps} to ${Direction[direction]}`);
            // if (steps === 2) {
            //     console.log("baf");
            // }
            for (let i = 0; i < steps; i++) {
                const [nx, ny] = getNextCoords([x, y], direction);
                if (world.columns[nx][ny] === "#") {
                    break;
                } else {
                    [x, y] = [nx, ny];
                }
            }

            return { x, y, direction };
        }
    }, {
        x: getLeftmostFloor(1),
        y: 1,
        direction: Direction.Right
    } as State);

    console.log(result);
    return result.y * 1000 + result.x * 4 + result.direction;
}

const alg2 = (input: string): number => 420;

//
// Execution
//

process.exitCode = runTests([
    { solution: alg1, expectedResult: 6032 },
    // { solution: alg2, expectedResult: 420 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: alg1 },
        // { solution: alg2 },
    ]);
}
