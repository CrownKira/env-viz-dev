import { fillTail } from './helper_functions';

const fn0 = () => 1;
const fn1 = () => 'This is a long function body';

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
      start: 71,
      end: 76,
      loc: {
        start: {
          line: 8,
          column: 10
        },
        end: {
          line: 8,
          column: 15
        }
      },
      callee: {
        type: 'Identifier',
        start: 71,
        end: 72,
        loc: {
          start: {
            line: 8,
            column: 10
          },
          end: {
            line: 8,
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
            parameterTypes: [],
            returnType: {
              kind: 'primitive',
              name: 'number'
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
        parameterTypes: [],
        returnType: {
          kind: 'primitive',
          name: 'number'
        }
      },
      typability: 'Typed'
    }
  },
  head: {}
};

environments = fillTail(environments);

const node = {};
const type = 'ArrowFunctionExpression';

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

/*
let x = 0;
let y = 10;

function f(x) {
    return () => 6;
}

const z = f(11);

"breakpoint here";
*/
