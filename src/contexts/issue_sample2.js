import { fillTail } from './helper_functions';

function fn0() {
  return '1';
}
function fn1() {
  return '2';
}

const externalSymbols = [];
let environments = [
  {
    name: 'programEnvironment',
    tail: null,
    head: {
      x: 0,
      y: 10,
      f: fn0,
      z: fn1
    }
  },
  {
    name: 'programEnvironment',
    tail: null,
    head: {}
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
    }
  }
];

environments = fillTail(environments);

fn0.environment = environments[0];
fn1.environment = {
  name: 'functionBodyEnvironment',
  tail: {
    name: 'f',
    tail: environments[0],
    head: {
      x: 11
    },
    callExpression: {
      type: 'CallExpression',
      start: 131,
      end: 136,
      loc: {
        start: {
          line: 12,
          column: 10
        },
        end: {
          line: 12,
          column: 15
        }
      },
      callee: {
        type: 'Identifier',
        start: 131,
        end: 132,
        loc: {
          start: {
            line: 12,
            column: 10
          },
          end: {
            line: 12,
            column: 11
          }
        },
        name: 'f',
        inferredType: {
          kind: 'function',
          parameterTypes: [
            {
              kind: 'primitive',
              name: 'number'
            }
          ],
          returnType: {
            kind: 'function',
            parameterTypes: [
              {
                kind: 'primitive',
                name: 'number'
              }
            ],
            returnType: {
              kind: 'primitive',
              name: 'undefined'
            }
          }
        },
        typability: 'Typed'
      },
      arguments: [
        {
          type: 'Literal',
          value: 11
        }
      ],
      inferredType: {
        kind: 'function',
        parameterTypes: [
          {
            kind: 'primitive',
            name: 'number'
          }
        ],
        returnType: {
          kind: 'primitive',
          name: 'undefined'
        }
      },
      typability: 'Typed'
    }
  },
  head: {
    g: fn1
  }
};

const type1 = 'FunctionDeclaration';

fn0.node = {};
fn1.node = {};

fn0.node.type = type1;
fn1.node.type = type1;

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
let x = 0;
let y = 10;

function f(x) {
    function g(x) {
        x = x + 1;
        y = y + 1;
    }
    return g;
}

const z = f(11);

"breakpoint here";
*/
