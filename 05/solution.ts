import { runProblems, runTests } from "../utils/execution";
import { isAlpha } from "../utils/strings";

//
// Solution
//

type Stack = string[];
type Instruction = {
    count: number;
    from: number,
    to: number;
}

const parseStacks = (input: string): Stack[] => {
    let lines = input.split("\n");
    lines.pop();
    lines.reverse()

    const stackCount = (lines[0].length + 1) / 4;
    const stacks: Stack[] = Array.from(new Array(stackCount), () => []);

    lines.forEach(line => {
        for (let i = 0; i < stackCount; i++) {
            const char = line[1 + i * 4];
            if (char && isAlpha(char)) {
                stacks[i].push(char);
            }
        }
    })
    return stacks;
}

const parseInstructions = (input: string): Instruction[] => {
    const lines = input.split("\n");
    return lines.map(line => {
        const tokens = line.split(" ");
        return {
            count: Number(tokens[1]),
            from: Number(tokens[3]) - 1,
            to: Number(tokens[5]) - 1
        };
    });        
}

const crane9000Handler = (stacks: Stack[], instruction: Instruction): void => {
    for (let i = 0; i < instruction.count; i++) {
        const item = stacks[instruction.from].pop() as string;
        stacks[instruction.to].push(item);
    }
}

const crane9001Handler = (stacks: Stack[], instruction: Instruction): void => {
    const fromStack = stacks[instruction.from];
    const movedItems = fromStack.splice(fromStack.length - instruction.count);
    movedItems.forEach(item => stacks[instruction.to].push(item));
}

type InstructionHandler = (stacks: Stack[], instruction: Instruction) => void;

const listenUpPal = (input: string, handler: InstructionHandler): string => {
    const [stackInput, instructionInput] = input.split("\n\n");
    const stacks = parseStacks(stackInput);
    const instructions = parseInstructions(instructionInput.trim());

    instructions.forEach(instruction => handler(stacks, instruction));

    return stacks.reduce((result, stack) => {
        const topItem = stack.at(-1);
        return topItem ? result + topItem : result;
    }, "");
}

//
// Execution
//

process.exitCode = runTests([
    { solution: input => listenUpPal(input, crane9000Handler), expectedResult: "CMZ" },
    { solution: input => listenUpPal(input, crane9001Handler), expectedResult: "MCD" },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: input => listenUpPal(input, crane9000Handler) },
        { solution: input => listenUpPal(input, crane9001Handler) },
    ]);
}
