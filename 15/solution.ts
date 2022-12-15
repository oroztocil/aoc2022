import { Coords2d, coords2dKey } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

type SensorRecord = {
    sx: number;
    sy: number;
    bx: number;
    by: number;
}

const regex = /.*x=(-?\d+).*y=(-?\d+).*x=(-?\d+).*y=(-?\d+)/;

const parseInput = (input: string): SensorRecord[] =>
    input
        .trim()
        .split("\n")
        .map(line => {
            const [_, sx, sy, bx, by] = (line.match(regex) ?? []).map(Number);
            return { sx, sy, bx, by };
        });

const getBlockedRowIntervals = (
    row: number,
    records: SensorRecord[],
    xMin = Number.MIN_SAFE_INTEGER,
    xMax = Number.MAX_SAFE_INTEGER): { count: number, blockedIntervals: number[][] } => {
    const blockedIntervals = records.map(r => {
        const manDist = Math.abs(r.sx - r.bx) + Math.abs(r.sy - r.by);
        const xDist = Math.max(0, manDist - Math.abs(r.sy - row));
        return [Math.max(xMin, r.sx - xDist), Math.min(xMax, r.sx + xDist)];
    }).filter(int => int[0] !== int[1])
        .sort((a, b) => a[0] - b[0]);

    let count = 0;
    let right = xMin;

    blockedIntervals.forEach(int => {
        count += Math.max(0, int[1] - Math.max(right, int[0]) + 1);
        right = Math.max(right, int[1] + 1);
    });

    return { count, blockedIntervals };
}

const findBeaconSpot = (records: SensorRecord[], xMax: number): Coords2d => {
    for (let y = 0; y <= xMax; y++) {
        const { count, blockedIntervals } = getBlockedRowIntervals(y, records, 0, xMax);
        if (count <= xMax) {
            for (let i = 0; i < blockedIntervals.length - 1; i++) {
                const [i1, i2] = [blockedIntervals[i], blockedIntervals[i + 1]]
                if (i1[1] + 1 < i2[0]) {
                    return [i1[1] + 1, y];
                }
            }
        }
    }

    throw new Error("No beacon possible");
}

const leEpicBeacon = (input: string, row: number): number => {
    const records = parseInput(input);
    const blockedInRow = getBlockedRowIntervals(row, records).count;
    const beaconsInRow = new Set(
        records.filter(r => r.by === row)
            .map(r => coords2dKey([r.bx, r.by]))).size;
    return blockedInRow - beaconsInRow;
}

const shrekIsTheOGNimby = (input: string, limit: number): number => {
    const records = parseInput(input);
    const [x, y] = findBeaconSpot(records, limit);
    return x * 4000000 + y;
}

//
// Execution
//

process.exitCode = runTests([
    { solution: input => leEpicBeacon(input, 10), expectedResult: 26 },
    { solution: input => shrekIsTheOGNimby(input, 20), expectedResult: 56000011 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: input => leEpicBeacon(input, 2000000) },
        { solution: input => shrekIsTheOGNimby(input, 4000000) },
    ]);
}
