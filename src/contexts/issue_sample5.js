import { fillTail } from "./helper_functions";

const is_null = () => { };
const head = () => { };
const tail = () => { };

function accumulate(f, initial, xs) {
    return is_null(xs) ? initial : f(head(xs), accumulate(f, initial, tail(xs)));
}

function pair(x, xs) {
    return [x, xs];
}

const externalSymbols = [];
let environments = [
    {
        "name": "programEnvironment",
        "tail": null,
        "head": {
            "x": 10,
            "y": accumulate,
            "z": pair,
        },

    },
    {
        "name": "programEnvironment",
        "tail": null,
        "head": {
            accumulate: accumulate,
        },

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
            "math_SQRT2": 1.4142135623730951,
            pair: pair,
        },

    }
];

environments = fillTail(environments);

// functoin env: what it is pointing at 
accumulate.environment = environments[1];
pair.environment = environments[2];

// const node = {};
// const type0 = "ArrowFunctionExpression";
const type1 = "FunctionDeclaration";

accumulate.node = {};
pair.node = {};

accumulate.node.type = type1;
pair.node.type = type1;

accumulate.functionName = "accumulate";
// pair.functionName = type1;


accumulate.prototype.toString = function () {
    return `function accumulate(f, initial, xs) {
return is_null(xs) ? initial : f(head(xs), accumulate(f, initial, tail(xs)));
}
    `
}

pair.prototype.toString = function () {
    return `function pair(left, right) {
[implementation hidden]
}
    `;
}


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
const x = 10;
const y = accumulate;
const z= pair;
"breakpoint here";
*/
