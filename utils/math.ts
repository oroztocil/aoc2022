export const sum = (a: number, b: number) => a + b;
export const sub = (a: number, b: number) => a - b;
export const mul = (a: number, b: number) => a * b;
export const div = (a: number, b: number) => a / b;

export const operations: Record<string, (a: number, b: number) => number> = {
    "+": sum,
    "-": sub,
    "*": mul,
    "/": div
}