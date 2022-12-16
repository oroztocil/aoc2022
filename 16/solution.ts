import { createArray2d } from "../utils/arrays";
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
    flow: number;
    visited: Set<number>;
}

interface Part1State extends SearchState {
    me: WorkerState;
}

interface Part2State extends Part1State {
    ele: WorkerState;
}

class Solver {
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
        this.positiveValves = [...valves.entries()].filter(([_, valve]) => valve.rate > 0).map(([_, valve]) => valve);
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

const elephantOff = (input: string, timeLimit: number, startKey: string): number => {
    const valves = parseInput(input);
    const solver = new Solver(valves);

    const startIndex = valves.get(startKey)!.index;
    const startState: Part1State = {
        me: { location: startIndex, time: timeLimit },
        flow: 0,
        visited: new Set<number>([startIndex])
    }

    const stack: Part1State[] = [startState];
    let best = -1;

    while (stack.length > 0) {
        const current = stack.pop()!;
        const moves = solver.getAvailableMoves(current.me, current.visited);
        const next: Part1State[] = moves
            .map(valve => {
                const remainingTime = solver.getTimeAfterMove(current.me, valve.index);
                const newVisited = new Set(current.visited);
                newVisited.add(valve.index);
                return {
                    me: { time: remainingTime, location: valve.index },
                    flow: current.flow + remainingTime * valve.rate,
                    visited: newVisited
                };
            });

        if (next.length > 0) {
            stack.push(...next);
        } else {
            best = Math.max(best, current.flow);
        }
    }

    return best;
}

const elephantOn = (input: string, timeLimit: number, startKey: string): number => {
    const valves = parseInput(input);
    const solver = new Solver(valves);

    const startIndex = valves.get(startKey)!.index;
    const startState: Part2State = {
        me: { location: startIndex, time: timeLimit },
        ele: { location: startIndex, time: timeLimit },
        flow: 0,
        visited: new Set<number>([startIndex])
    }

    const stack: Part2State[] = [startState];
    let best = -1;

    while (stack.length > 0) {
        const current = stack.pop()!;

        const myMoves = [...solver.getAvailableMoves(current.me, current.visited), null];
        const eleMoves = [...solver.getAvailableMoves(current.ele, current.visited), null];

        const movePairs = myMoves.flatMap(
            myMove => eleMoves
                .filter(eleMove => myMove !== eleMove)
                .map(eleMove => [myMove, eleMove]));

        if (movePairs.length > 0) {
            const next: Part2State[] = movePairs.map(([myMove, eleMove]) => {
                const myNext: WorkerState = myMove != null
                    ? {
                        time: solver.getTimeAfterMove(current.me, myMove.index),
                        location: myMove.index
                    }
                    : { time: 0, location: current.me.location };

                const eleNext: WorkerState = eleMove != null
                    ? {
                        time: solver.getTimeAfterMove(current.ele, eleMove.index),
                        location: eleMove.index
                    }
                    : { time: 0, location: current.ele.location };

                const newVisited = new Set(current.visited);
                newVisited.add(myNext.location);
                newVisited.add(eleNext.location);

                const newFlow = current.flow
                    + myNext.time * (myMove?.rate ?? 0)
                    + eleNext.time * (eleMove?.rate ?? 0);

                return {
                    me: myNext,
                    ele: eleNext,
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
    { solution: input => elephantOff(input, 30, "AA"), expectedResult: 1651 },
    { solution: input => elephantOn(input, 26, "AA"), expectedResult: 1707 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: input => elephantOff(input, 30, "AA") },
        { solution: input => elephantOn(input, 26, "AA") },
    ]);
}
