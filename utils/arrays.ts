export const sumArray = (arr: number[]): number =>
    arr.reduce((sum, val) => sum + val, 0);

export const chunkArray = <T>(arr: T[], subLength: number): T[][] =>
    Array.from(
        { length: (arr.length + subLength - 1) / subLength },
        () => arr.splice(0, subLength)
    );

export const range = (from: number, to: number, step?: number): number[] => {
    const s = step ?? from < to ? 1 : -1;
    return Array.from({ length: (to - from) / s + 1 }, (_, i) => from + i * s);
}

export const range3d = (from: Coords3d, to: Coords3d): Coords3d[] => {
    return range(from[0], to[0])
        .flatMap(x => range(from[1], to[1])
            .flatMap(y => range(from[2], to[2])
                .map(z => [x, y, z] as Coords3d)));
}

export const createArray2d = <T>(width: number, height: number, initializer: () => T): T[][] =>
    Array.from({ length: width }, () => Array.from({ length: height }, initializer));

export const transpose = <T>(arr: T[][]) =>
    arr[0].map((_, col) => arr.map(row => row[col]));

export const forEachConsPair = <T>(arr: T[], func: (a: T, b: T) => void) => {
    for (let i = 0; i < arr.length - 1; i++) {
        func(arr[i], arr[i + 1]);
    }
}

export const getAllArrayPairs = <T>(arr: T[]): [T, T][] =>
    arr.flatMap(
        (item, index) => arr
            .slice(index + 1)
            .map(other => [item, other] as [T, T])
    );

export type Coords2d = [x: number, y: number];

export const coords2dKey = (coords: Coords2d): string =>
    `${coords[0]}:${coords[1]}`;

export type Coords3d = [x: number, y: number, z: number];

export const coords3dKey = (coords: Coords3d): string =>
    `${coords[0]}:${coords[1]}:${coords[2]}`;

export const getNeighbors3d = (c: Coords3d): Coords3d[] =>
    [
        [c[0] + 1, c[1], c[2]],
        [c[0] - 1, c[1], c[2]],
        [c[0], c[1] + 1, c[2]],
        [c[0], c[1] - 1, c[2]],
        [c[0], c[1], c[2] + 1],
        [c[0], c[1], c[2] - 1],
    ];

export const inArray2d = <T>(arr: T[][], x: number, y: number) =>
    x >= 0 && x < arr.length && y >= 0 && y < arr[x].length;

export const inArray3d = <T>(arr: T[][][], [x, y, z]: Coords3d) =>
    x >= 0 && x < arr.length && y >= 0 && y < arr[x].length && z >= 0 && z < arr[x][y].length;

export const circularIndex = <T>(arr: T[], index: number): number =>
    (index % arr.length + arr.length) % arr.length;

export const multiArrayProduct = <T>(arr: T[][]): T[][] =>
    arr.length < 2
        ? arr[0].map(el => [el])
        : arr.reduce((a, b) => a.flatMap(x => b.map(y => [...x, y])), [[]] as T[][]);