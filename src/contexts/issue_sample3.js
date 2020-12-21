function fn0(x) {
    return "function 0";
}
const fn1 = (x) => "function 1";

const externalSymbols = [];
const environments = [
    {
        name: "functionBodyEnvironment",
        tail: {
            name: "x => ...",
            tail: {
                name: "functionBodyEnvironment",
                tail: {
                    name: "fn0",
                    tail: {
                        name: "programEnvironment",
                        tail: {
                            name: "programEnvironment",
                            tail: {
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
                                envKeyCounter: 6,
                            },
                            head: {},
                            envKeyCounter: 5,
                        },
                        head: {
                            fn0: fn0,
                        },
                        envKeyCounter: 4,
                    },
                    head: { fn1: fn1 },
                    callExpression: {
                        type: "CallExpression",
                        start: 95,
                        end: 112,
                        loc: {
                            start: {
                                line: 8,
                                column: 0,
                            },
                            end: {
                                line: 8,
                                column: 17,
                            },
                        },
                        callee: {
                            type: "Identifier",
                            start: 95,
                            end: 101,
                            loc: {
                                start: {
                                    line: 8,
                                    column: 0,
                                },
                                end: {
                                    line: 8,
                                    column: 6,
                                },
                            },
                            name: "fn0",
                            inferredType: {
                                kind: "function",
                                parameterTypes: [
                                    {
                                        kind: "function",
                                        parameterTypes: [
                                            {
                                                kind: "primitive",
                                                name: "number",
                                            },
                                        ],
                                        returnType: {
                                            kind: "primitive",
                                            name: "undefined",
                                        },
                                    },
                                ],
                                returnType: {
                                    kind: "primitive",
                                    name: "undefined",
                                },
                            },
                            typability: "Typed",
                        },
                        arguments: [
                            {
                                type: "Identifier",
                                name: "undefined",
                            },
                        ],
                        inferredType: {
                            kind: "variable",
                            name: "T19",
                            constraint: "none",
                        },
                        typability: "Typed",
                    },
                    envKeyCounter: 3,
                },
                head: {},
                envKeyCounter: 2,
            },
            head: {
                x: 10,
            },
            callExpression: {
                type: "CallExpression",
                start: 85,
                end: 90,
                loc: {
                    start: {
                        line: 5,
                        column: 4,
                    },
                    end: {
                        line: 5,
                        column: 9,
                    },
                },
                callee: {
                    type: "Identifier",
                    start: 85,
                    end: 86,
                    loc: {
                        start: {
                            line: 5,
                            column: 4,
                        },
                        end: {
                            line: 5,
                            column: 5,
                        },
                    },
                    name: "a",
                    inferredType: {
                        kind: "function",
                        parameterTypes: [
                            {
                                kind: "primitive",
                                name: "number",
                            },
                        ],
                        returnType: {
                            kind: "primitive",
                            name: "undefined",
                        },
                    },
                    typability: "Typed",
                },
                arguments: [
                    {
                        type: "Literal",
                        value: 10,
                    },
                ],
                inferredType: {
                    kind: "primitive",
                    name: "undefined",
                },
                typability: "Typed",
            },
            envKeyCounter: 1,
        },
        head: {},
        envKeyCounter: 0,
    },
    {
        name: "x => ...",
        tail: {
            name: "functionBodyEnvironment",
            tail: {
                name: "fn0",
                tail: {
                    name: "programEnvironment",
                    tail: {
                        name: "programEnvironment",
                        tail: {
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
                            envKeyCounter: 6,
                        },
                        head: {},
                        envKeyCounter: 5,
                    },
                    head: {
                        fn0: fn0,
                    },
                    envKeyCounter: 4,
                },
                head: { fn1: fn1 },
                callExpression: {
                    type: "CallExpression",
                    start: 95,
                    end: 112,
                    loc: {
                        start: {
                            line: 8,
                            column: 0,
                        },
                        end: {
                            line: 8,
                            column: 17,
                        },
                    },
                    callee: {
                        type: "Identifier",
                        start: 95,
                        end: 101,
                        loc: {
                            start: {
                                line: 8,
                                column: 0,
                            },
                            end: {
                                line: 8,
                                column: 6,
                            },
                        },
                        name: "fn0",
                        inferredType: {
                            kind: "function",
                            parameterTypes: [
                                {
                                    kind: "function",
                                    parameterTypes: [
                                        {
                                            kind: "primitive",
                                            name: "number",
                                        },
                                    ],
                                    returnType: {
                                        kind: "primitive",
                                        name: "undefined",
                                    },
                                },
                            ],
                            returnType: {
                                kind: "primitive",
                                name: "undefined",
                            },
                        },
                        typability: "Typed",
                    },
                    arguments: [
                        {
                            type: "Identifier",
                            name: "undefined",
                        },
                    ],
                    inferredType: {
                        kind: "variable",
                        name: "T19",
                        constraint: "none",
                    },
                    typability: "Typed",
                },
                envKeyCounter: 3,
            },
            head: {},
            envKeyCounter: 2,
        },
        head: {
            x: 10,
        },
        callExpression: {
            type: "CallExpression",
            start: 85,
            end: 90,
            loc: {
                start: {
                    line: 5,
                    column: 4,
                },
                end: {
                    line: 5,
                    column: 9,
                },
            },
            callee: {
                type: "Identifier",
                start: 85,
                end: 86,
                loc: {
                    start: {
                        line: 5,
                        column: 4,
                    },
                    end: {
                        line: 5,
                        column: 5,
                    },
                },
                name: "a",
                inferredType: {
                    kind: "function",
                    parameterTypes: [
                        {
                            kind: "primitive",
                            name: "number",
                        },
                    ],
                    returnType: {
                        kind: "primitive",
                        name: "undefined",
                    },
                },
                typability: "Typed",
            },
            arguments: [
                {
                    type: "Literal",
                    value: 10,
                },
            ],
            inferredType: {
                kind: "primitive",
                name: "undefined",
            },
            typability: "Typed",
        },
        envKeyCounter: 1,
    },
    {
        name: "functionBodyEnvironment",
        tail: {
            name: "fn0",
            tail: {
                name: "programEnvironment",
                tail: {
                    name: "programEnvironment",
                    tail: {
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
                        envKeyCounter: 6,
                    },
                    head: {},
                    envKeyCounter: 5,
                },
                head: {
                    fn0: fn0,
                },
                envKeyCounter: 4,
            },
            head: { fn1: fn1 },
            callExpression: {
                type: "CallExpression",
                start: 95,
                end: 112,
                loc: {
                    start: {
                        line: 8,
                        column: 0,
                    },
                    end: {
                        line: 8,
                        column: 17,
                    },
                },
                callee: {
                    type: "Identifier",
                    start: 95,
                    end: 101,
                    loc: {
                        start: {
                            line: 8,
                            column: 0,
                        },
                        end: {
                            line: 8,
                            column: 6,
                        },
                    },
                    name: "fn0",
                    inferredType: {
                        kind: "function",
                        parameterTypes: [
                            {
                                kind: "function",
                                parameterTypes: [
                                    {
                                        kind: "primitive",
                                        name: "number",
                                    },
                                ],
                                returnType: {
                                    kind: "primitive",
                                    name: "undefined",
                                },
                            },
                        ],
                        returnType: {
                            kind: "primitive",
                            name: "undefined",
                        },
                    },
                    typability: "Typed",
                },
                arguments: [
                    {
                        type: "Identifier",
                        name: "undefined",
                    },
                ],
                inferredType: {
                    kind: "variable",
                    name: "T19",
                    constraint: "none",
                },
                typability: "Typed",
            },
            envKeyCounter: 3,
        },
        head: {},
        envKeyCounter: 2,
    },
    {
        name: "fn0",
        tail: {
            name: "programEnvironment",
            tail: {
                name: "programEnvironment",
                tail: {
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
                    envKeyCounter: 6,
                },
                head: {},
                envKeyCounter: 5,
            },
            head: {
                fn0: fn0,
            },
            envKeyCounter: 4,
        },
        head: { fn1: fn1 },
        callExpression: {
            type: "CallExpression",
            start: 95,
            end: 112,
            loc: {
                start: {
                    line: 8,
                    column: 0,
                },
                end: {
                    line: 8,
                    column: 17,
                },
            },
            callee: {
                type: "Identifier",
                start: 95,
                end: 101,
                loc: {
                    start: {
                        line: 8,
                        column: 0,
                    },
                    end: {
                        line: 8,
                        column: 6,
                    },
                },
                name: "fn0",
                inferredType: {
                    kind: "function",
                    parameterTypes: [
                        {
                            kind: "function",
                            parameterTypes: [
                                {
                                    kind: "primitive",
                                    name: "number",
                                },
                            ],
                            returnType: {
                                kind: "primitive",
                                name: "undefined",
                            },
                        },
                    ],
                    returnType: {
                        kind: "primitive",
                        name: "undefined",
                    },
                },
                typability: "Typed",
            },
            arguments: [
                {
                    type: "Identifier",
                    name: "undefined",
                },
            ],
            inferredType: {
                kind: "variable",
                name: "T19",
                constraint: "none",
            },
            typability: "Typed",
        },
        envKeyCounter: 3,
    },
    {
        name: "programEnvironment",
        tail: {
            name: "programEnvironment",
            tail: {
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
                envKeyCounter: 6,
            },
            head: {},
            envKeyCounter: 5,
        },
        head: {
            fn0: fn0,
        },
        envKeyCounter: 4,
    },
    {
        name: "programEnvironment",
        tail: {
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
            envKeyCounter: 6,
        },
        head: {},
        envKeyCounter: 5,
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
        envKeyCounter: 6,
    },
];

fn0.environment = environments[4]; //environments[0]===program env
fn1.environment = environments[2];

// // const node = {};
const type0 = "ArrowFunctionExpression";
const type1 = "FunctionDeclaration";

fn0.node = {};
fn1.node = {};

fn0.node.type = type1;
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
function fn0(a) {
    a = (x) => {
        "breakpoint here";
    };
    a(10);
}

fn0(undefined);
*/
