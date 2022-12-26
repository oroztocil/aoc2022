import assert = require("assert");
import FastPriorityQueue = require("fastpriorityqueue");
import { circularIndex, Coords2d, createArray2d, getNeighbors2d, getNeighbors3d, inArray2d, range, transpose } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

type Blizzard = [1, 0] | [-1, 0] | [0, 1] | [0, -1];
type Tile = "wall" | Blizzard[];
type World = Tile[][];

const parseInput = (input: string): World => {
    const rows = input
        .trim()
        .split("\n")
        .map(line => line.split("")
            .map(tile => {
                if (tile === "#") {
                    return "wall";
                } else if (tile === ".") {
                    return [];
                } else {
                    switch (tile) {
                        case ">": return [[1, 0]] as Blizzard[];
                        case "<": return [[-1, 0]] as Blizzard[];
                        case "v": return [[0, 1]] as Blizzard[];
                        case "^": return [[0, -1]] as Blizzard[];
                        default: throw new Error("Sus tile input");
                    }
                }
            }));

    return transpose(rows);
}


const getExitCoords = (world: World): Coords2d =>
    [world.length - 2, world[0].length - 1];

const tileIsStart = ([x, y]: Coords2d): boolean =>
    x === 1 && y === 0;

const tileIsTarget = ([x, y]: Coords2d, width: number, height: number): boolean =>
    x === width - 2 && y === height - 1;

const tileIsFree = (tile: Tile): boolean =>
    tile !== "wall" && tile.length === 0;

const createWorld = (width: number, height: number): World => {
    const arr = createArray2d<Tile>(width, height, (x, y) =>
        (x === 0 || x === width - 1 || y === 0 || y === height - 1)
            && !tileIsStart([x, y])
            && !tileIsTarget([x, y], width, height)
            ? "wall"
            : []);
    return arr;
}

const printWorld = (world: World) => {
    const transposed = transpose(world);
    console.log(transposed.map(row => row
        .map(tile => tile === "wall"
            ? "#"
            : tile.length > 0 ? tile.length : ".")
        .join(""))
        .join("\n"));
}

const getNextWorldStep = (world: World): World => {
    const newWorld = createWorld(world.length, world[0].length);

    range(0, world.length - 1)
        .forEach(x => range(0, world[0].length - 1)
            .forEach(y => {
                const tile = world[x][y];
                if (tile !== "wall") {
                    tile.forEach(blizz => {
                        const [nx, ny] = getNextBlizzCoords(blizz, [x, y], world);
                        // console.log(nx, ny);
                        (newWorld[nx][ny] as Blizzard[]).push(blizz);
                    })
                }
            }));

    return newWorld;
}

const getNextBlizzCoords = ([dx, dy]: Blizzard, [x, y]: Coords2d, world: World): Coords2d => {
    const tile = world[x][y];
    assert(tile !== "wall");
    let [nx, ny]: Coords2d = [x + dx, y + dy];
    if (world[nx][ny] === "wall") {
        nx = circularIndex(world.length, nx + 2 * dx);
        ny = circularIndex(world[0].length, ny + 2 * dy);
    }
    return [nx, ny];
}

const getWorldHashKey = (world: World): string => world.map(row => row
    .map(tile => tile === "wall"
        ? ""
        : tile.map(b => `${b[0]}${b[1]}`).join(""))
    .join(":"))
    .join(";");

type SearchNode = {
    position: Coords2d;
    step: number;
    score: number;
}

const ayStar = (
    [sx, sy]: Coords2d,
    [tx, ty]: Coords2d,
    startStep: number,
    worldSteps: [World, string][]): number => {
    const getStateKey = (state: SearchNode): string =>
        `${state.position[0]}${state.position[1]}`
        + worldSteps[state.step][1];

    const getStateNeighbors = (state: SearchNode): SearchNode[] => {
        const [nextWorld, _] = worldSteps[state.step + 1];
        return getNeighbors2d(state.position)
            .filter(([cx, cy]) => inArray2d(nextWorld, cx, cy))
            .concat([state.position])
            .filter(([cx, cy]) => tileIsFree(nextWorld[cx][cy]))
            .map(([nx, ny]) => ({
                position: [nx, ny],
                step: state.step + 1,
                // Manhattan distance heuristic
                score: Math.abs(tx - nx) + Math.abs(ty - ny)
            }));
    }

    const initState: SearchNode = {
        position: [sx, sy],
        step: startStep,
        score: 0
    };

    const priorityQueue = new FastPriorityQueue((a: SearchNode, b: SearchNode) => a.score < b.score);
    priorityQueue.add(initState);
    const visited = new Set<string>();
    let best = Number.MAX_SAFE_INTEGER;

    while (priorityQueue.size > 0) {
        const current = priorityQueue.poll()!;
        visited.add(getStateKey(current));

        if (current.position[0] === tx && current.position[1] === ty && current.step < best) {
            console.log("new best ", current.step);
            best = current.step;
        } else if (current.step + 1 < best) {
            const nextStates = getStateNeighbors(current);
            const unvisited = nextStates.filter(nextState => !visited.has(getStateKey(nextState)));
            unvisited.forEach(nextState => priorityQueue.add(nextState));
        }
    }

    return best;
}

const precomputeWorldSteps = (initWorld: World): [World, string][] => {
    const initKey = getWorldHashKey(initWorld);
    const worldSteps: [World, string][] = [[initWorld, initKey]];

    range(1, 1000).forEach(i => {
        const nextWorld = getNextWorldStep(worldSteps[worldSteps.length - 1][0]);
        const key = getWorldHashKey(nextWorld);
        worldSteps.push([nextWorld, key]);
    });

    return worldSteps;
}

const allGoodProgramsAreAlike = (input: string): number => {
    const initWorld = parseInput(input);
    const worldSteps = precomputeWorldSteps(initWorld);
    return ayStar([1, 0], getExitCoords(initWorld), 0, worldSteps);
}

const eachBadProgramIsBadInItsOwnWay = (input: string): number => {
    const initWorld = parseInput(input);
    const worldSteps = precomputeWorldSteps(initWorld);

    const there = ayStar([1, 0], getExitCoords(initWorld), 0, worldSteps);
    const back = ayStar(getExitCoords(initWorld), [1, 0], there, worldSteps);
    const thereAgain = ayStar([1, 0], getExitCoords(initWorld), back, worldSteps);

    return thereAgain;
}

//
// Execution
//

process.exitCode = runTests([
    { solution: allGoodProgramsAreAlike, expectedResult: 18 },
    { solution: eachBadProgramIsBadInItsOwnWay, expectedResult: 54 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: allGoodProgramsAreAlike },
        { solution: eachBadProgramIsBadInItsOwnWay },
    ]);
}
