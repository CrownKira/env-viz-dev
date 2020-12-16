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
                "envKeyCounter": 2
            },
            "head": {},
            "envKeyCounter": 1
        },
        "head": {
            "x1": [
                1,
                [
                    2,
                    [
                        3,
                        [
                            null,
                            null
                        ]
                    ]
                ]
            ],
            "x2": null
        },
        "envKeyCounter": 0
    },
    null,
    null
];

environments[0].head.x1[1][1][1][0] = environments[0].head.x1;
environments[0].head.x2 = environments[0].head.x1[1][1];
environments[1] = environments[0].tail;
environments[2] = environments[0].tail.tail;

//simplified context
const context = {
    context: {
        context: {
            runtime: {
                environments: environments
            },
            externalSymbols: externalSymbols
        }
    }
}

export default context;