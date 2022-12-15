export class Interval {
    constructor(
        public readonly from: number,
        public readonly to: number) { }

    get length(): number {
        return this.to - this.from;
    }

    overlaps(other: Interval): boolean {
        return Interval.overlaps([this, other]);
    }

    overlapsWholeHog(other: Interval): boolean {
        return Interval.overlapsWholeHog([this, other]);
    };

    static overlaps = ([a, b]: [Interval, Interval]): boolean =>
        (a.from <= b.to && a.to >= b.from);

    static overlapsWholeHog = ([a, b]: [Interval, Interval]): boolean =>
        (a.from <= b.from && a.to >= b.to)
        || (a.from >= b.from && a.to <= b.to);

    static sortAsc = (a: Interval, b: Interval): number =>
        a.from !== b.from
            ? a.from - b.from
            : a.to - b.to;

    static unionAll = (...intervals: Interval[]): Interval[] => {
        intervals.sort(Interval.sortAsc);
        const result: Interval[] = [intervals[0]];

        for (const next of intervals.slice(1)) {
            if (next.from > result.at(-1)!.to) {
                // Disjoint intervals, add new
                result.push(next);
            } else if (result.at(-1)!.to < next.to) {
                // Extend interval
                result[result.length - 1] = new Interval(result[result.length - 1].from, next.to);
            }
        }

        return result;
    }
}