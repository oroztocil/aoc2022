import { sumArray } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

class BigSet {
    sets: Array<Set<string>>

    constructor() {
        this.sets = [new Set()]
    }

    add(v: string) {
        if (this.sets[this.sets.length - 1].size === 16777000) this.sets.push(new Set())
        return this.sets[this.sets.length - 1].add(v)
    }

    has(v: string) {
        for (const set of this.sets) {
            if (set.has(v)) return true
        }
        return false;
    }
}

type Resources = {
    ore: number;
    clay: number;
    obsidian: number;
    geodes: number;
}

type Blueprint = {
    oreRobot: Resources;
    clayRobot: Resources;
    obsidianRobot: Resources;
    geodeRobot: Resources;
}

const parseInput = (input: string): Blueprint[] =>
    input
        .trim()
        .split("\n")
        .map(line => {
            const parts = line.split(".");
            return {
                oreRobot: {
                    ore: Number(parts[0].match(/.*costs (\d+) ore/)![1]),
                    clay: 0,
                    obsidian: 0,
                    geodes: 0
                },
                clayRobot: {
                    ore: Number(parts[1].match(/.*costs (\d+) ore/)![1]),
                    clay: 0,
                    obsidian: 0,
                    geodes: 0
                },
                obsidianRobot: {
                    ore: Number(parts[2].match(/.*costs (\d+) ore/)![1]),
                    clay: Number(parts[2].match(/.*and (\d+) clay/)![1]),
                    obsidian: 0,
                    geodes: 0
                },
                geodeRobot: {
                    ore: Number(parts[3].match(/.*costs (\d+) ore/)![1]),
                    clay: 0,
                    obsidian: Number(parts[3].match(/.*and (\d+) obsidian/)![1]),
                    geodes: 0
                }
            };
        });

type State = Resources & {
    oreRobots: number;
    clayRobots: number;
    obsidianRobots: number;
    geodeRobots: number;
    time: number;
}

const getActionStates = (state: State, blueprint: Blueprint, visited: BigSet): State[] => {
    if (state.time <= 0) {
        return [];
    }

    const income: Resources = {
        ore: state.oreRobots,
        clay: state.clayRobots,
        obsidian: state.obsidianRobots,
        geodes: state.geodeRobots
    }

    const result: State[] = [];

    // Build geode robot
    if (state.ore >= blueprint.geodeRobot.ore
        && state.obsidian >= blueprint.geodeRobot.obsidian) {
        result.push({
            ...state,
            ore: state.ore - blueprint.geodeRobot.ore,
            obsidian: state.obsidian - blueprint.geodeRobot.obsidian,
            geodeRobots: state.geodeRobots + 1
        });
    } else {
        result.push(state);

        // Build ore robot
        if (state.oreRobots < 7 && state.ore >= blueprint.oreRobot.ore) {
            result.push({
                ...state,
                ore: state.ore - blueprint.oreRobot.ore,
                oreRobots: state.oreRobots + 1
            });
        }

        // Build clay robot
        if (state.clayRobots < 9 && state.ore >= blueprint.clayRobot.ore) {
            result.push({
                ...state,
                ore: state.ore - blueprint.clayRobot.ore,
                clayRobots: state.clayRobots + 1
            });
        }

        // Build obsidian robot
        if (state.obsidianRobots < 8 && state.ore >= blueprint.obsidianRobot.ore
            && state.clay >= blueprint.obsidianRobot.clay) {
            result.push({
                ...state,
                ore: state.ore - blueprint.obsidianRobot.ore,
                clay: state.clay - blueprint.obsidianRobot.clay,
                obsidianRobots: state.obsidianRobots + 1
            });
        }
    }

    // Add income, reduce remaining time, filter visited
    return result.map(state => ({
        ...state,
        ore: state.ore + income.ore,
        clay: state.clay + income.clay,
        obsidian: state.obsidian + income.obsidian,
        geodes: state.geodes + income.geodes,
        time: state.time - 1
    })).filter(state => !visited.has(getStateKey(state)));
}

const getStateKey = (state: State): string =>
    `${state.time}:${state.clay}:${state.clayRobots}:${state.geodeRobots}:${state.geodes}:${state.obsidian}:${state.obsidianRobots}:${state.ore}:${state.oreRobots}`;

const evalBlueprint = (blueprint: Blueprint, timeLimit: number, index: number): number => {
    console.log("starting " + index);
    console.log(blueprint);
    const initState: State = {
        ore: 2,
        clay: 0,
        obsidian: 0,
        geodes: 0,
        oreRobots: 1,
        clayRobots: 0,
        obsidianRobots: 0,
        geodeRobots: 0,
        time: timeLimit
    };

    const visited = new BigSet();
    let stack: State[] = [initState];
    let bestResult = 0;
    let bestState = initState;

    while (stack.length > 0) {
        const state = stack.pop()!;
        if (state.geodes >= bestResult) {
            bestResult = state.geodes;
            bestState = state;
        }
        if (state.time > 0) {
            const nextStates = getActionStates(state, blueprint, visited);
            nextStates.forEach(ns => visited.add(getStateKey(ns)))
            stack.push(...nextStates);
        }
    }

    console.log("finished " + index + " best score " + bestResult);
    console.log(bestState);

    return bestResult;
}

const alg1 = (input: string): number => {
    const blueprints = parseInput(input);
    const qualities = blueprints.map((b, i) => evalBlueprint(b, 22, i));
    return sumArray(qualities.map((value, i) => value * (i + 1)));
}

const alg2 = (input: string): number => {
    const blueprints = parseInput(input);
    const qualities = blueprints.map((b, i) => evalBlueprint(b, 30, i));
    console.log(qualities);
    return qualities.reduce((acc, val) => acc * val, 1);
}

//
// Execution
//

process.exitCode = runTests([
    { solution: alg1, expectedResult: 33 },
    { solution: alg2, expectedResult: 420 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: alg1 },
        { solution: alg2, inputFile: "input_sm.txt" },
    ]);
}
