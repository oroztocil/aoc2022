import { runProblems, runTests } from "../utils/execution.js";

//
// Solution
//

type Move = {
    dx: 1 | 0 | -1,
    dy: 1 | 0 | -1
}

type Position = {
    x: number,
    y: number
}

class Rope {
    constructor(private positions: Position[]) { }

    get head(): Position {
        return this.positions[0];
    }

    get tail(): Position {
        return this.positions[this.positions.length - 1];
    }

    static start = (length: number, x: number, y: number): Rope =>
        new Rope(Array.from({ length: length }, () => ({ x, y })));

    applyMove = (move: Move): Rope => {
        const follow = (leader: Position, follower: Position): Position => {
            const [dx, dy] = [leader.x - follower.x, leader.y - follower.y];
            const [adx, ady] = [Math.abs(dx), Math.abs(dy)];

            if (adx > 1 || ady > 1) {
                return {
                    x: follower.x + (adx > 1 ? dx / 2 : dx),
                    y: follower.y + (ady > 1 ? dy / 2 : dy)
                };
            } else {
                return follower;
            }
        }

        const newHead = { x: this.head.x + move.dx, y: this.head.y + move.dy };
        const newPositions = [newHead];
        let leader = newHead;

        this.positions.slice(1).forEach(follower => {
            const movedFollower = follow(leader, follower);
            newPositions.push(movedFollower);
            leader = movedFollower;
        })

        return new Rope(newPositions);
    }
}

const parseMoves = (input: string): Move[] => {
    const parseDir = (input: string): Move => {
        switch (input) {
            case "R": return { dx: 1, dy: 0 };
            case "L": return { dx: -1, dy: 0 };
            case "U": return { dx: 0, dy: -1 };
            case "D": return { dx: 0, dy: 1 };
            default: throw new Error("Sus move detected");
        }
    }

    return input
        .trim()
        .split("\n")
        .flatMap(line => {
            const [dir, count] = line.split(" ");
            const move = parseDir(dir);
            return Array.from({ length: Number(count) }, () => move);
        })
}

const solve = (input: string, ropeLength: number): number => {
    const moves = parseMoves(input);
    const visited = new Set<string>(["0:0"]);
    let rope = Rope.start(ropeLength, 0, 0);

    moves.forEach(move => {
        rope = rope.applyMove(move);
        visited.add(`${rope.tail.x}:${rope.tail.y}`);
    });

    return visited.size;
}

const heyComputer = (input: string): number =>
    solve(input, 2);

const whereAreMyFriendsTonight = (input: string): number =>
    solve(input, 10);

//
// Execution
//

process.exitCode = runTests([
    { solution: heyComputer, expectedResult: 13 },
    { solution: whereAreMyFriendsTonight, inputFile: "test2.txt", expectedResult: 36 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: heyComputer },
        { solution: whereAreMyFriendsTonight },
    ]);
}
