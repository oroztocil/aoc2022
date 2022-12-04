export const sumArray = (arr: number[]): number =>
    arr.reduce((sum, val) => sum + val, 0);

export const splitArray = <T>(arr: T[], subLength: number): T[][] =>
    Array.from(
        { length: (arr.length + subLength - 1) / subLength },
        () => arr.splice(0, subLength)
    );
