import { inArray2d, sumArray } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";
import { desc } from "../utils/sort";

//
// Solution
//

const parseInput = (input: string): number[][] =>
    input
        .trim()
        .split("\n")
        .map(line => line.split("").map(Number));

type TreeStats = {
    isVisible: boolean,
    realEstateScore: number
}

const getTreeStats = ([tx, ty]: [number, number], trees: number[][]): TreeStats => {
    const lookAtTrees = (
        [dirX, dirY]: [number, number],
        stats: TreeStats): TreeStats => {
        let [x, y] = [tx + dirX, ty + dirY];
        let treeLevel = trees[ty][tx];
        let visibleTrees = 0;
        let blockedView = false;

        while (inArray2d(trees, y, x)) {
            if (!blockedView) {
                visibleTrees++;
            }

            blockedView = blockedView || treeLevel <= trees[y][x];
            treeLevel = Math.max(treeLevel, trees[y][x]);
            [x, y] = [x + dirX, y + dirY];
        }

        return {
            isVisible: stats.isVisible
                || !blockedView
                || treeLevel < trees[ty][tx],
            realEstateScore: stats.realEstateScore * visibleTrees
        };
    }

    const directions: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

    return directions.reduce((stats, dir) => lookAtTrees(dir, stats), {
        isVisible: false,
        realEstateScore: 1
    } as TreeStats);
}

const asmrGptWhen = (input: string): number => {
    const trees = parseInput(input);
    const forestStats = trees
        .flatMap((_, y) => trees[y].map((_, x) => getTreeStats([x, y], trees)));
    return sumArray(forestStats.map(tree => tree.isVisible ? 1 : 0));
}

const gentrifyMeDaddy = (input: string): number => {
    const trees = parseInput(input);
    const forestStats = trees
        .flatMap((_, y) => trees[y].map((_, x) => getTreeStats([x, y], trees)));
    return forestStats.map(tree => tree.realEstateScore).sort(desc)[0];
}

//
// Execution
//

process.exitCode = runTests([
    { solution: asmrGptWhen, expectedResult: 21 },
    { solution: gentrifyMeDaddy, expectedResult: 8 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: asmrGptWhen },
        { solution: gentrifyMeDaddy },
    ]);
}
