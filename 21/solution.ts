import { runProblems, runTests } from "../utils/execution";

//
// Solution
//

type Value = {
    x0: number;
    x1: number;
}

type Expression = Value | {
    left: Value | string;
    right: Value | string;
    op: string;
}

const isValue = (e: Expression | string): e is Value => {
    return (e as Value).x0 !== undefined
}

const parseInput = (input: string): [string, Expression][] => {
    const lines = input.trim().split("\n");
    return lines.map(line => {
        const [id, rest] = line.split(":").map(s => s.trim());
        if (!isNaN(+rest)) {
            return [id, { x0: Number(rest), x1: 0 }];
        } else {
            const [_, left, op, right] = rest.match(/([a-z]+) ([+\S-\*\/]) ([a-z]+)/) ?? [];
            return [id, { left, right, op }];
        }
    })
}

const evalExpression = (expr: Expression, map: Map<string, Expression>): Value => {
    if (isValue(expr)) {
        return expr;
    } else {
        const left = isValue(expr.left)
            ? expr.left
            : evalExpression(map.get(expr.left)!, map);

        const right = isValue(expr.right)
            ? expr.right
            : evalExpression(map.get(expr.right)!, map);

        switch (expr.op) {
            case "+":
                return {
                    x0: left.x0 + right.x0,
                    x1: left.x1 + right.x1
                };
            case "-":
                return {
                    x0: left.x0 - right.x0,
                    x1: left.x1 - right.x1
                };
            case "*":
                return {
                    x0: left.x0 * right.x0,
                    x1: left.x1 * right.x0 + right.x1 * left.x0
                };
            case "/":
            default:
                return {
                    x0: left.x0 / right.x0,
                    x1: right.x1 !== 0
                        ? left.x0 / right.x1
                        : left.x1 / right.x0
                };
        }
    }
}

const mathIsRacist = (input: string): number => {
    const expressions = parseInput(input);
    const expressionMap = new Map<string, Expression>(expressions);
    const root = expressionMap.get("root")! as Exclude<Expression, Value>;

    return evalExpression(root, expressionMap).x0;
}

const sike = (input: string): number => {
    const expressions = parseInput(input);
    const expressionMap = new Map<string, Expression>(expressions);
    expressionMap.set("humn", { x0: 0, x1: 1 });

    const root = expressionMap.get("root")! as Exclude<Expression, Value>;
    const rootLeft = expressionMap.get(root.left as string)!;
    const rootRight = expressionMap.get(root.right as string)!;

    const rootLeftVal = evalExpression(rootLeft, expressionMap);
    const rootRightVal = evalExpression(rootRight, expressionMap);

    return (rootRightVal.x0 - rootLeftVal.x0) / (rootLeftVal.x1 - rootRightVal.x1);
}

//
// Execution
//

process.exitCode = runTests([
    { solution: mathIsRacist, expectedResult: 152 },
    { solution: sike, expectedResult: 301 },
]);

if (!process.env.TESTS_ONLY) {
    runProblems([
        { solution: mathIsRacist },
        { solution: sike },
    ]);
}
