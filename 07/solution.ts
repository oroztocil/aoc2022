import { chunkArray, sumArray } from "../utils/arrays";
import { runProblems, runTests } from "../utils/execution";
import { asc } from "../utils/sort";

//
// Solution
//

class Directory {
    constructor(
        public name: string,
        public parent: Directory | undefined,
        public subDirs: Directory[] = [],
        public fileSizes: number[] = [],
        public listed = false
    ) { }

    getSize = (): number => {
        const myFileSize = sumArray(this.fileSizes);
        const subDirSize = sumArray(this.subDirs.map(x => x.getSize()));
        return myFileSize + subDirSize;
    }

    getSizes = (): number[] => {
        const mySize = this.getSize();
        const subDirSizes = this.subDirs.map(x => x.getSizes()).flat();
        return [mySize, ...subDirSizes];
    }

    getSubDir = (name: string): Directory | undefined =>
        this.subDirs.find(dir => dir.name === name);
}

type ParserState = {
    root: Directory;
    cd: Directory | undefined;
}

type Command = {
    name: string;
    args: string[];
}

type CommandHandler = (state: ParserState, args: string[]) => ParserState;

const processCommand = (state: ParserState, command: Command): ParserState => {
    const commandProcessor: Record<string, CommandHandler> = {
        cd: (state: ParserState, args: string[]): ParserState => {
            const destination = args[0];
            switch (destination) {
                case "/":
                    return { ...state, cd: state.root };
                case "..":
                    return { ...state, cd: state.cd?.parent }
                default:
                    return { ...state, cd: state.cd?.getSubDir(destination) }
            }
        },

        ls: (state: ParserState, args: string[]): ParserState => {
            const cd = state.cd!;

            if (!cd.listed) {
                const pairs = chunkArray(args, 2);
                const subDirs = pairs.filter(pair => pair[0] === "dir");
                const fileSizes = pairs.filter(pair => pair[0] !== "dir")
                    .map(pair => Number(pair[0]));

                // IDGAF
                cd.subDirs = subDirs.map(pair => new Directory(pair[1], state.cd));
                cd.fileSizes = fileSizes;
                cd.listed = true;
            }

            return state;
        }
    }

    return commandProcessor[command.name](state, command.args);
}

const parseCommands = (input: string): Command[] =>
    input
        .trim()
        .split("$")
        .slice(1)
        .map(line => line.trim())
        .map(line => line.replace(/\n/g, " "))
        .map(line => line.split(" "))
        .map(tokens => ({ name: tokens[0], args: tokens.slice(1) }));

const resolveFileSystem = (commands: Command[]): Directory =>
    commands.reduce(processCommand, {
        root: new Directory("/", undefined),
        cd: undefined
    }).root;

const elonReviewedThisCode = (input: string): number => {
    const commands = parseCommands(input);
    const root = resolveFileSystem(commands);
    const dirSizes = root.getSizes().filter(size => size <= 100000);
    return sumArray(dirSizes);
}

const imagineNotSortingNumbersLexicographically = (input: string): number => {
    const commands = parseCommands(input);
    const root = resolveFileSystem(commands);
    const freeSpace = 70000000 - root.getSize();
    const spaceNeeded = 30000000 - freeSpace;
    const dirSizes = root.getSizes().filter(size => size >= spaceNeeded);
    return dirSizes.sort(asc)[0];
}

//
// Execution
//

process.exitCode = runTests([
    { solution: elonReviewedThisCode, expectedResult: 95437 },
    { solution: imagineNotSortingNumbersLexicographically, expectedResult: 24933642 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: elonReviewedThisCode },
        { solution: imagineNotSortingNumbersLexicographically },
    ]);
}
