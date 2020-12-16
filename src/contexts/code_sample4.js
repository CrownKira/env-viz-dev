const fn0 = () => 1;
const fn1 = () => 2;

const arr0 = [3, [4, [5, null]]];
const arr1 = [fn0, [4, [5, null]]];
const arr2 = [1, 2];

const externalSymbols = [];
const environments = [
    {
        "name": "programEnvironment",
        "tail": {
            "name": "programEnvironment",
            "tail": {
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
                "envKeyCounter": 5
            },
            "head": {},
            "envKeyCounter": 4
        },
        "head": {
            "e": [
                arr0,
                [
                    2,
                    [
                        arr0,
                        null
                    ]
                ]
            ],
            "f": [
                1,
                2
            ],
            "g": [
                arr1,
                [
                    2,
                    [
                        arr1,
                        null
                    ]
                ]
            ],
            "y": [
                arr2,
                [
                    fn1,
                    arr2
                ]
            ]
        },
        "envKeyCounter": 3
    },
    {
        "name": "programEnvironment",
        "tail": {
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
            "envKeyCounter": 5
        },
        "head": {},
        "envKeyCounter": 4
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
        "envKeyCounter": 5
    }
];

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
                environments: environments
            },
            externalSymbols: externalSymbols
        }
    }
};

export default context;