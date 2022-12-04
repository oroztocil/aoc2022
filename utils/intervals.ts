export class Interval {
    constructor(public from: number, public to: number) { }

    overlaps = (other: Interval) =>
        Interval.overlaps([this, other]);

    overlapsWholeHog = (other: Interval) =>
        Interval.overlapsWholeHog([this, other]);

    static overlaps = ([a, b]: [Interval, Interval]) =>
        (a.from <= b.to && a.to >= b.from);

    static overlapsWholeHog = ([a, b]: [Interval, Interval]) =>
        (a.from <= b.from && a.to >= b.to)
        || (a.from >= b.from && a.to <= b.to);
}