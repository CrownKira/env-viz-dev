(function () {
    const fn = () => "L";
    const fn1 = () => 1;
    const fn2 = () => 2;
    const fn3 = () => 3;

    const externalSymbols = [];
    const repeated_arr = [[2, 3], [fn3, null]];
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
                    "fn": fn,
                    "x": [
                        1,
                        [
                            null,
                            null
                        ],
                        [
                            1,
                            repeated_arr
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
                                repeated_arr
                            ],
                            [
                                fn2,
                                [
                                    repeated_arr,
                                    [
                                        fn,
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

    fn.environment = environments[0];
    fn1.environment = environments[0];
    fn2.environment = environments[0];
    fn3.environment = environments[0];

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