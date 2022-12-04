export const intersect = <T>(sets: Set<T>[]): T[] =>
    Array.from(
        sets.reduce((result, set) => intersect2(result, set), sets[0] as Set<T> | T[])
    );

export const intersect2 = <T>(a: Set<T> | T[], b: Set<T>): T[] =>
    a === b ? Array.from(a) : Array.from(a).filter(e => b.has(e));