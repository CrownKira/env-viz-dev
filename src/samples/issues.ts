const ISSUES = [
  {
    description: 'Function objects not properly pointing to their source frames',
    code: `/* Fixed */
let x = 0;
let y = 10;
function f(x) {
    return () => 6; //arrow pointing to the wrong frame
}
const z = f(11);
debugger;
      `
  },
  {
    description: 'Function objects not properly pointing to their source frames',
    code: `/* Fixed */
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
debugger; 
       `
  },
  {
    description: 'Empty frame should not be drawn',
    code: `/* Fixed */
function longfn(a) {
    a = (x) => {
        debugger;
    };
    a(10);
}
longfn(undefined);
       `
  },
  {
    description: 'Frame missing',
    code: `/* Fixed */
function fn0() {
    const a = fn1(10);
    debugger;
}
function fn1(x) {
    return () => 1;
}
fn0();
       `
  },
  {
    description: 'Representation of functions belonging to the global frame (e.g. const x = pair)',
    code: `/* Fixed */
const x = 10;
const y = accumulate;
const z= pair;
debugger;
       `
  },
  {
    description: 'Canvas gets cut off when size exceeds 1000px',
    code: `/* Fixed */
const y = enum_list(1,20);
debugger;
       `
  },
  {
    description: 'Frame spacing too big',
    code: `/* Fixed */
function fib(n) {
    if (n<=1) {
        return n;
    } else {
        debugger;
        return fib(n-1)+fib(n-2);
        
    }
}
fib(5);
       `
  },
  {
    description: '',
    code: `const y = list(4,5,6);
const x = [1,"hello world", ()=>1, list(1,2,3), y, null];
const z = ()=>2;
debugger;
       `
  },
  {
    description: '',
    code: `const x = list(1,pair, accumulate);
debugger;`
  },
  {
    description: '',
    code: `const x = [];
debugger;`
  },
  {
    description: '',
    code: `let x = null;
for (let i = 0; i < 5; i = i + 1) {
    x = pair(() => i, x);
}

debugger;`
  },
  {
    description: 'Frame Width Calculation Issue',
    code: `function f(n) {
    if (n <= 1) {
        debugger;
        return 1;
    } else {
        return n * f(n-1);
    }
}

f(5);`
  },
  {
    description: '',
    code: `(w => x => y => { const a = 1; debugger; })(1)(2)(3);`
  },
  {
    description: 'empty program',
    code: `debugger;`
  },
  {
    description: 'reference global function',
    code: `const a = pair; debugger;`
  }
];

export default ISSUES;
