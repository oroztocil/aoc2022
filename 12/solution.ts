import { transpose } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";
import { asc } from "../utils/sort";

//
// Solution
//

type Coords = {
    x: number,
    y: number
};

const coordsEq = (a: Coords, b: Coords): boolean =>
    a.x === b.x && a.y === b.y;

type SearchNode = {
    pos: Coords,
    cost: number
};

class HeightMap {
    constructor(private values: number[][]) { }

    get mapHeight() {
        return this.values[0].length;
    }

    get mapWidth() {
        return this.values.length;
    }

    findShortestPathCost = (starts: Coords[], ends: Coords[]): number => {
        const coordsKey = (c: Coords) => `${c.x}:${c.y}`;
        const findFromStart = (start: Coords, ends: Coords[]): number => {
            const visited = new Set<string>([coordsKey(start)]);
            const queue: SearchNode[] = [{ pos: start, cost: 0 }];

            while (queue.length > 0) {
                const current = queue.shift()!;

                if (ends.some(end => coordsEq(end, current.pos))) {
                    return current.cost;
                }

                this.getMoves(current.pos).forEach(neighbor => {
                    const key = coordsKey(neighbor);
                    if (!visited.has(key)) {
                        visited.add(key);
                        queue.push({ pos: neighbor, cost: current.cost + 1 });
                    }
                });
            }

            return 42069; // ~ max int
        }

        return starts
            .map(start => findFromStart(start, ends))
            .sort(asc)[0];
    }

    private getMoves = (from: Coords): Coords[] => {
        const isValid = (pos: Coords): boolean =>
            pos.x >= 0 && pos.x < this.mapWidth
            && pos.y >= 0 && pos.y <= this.mapHeight
            && (this.getPosHeight(from) - this.getPosHeight(pos) >= -1);

        return ([
            { x: from.x, y: from.y - 1 },
            { x: from.x, y: from.y + 1 },
            { x: from.x - 1, y: from.y },
            { x: from.x + 1, y: from.y },
        ] as Coords[]).filter(pos => isValid(pos));
    }

    private getPosHeight = (pos: Coords): number =>
        this.values[pos.x][pos.y];
}

const parseInput = (input: string, startChars: string[], endChars: string[]):
    [map: HeightMap, starts: Coords[], ends: Coords[]] => {
    const letterToNum = (letter: string) =>
        letter.charCodeAt(0) - "a".charCodeAt(0);

    const starts: Coords[] = [];
    const ends: Coords[] = [];

    const values = input
        .trim()
        .split("\n")
        .map((line, y) => line
            .split("")
            .map((letter, x) => {
                if (startChars.includes(letter)) {
                    starts.push({ x, y });
                } else if (endChars.includes(letter)) {
                    ends.push({ x, y });
                }
                switch (letter) {
                    case "S": return letterToNum("a");
                    case "E": return letterToNum("z")
                    default: return letterToNum(letter);
                }
            }));
    return [new HeightMap(transpose(values)), starts, ends];
}

const bigFlamboyantSon = (input: string): number => {
    const [map, starts, ends] = parseInput(input, ["S"], ["E"]);
    return map.findShortestPathCost(starts, ends);
}

const dunno = (input: string): number => {
    const [map, starts, ends] = parseInput(input, ["S", "a"], ["E"]);
    return map.findShortestPathCost(starts, ends);
}

//
// Execution
//

process.exitCode = runTests([
    { solution: bigFlamboyantSon, expected: 31 },
    { solution: dunno, expected: 29 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: bigFlamboyantSon },
        { solution: dunno },
    ]);
}
