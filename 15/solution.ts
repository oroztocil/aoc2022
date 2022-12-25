import { Coords2d, coords2dKey, sumArray } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";
import { Interval } from "../utils/intervals";

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
    xMax = Number.MAX_SAFE_INTEGER): { count: number, intervals: Interval[] } => {
    const recordIntervals = records.map(r => {
        const manDist = Math.abs(r.sx - r.bx) + Math.abs(r.sy - r.by);
        const xDist = Math.max(0, manDist - Math.abs(r.sy - row));
        return new Interval(
            Math.max(xMin, r.sx - xDist),
            Math.min(xMax, r.sx + xDist));
    }).filter(int => int.length > 0);

    const intervals = Interval.unionAll(...recordIntervals);
    const count = sumArray(intervals.map(int => int.length + 1));

    return { count, intervals };
}

const findBeaconSpot = (records: SensorRecord[], xMax: number): Coords2d => {
    for (let y = 0; y <= xMax; y++) {
        const { count, intervals } = getBlockedRowIntervals(y, records, 0, xMax);
        if (count <= xMax) {
            for (let i = 0; i < intervals.length - 1; i++) {
                const [i1, i2] = [intervals[i], intervals[i + 1]]
                if (i1.to + 1 < i2.from) {
                    const x = i1.to + 1;
                    return [i1.to + 1, y];
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

const shrekIsTheOGNimby = (input: string, xMax: number): number => {
    const records = parseInput(input);
    const [x, y] = findBeaconSpot(records, xMax);
    return x * 4000000 + y;
}

//
// Execution
//

process.exitCode = runTests([
    { solution: input => leEpicBeacon(input, 10), expected: 26 },
    { solution: input => shrekIsTheOGNimby(input, 20), expected: 56000011 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: input => leEpicBeacon(input, 2000000) },
        { solution: input => shrekIsTheOGNimby(input, 4000000) },
    ]);
}
