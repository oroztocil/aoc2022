export const sumArray = (arr: number[]): number =>
    arr.reduce((sum, val) => sum + val, 0);

export const chunkArray = <T>(arr: T[], subLength: number): T[][] =>
    Array.from(
        { length: (arr.length + subLength - 1) / subLength },
        () => arr.splice(0, subLength)
    );

export const range = (from: number, to: number, step?: number) => {
    const s = step ?? from < to ? 1 : -1;
    return Array.from({ length: (to - from) / s + 1 }, (_, i) => from + i * s);
}

export const createArray2d = <T>(width: number, height: number, initializer: () => T): T[][] =>
    Array.from({ length: width }, () => Array.from({ length: height }, initializer));

export const inArray2d = <T>(arr: T[][], row: number, column: number) =>
    row >= 0 && row < arr.length && column >= 0 && column < arr[row].length;

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
