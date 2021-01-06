import { fillTail } from "./helper_functions";

const fn0 = () => 1;
function fn1() {
    return "This is a function body";
}
const arr0 = [1, [[1, 2], 3], 4];

const externalSymbols = [];
let environments = [
    {
        name: "programEnvironment",
        tail: null,
        head: {
            fn: fn0,
            x: arr0,
            l: [
                "This is a long string.",
                [
                    [
                        [1, [2, [3, [fn0, null]]]],
                        [
                            [[1, 2], 3],
                            [
                                [1, [1, 2], fn0, 4, 5],
                                [4, null],
                            ],
                        ],
                    ],
                    [fn1, [arr0, null]],
                ],
            ],
        },
    },
    {
        name: "programEnvironment",
        tail: null,
        head: {},
    },
    {
        tail: null,
        name: "global",
        head: {
            NaN: null,
            Infinity: null,
            math_E: 2.718281828459045,
            math_LN10: 2.302585092994046,
            math_LN2: 0.6931471805599453,
            math_LOG10E: 0.4342944819032518,
            math_LOG2E: 1.4426950408889634,
            math_PI: 3.141592653589793,
            math_SQRT1_2: 0.7071067811865476,
            math_SQRT2: 1.4142135623730951,
        },
    },
];

environments = fillTail(environments);

fn0.environment = environments[0];
fn1.environment = environments[0];

const type0 = "ArrowFunctionExpression";
const type1 = "FunctionDeclaration";

fn0.node = {};
fn1.node = {};

fn0.node.type = type0;
fn1.node.type = type1;

//simplified context
const context = {
    context: {
        context: {
            runtime: {
                environments: environments,
            },
            externalSymbols: externalSymbols,
        },
    },
};

export default context;

/*
const fn = () => 1;
const x = [1, pair(pair(1, 2), 3), 4];
const l = list(1,
list(list(1, 2, 3, fn),x[1] , [1, pair(1,2), fn, 4, 5], 4),
() => 9, x);

"breakpoint here";
*/

