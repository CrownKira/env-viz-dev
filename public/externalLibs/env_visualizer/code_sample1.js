(function () {
    const fn0 = () => "L";
    const fn1 = () => 1;
    const fn2 = () => 2;
    const fn3 = () => 3;
    const arr0 = [[2, 3], [fn3, null]];

    const externalSymbols = [];
    const environments =
        [
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
                    "fn": fn0,
                    "x": [
                        1,
                        [
                            null,
                            null
                        ],
                        [
                            1,
                            arr0
                        ],
                        null,
                        5,
                        6
                    ],
                    "y": [
                        [
                            fn1,
                            fn2
                        ],
                        [
                            [
                                1,
                                arr0
                            ],
                            [
                                fn2,
                                [
                                    arr0,
                                    [
                                        fn0,
                                        null
                                    ]
                                ]
                            ]
                        ]
                    ]
                },
                "envKeyCounter": 0
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
                    "envKeyCounter": 2
                },
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
                "envKeyCounter": 2
            }
        ]

    fn0.environment = environments[0];
    fn1.environment = environments[0];
    fn2.environment = environments[0];
    fn3.environment = environments[0];

    const node = {};
    const type = "ArrowFunctionExpression";

    fn0.node = node;
    fn1.node = node;
    fn2.node = node;
    fn3.node = node;

    fn0.node.type = type;
    fn1.node.type = type;
    fn2.node.type = type;
    fn3.node.type = type;

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
    window.draw_env(context);
})();