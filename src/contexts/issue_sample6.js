import { fillTail } from './helper_functions';

const externalSymbols = [];
let environments = [
  {
    name: 'programEnvironment',
    tail: null,
    head: {
      y: [
        1,
        [
          2,
          [
            3,
            [
              4,
              [
                5,
                [
                  6,
                  [
                    7,
                    [8, [9, [10, [11, [12, [13, [14, [15, [16, [17, [18, [19, [20, null]]]]]]]]]]]]]
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    },
    envKeyCounter: 2
  },
  {
    name: 'programEnvironment',
    tail: null,
    head: {},
    envKeyCounter: 1
  },
  {
    tail: null,
    name: 'global',
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
      math_SQRT2: 1.4142135623730951
    },
    envKeyCounter: 0
  }
];

environments = fillTail(environments);

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

/*
const y = enum_list(1,20);
"breakpoint here";
*/
