import { fillTail } from "./helper_functions";

function fn0(x) {
	return "function 0";
}
function fn1(x) {
	return "function 1";
}
const fn2 = () => 2;

const externalSymbols = [];
let environments = [
	{
		name: "functionBodyEnvironment",
		tail: null,
		head: { fn2: fn2 },
		envKeyCounter: 0,
	},
	{
		name: "fn0",
		tail: null,
		head: {},
		callExpression: {
			type: "CallExpression",
			start: 116,
			end: 121,
			loc: {
				start: {
					line: 10,
					column: 0,
				},
				end: {
					line: 10,
					column: 5,
				},
			},
			callee: {
				type: "Identifier",
				start: 116,
				end: 119,
				loc: {
					start: {
						line: 10,
						column: 0,
					},
					end: {
						line: 10,
						column: 3,
					},
				},
				name: "fn0",
				inferredType: {
					kind: "function",
					parameterTypes: [],
					returnType: {
						kind: "primitive",
						name: "undefined",
					},
				},
				typability: "Typed",
			},
			arguments: [],
			inferredType: {
				kind: "primitive",
				name: "undefined",
			},
			typability: "Typed",
		},
		envKeyCounter: 1,
	},
	{
		name: "programEnvironment",
		tail: null,
		head: { fn0: fn0, fn1: fn1 },
		envKeyCounter: 2,
	},
	{
		name: "programEnvironment",
		tail: null,
		head: {},
		envKeyCounter: 3,
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
		envKeyCounter: 4,
	},
];

environments = fillTail(environments);

fn0.environment = environments[2];
fn1.environment = environments[2];
fn2.environment = {
	name: "functionBodyEnvironment",
	tail: {
		name: "fn1",
		tail: environments[2],
		head: {
			x: 10,
		},
		callExpression: {
			type: "CallExpression",
			start: 31,
			end: 38,
			loc: {
				start: {
					line: 2,
					column: 14,
				},
				end: {
					line: 2,
					column: 21,
				},
			},
			callee: {
				type: "Identifier",
				start: 31,
				end: 34,
				loc: {
					start: {
						line: 2,
						column: 14,
					},
					end: {
						line: 2,
						column: 17,
					},
				},
				name: "fn1",
				inferredType: {
					kind: "function",
					parameterTypes: [
						{
							kind: "primitive",
							name: "number",
						},
					],
					returnType: {
						kind: "function",
						parameterTypes: [],
						returnType: {
							kind: "primitive",
							name: "number",
						},
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
				kind: "function",
				parameterTypes: [],
				returnType: {
					kind: "primitive",
					name: "number",
				},
			},
			typability: "Typed",
		},
		envKeyCounter: 6,
	},
	head: {},
	envKeyCounter: 5,
};

const type0 = "ArrowFunctionExpression";
const type1 = "FunctionDeclaration";

fn0.node = {};
fn1.node = {};
fn2.node = {};

fn0.node.type = type1;
fn1.node.type = type1;
fn2.node.type = type0;

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
function fn0() {
	const a = fn1(10);
	"breakpoint here";
}

function fn1(x) {
	return () => 1;
}

fn0();
*/
