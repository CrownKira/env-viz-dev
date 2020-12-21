import { fillTail } from "./helper_functions";

const fn0 = () => 1;
const fn1 = () => 2;

const arr0 = [3, [4, [5, null]]];
const arr1 = [fn0, [4, [5, null]]];
const arr2 = [1, 2];

const externalSymbols = [];
let environments = [
    {
        name: "programEnvironment",
        tail: null,
        head: {
            e: [arr0, [2, [arr0, null]]],
            f: [1, 2],
            g: [arr1, [2, [arr1, null]]],
            y: [arr2, [fn1, arr2]],
        },
        envKeyCounter: 3,
    },
    {
        name: "programEnvironment",
        tail: null,
        head: {},
        envKeyCounter: 4,
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
        envKeyCounter: 5,
    },
];

environments = fillTail(environments);

fn0.environment = environments[0];
fn1.environment = environments[0];

const node = {};
const type = "ArrowFunctionExpression";

fn0.node = node;
fn1.node = node;

fn0.node.type = type;
fn1.node.type = type;

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
const e = list(null, 2, list(3,4,5));
set_head(e, head(tail(tail(e))));

const f = pair(1,2);

const g = list(null, 2, list(() => 1,4,5));
set_head(g, head(tail(tail(g))));

const y = pair(null, pair(() => 2, pair(1,2)));
set_head(y, tail(tail(y)));

"breakpoint here";
*/
