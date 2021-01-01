import { fillTail } from "./helper_functions";

const fn0 = () => 0;
const fn1 = () => 1;

const xs0 = [4, [5, [6, null]]];
const xs1 = [1, "hello world", fn0, [1, [2, [3, null]]], xs0, null];
xs1[xs1.length - 1] = xs1;

const externalSymbols = [];
let environments = [
    {
        "name": "programEnvironment",
        "tail": null,
        "head": {
            "y": xs0,
            "x": xs1,
            "z": fn1
        },
        "envKeyCounter": 2
    },
    {
        "name": "programEnvironment",
        "tail": null,
        "head": {},
        "envKeyCounter": 1
    },
    {
        "tail": null,
        "name": "global",
        "head": {
            "NaN": null,
            "Infinity": null,
            "math_E": 2.718281828459045,
            "math_LN10": 2.302585092994046,
            "math_LN2": 0.6931471805599453,
            "math_LOG10E": 0.4342944819032518,
            "math_LOG2E": 1.4426950408889634,
            "math_PI": 3.141592653589793,
            "math_SQRT1_2": 0.7071067811865476,
            "math_SQRT2": 1.4142135623730951
        },
        "envKeyCounter": 0
    }
]

environments = fillTail(environments);

// function env: what it is pointing at
fn0.environment = environments[0];
fn1.environment = environments[0];

// // const node = {};
const type0 = "ArrowFunctionExpression";
// const type1 = "FunctionDeclaration";

fn0.node = {};
fn0.node.type = type0;
fn1.node = {};
fn1.node.type = type0;

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
const y = list(4,5,6);
const x = [1,"hello world", ()=>1, list(1,2,3), y, null];
const z = ()=>2;
"breakpoint here";
*/
