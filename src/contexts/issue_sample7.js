import { fillTail } from "./helper_functions";

function fib(n) {
    return "This is a fib function";
}

const externalSymbols = [];
let environments = [
    {
        "name": "blockEnvironment",
        "tail": null,
        "head": {},
        "envKeyCounter": 11
    },
    {
        "name": "functionBodyEnvironment",
        "tail": null,
        "head": {},
        "envKeyCounter": 10
    },
    {
        "name": "fib",
        "tail": null,
        "head": {
            "n": 3
        },
        "callExpression": {
            "type": "CallExpression",
            "start": 116,
            "end": 124,
            "loc": {
                "start": {
                    "line": 6,
                    "column": 15
                },
                "end": {
                    "line": 6,
                    "column": 23
                }
            },
            "callee": {
                "type": "Identifier",
                "start": 116,
                "end": 119,
                "loc": {
                    "start": {
                        "line": 6,
                        "column": 15
                    },
                    "end": {
                        "line": 6,
                        "column": 18
                    }
                },
                "name": "fib",
                "inferredType": {
                    "kind": "function",
                    "parameterTypes": [
                        {
                            "kind": "primitive",
                            "name": "number"
                        }
                    ],
                    "returnType": {
                        "kind": "primitive",
                        "name": "number"
                    }
                },
                "typability": "Typed"
            },
            "arguments": [
                {
                    "type": "Literal",
                    "value": 3
                }
            ],
            "inferredType": {
                "kind": "primitive",
                "name": "number"
            },
            "typability": "Typed"
        },
        "envKeyCounter": 9
    },
    {
        "name": "blockEnvironment",
        "tail": null,
        "head": {},
        "envKeyCounter": 8
    },
    {
        "name": "functionBodyEnvironment",
        "tail": null,
        "head": {},
        "envKeyCounter": 7
    },
    {
        "name": "fib",
        "tail": null,
        "head": {
            "n": 4
        },
        "callExpression": {
            "type": "CallExpression",
            "start": 116,
            "end": 124,
            "loc": {
                "start": {
                    "line": 6,
                    "column": 15
                },
                "end": {
                    "line": 6,
                    "column": 23
                }
            },
            "callee": {
                "type": "Identifier",
                "start": 116,
                "end": 119,
                "loc": {
                    "start": {
                        "line": 6,
                        "column": 15
                    },
                    "end": {
                        "line": 6,
                        "column": 18
                    }
                },
                "name": "fib",
                "inferredType": {
                    "kind": "function",
                    "parameterTypes": [
                        {
                            "kind": "primitive",
                            "name": "number"
                        }
                    ],
                    "returnType": {
                        "kind": "primitive",
                        "name": "number"
                    }
                },
                "typability": "Typed"
            },
            "arguments": [
                {
                    "type": "Literal",
                    "value": 4
                }
            ],
            "inferredType": {
                "kind": "primitive",
                "name": "number"
            },
            "typability": "Typed"
        },
        "envKeyCounter": 6
    },
    {
        "name": "blockEnvironment",
        "tail": null,
        "head": {},
        "envKeyCounter": 5
    },
    {
        "name": "functionBodyEnvironment",
        "tail": null,
        "head": {},
        "envKeyCounter": 4
    },
    {
        "name": "fib",
        "tail": null,
        "head": {
            "n": 5
        },
        "callExpression": {
            "type": "CallExpression",
            "start": 153,
            "end": 159,
            "loc": {
                "start": {
                    "line": 11,
                    "column": 0
                },
                "end": {
                    "line": 11,
                    "column": 6
                }
            },
            "callee": {
                "type": "Identifier",
                "start": 153,
                "end": 156,
                "loc": {
                    "start": {
                        "line": 11,
                        "column": 0
                    },
                    "end": {
                        "line": 11,
                        "column": 3
                    }
                },
                "name": "fib",
                "inferredType": {
                    "kind": "function",
                    "parameterTypes": [
                        {
                            "kind": "primitive",
                            "name": "number"
                        }
                    ],
                    "returnType": {
                        "kind": "primitive",
                        "name": "number"
                    }
                },
                "typability": "Typed"
            },
            "arguments": [
                {
                    "type": "Literal",
                    "value": 5
                }
            ],
            "inferredType": {
                "kind": "primitive",
                "name": "number"
            },
            "typability": "Typed"
        },
        "envKeyCounter": 3
    },
    {
        "name": "programEnvironment",
        "tail": null,
        "head": { fib: fib },
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
];

environments = fillTail(environments);
environments[5].tail = environments[9];
environments[2].tail = environments[9];


// functoin env: what it is pointing at
fib.environment = environments[9];

// const node = {};
// const type0 = "ArrowFunctionExpression";
const type1 = "FunctionDeclaration";

fib.node = {};
fib.node.type = type1;

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
function fib(n) {
    if (n<=1) {
        return n;
    } else {
        "breakpoint here";
        return fib(n-1)+fib(n-2);

    }
}

fib(5);
*/
