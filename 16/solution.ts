import { createArray2d, multiArrayProduct, sumArray } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

type Valve = {
    index: number;
    rate: number;
    neighbors: string[];
}

const regex = /^Valve ([A-Z]+).*rate=(\d+).*valves? ([A-Z, ]+)$/;

const parseInput = (input: string): Map<string, Valve> => {
    const valves: [string, Valve][] = input
        .trim()
        .split("\n")
        .map((line, index) => {
            const [_, key, r, nn] = line.match(regex) ?? [];
            const rate = Number(r);
            const neighbors = nn.replaceAll(" ", "").split(",").sort();
            return [key, { key, index, rate, neighbors }];
        });

    return new Map<string, Valve>(valves);
}

interface WorkerState {
    location: number;
    time: number;
}

interface SearchState {
    workers: WorkerState[]
    flow: number;
    visited: Set<number>;
}

class GraphManager {
    private readonly pathCosts: number[][];
    private readonly positiveValves: Valve[];

    constructor(valves: Map<string, Valve>) {
        const adjacent: number[][] = createArray2d(
            valves.size, valves.size, () => Infinity);

        valves.forEach((valve) => {
            adjacent[valve.index][valve.index] = 0;
            valve.neighbors.forEach(neighbor => {
                adjacent[valve.index][valves.get(neighbor)!.index] = 1;
            });
        });

        this.pathCosts = floydWarshall(adjacent);
        this.positiveValves = [...valves.entries()]
            .filter(([_, valve]) => valve.rate > 0).map(([_, valve]) => valve);
    }

    getAvailableMoves = (worker: WorkerState, visited: Set<number>) =>
        this.positiveValves
            .filter(valve => !visited.has(valve.index))
            .filter(valve => 0 < this.getTimeAfterMove(worker, valve.index));

    getTimeAfterMove = (worker: WorkerState, valveIndex: number) =>
        worker.time - this.pathCosts[worker.location][valveIndex] - 1;
}

const floydWarshall = (graph: number[][]): number[][] => {
    const dists = [...graph];
    const n = dists.length;

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dists[i][k] + dists[k][j] < dists[i][j]) {
                    dists[i][j] = dists[i][k] + dists[k][j];
                }
            }
        }
    }

    return dists;
}

const solveUsingStaticProgramming = (
    input: string,
    timeLimit: number,
    startKey: string,
    workerCount: number): number => {
    const valves = parseInput(input);
    const solver = new GraphManager(valves);

    const startIndex = valves.get(startKey)!.index;
    const startState: SearchState = {
        workers: Array.from(
            { length: workerCount },
            () => ({ location: startIndex, time: timeLimit })),
        flow: 0,
        visited: new Set<number>([startIndex])
    }

    const stack: SearchState[] = [startState];
    let best = -1;

    while (stack.length > 0) {
        const current = stack.pop()!;

        const workerMoves = current.workers.map(worker =>
            [...solver.getAvailableMoves(worker, current.visited), null]);

        let moveTuples = multiArrayProduct(workerMoves);
        moveTuples = moveTuples.filter(tuple =>
            tuple.length === new Set(tuple).size && tuple.some(val => val != null));


        if (moveTuples.length > 0) {
            const next: SearchState[] = moveTuples.map(moves => {
                const nextWorkerStates = moves.map((move, index) => move != null
                    ? {
                        time: solver.getTimeAfterMove(current.workers[index], move.index),
                        location: move.index
                    }
                    : { time: 0, location: 0 });

                const newVisited = new Set([...current.visited, ...nextWorkerStates.map(w => w.location)]);
                const newFlow = current.flow + sumArray(nextWorkerStates.map((w, i) => w.time * (moves[i]?.rate ?? 0)));

                return {
                    workers: nextWorkerStates,
                    flow: newFlow,
                    visited: newVisited
                };
            });

            stack.push(...next);
        } else {
            if (current.flow > best) {
                best = current.flow;
            }
        }
    }

    return best;
}

//
// Execution
//

process.exitCode = runTests([
    { solution: input => solveUsingStaticProgramming(input, 30, "AA", 1), expectedResult: 1651 },
    { solution: input => solveUsingStaticProgramming(input, 26, "AA", 2), expectedResult: 1707 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: input => solveUsingStaticProgramming(input, 30, "AA", 1) },
        { solution: input => solveUsingStaticProgramming(input, 26, "AA", 2) },
    ]);
}
