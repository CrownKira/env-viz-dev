import { fillTail } from "./helper_functions";

const fn0 = () => "This is a long function body";
const fn1 = () => 1;
const fn2 = () => 2;
const fn3 = () => 3;
const fn4 = () => 4;
const arr0 = [
    [2, 3],
    [fn3, null],
];
const arr1 = [1, [fn1, fn2], [1, arr0], fn4, 5, 6];

const externalSymbols = [];
// an environment is a list-like object with head and tail
// head is the first frame object
// tail is the rest of the frame objects
// the 2nd frame here contains nothing
// environment eg.
// "functionBodyEnvironment",
// "programEnvironment,
// "blockEnvironment".
// "global"
let environments = [
    {
        name: "programEnvironment",
        tail: null,
        head: {
            fn: fn0,
            x: arr1,
            y: [
                arr1[1],
                [
                    [1, arr0],
                    [fn2, [arr0, [fn0, null]]],
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
fn2.environment = environments[0];
fn3.environment = environments[0];
fn4.environment = environments[0];

// const node = {};
const type = "ArrowFunctionExpression";
// "FunctionDeclaration"

fn0.node = {};
fn1.node = {};
fn2.node = {};
fn3.node = {};
fn4.node = {};

fn0.node.type = type;
fn1.node.type = type;
fn2.node.type = type;
fn3.node.type = type;
fn4.node.type = type;

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
const fn = () => "L";
const x = [1, pair(() => 1, () => 2), list(1, pair(2, 3), () => 3), () => "THIS", 5, 6];
const y = list(x[1], x[2], tail(x[1]), tail(x[2]), fn);

"breakpoint here";
*/
