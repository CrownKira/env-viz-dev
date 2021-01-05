import CONTEXT1 from './code_sample1';
import CONTEXT2 from './code_sample2';
import CONTEXT3 from './code_sample3';
import CONTEXT4 from './code_sample4';
import ISSUE_CONTEXT1 from './issue_sample1';
import ISSUE_CONTEXT2 from './issue_sample2';
import ISSUE_CONTEXT3 from './issue_sample3';
import ISSUE_CONTEXT4 from './issue_sample4';
import ISSUE_CONTEXT5 from './issue_sample5';
import ISSUE_CONTEXT6 from './issue_sample6';
import ISSUE_CONTEXT7 from './issue_sample7';
import ISSUE_CONTEXT8 from './issue_sample8';
import ISSUE_CONTEXT9 from './issue_sample9';

export const SAMPLES = [
    {
        id: 1,
        name: 'Sample 1',
        link: 'https://share.sourceacademy.nus.edu.sg/87azn',
        context: CONTEXT1,
        description: 'Code Sample 1',
        code: `const fn = () => "L";
const x = [1, pair(() => 1, () => 2), list(1, pair(2, 3), () => 3), () => "THIS", 5, 6];
const y = list(x[1], x[2], tail(x[1]), tail(x[2]), fn);

"breakpoint here";
     `
    },
    {
        id: 2,
        name: 'Sample 2',
        link: 'https://share.sourceacademy.nus.edu.sg/rx367',
        context: CONTEXT2,
        description: 'Code Sample 2',
        code: `const fn = () => 1;
const x = [1, pair(pair(1, 2), 3), 4];
const l = list(1,
list(list(1, 2, 3, fn),x[1] , [1, pair(1,2), fn, 4, 5], 4),
() => 9, x);

"breakpoint here";
     `
    },
    {
        id: 3,
        name: 'Sample 3',
        link: 'https://share.sourceacademy.nus.edu.sg/1d87t',
        context: CONTEXT3,
        description: 'Code Sample 3',
        code: `const x1 = list(1, 2);
const x2 = list(3, 4);

set_head(tail(x2), x1);
set_tail(tail(x1), x2);

"breakpoint here";
     `
    },
    {
        id: 4,
        name: 'Sample 4',
        link: 'https://share.sourceacademy.nus.edu.sg/cuuww',
        context: CONTEXT4,
        description: 'Code Sample 4',
        code: `const e = list(null, 2, list(3,4,5));
set_head(e, head(tail(tail(e))));

const f = pair(1,2);

const g = list(null, 2, list(() => 1,4,5));
set_head(g, head(tail(tail(g))));

const y = pair(null, pair(() => 2, pair(1,2)));
set_head(y, tail(tail(y)));

"breakpoint here";
     `
    }
];

export const ISSUES = [
    {
        id: 1,
        name: 'Issue Sample 1',
        link: 'https://share.sourceacademy.nus.edu.sg/3pqah',
        context: ISSUE_CONTEXT1,
        description: 'Function objects not properly pointing to their source frames',
        code: `/* Fixed */
let x = 0;
let y = 10;

function f(x) {
    return () => 6; //arrow pointing to the wrong frame
}

const z = f(11);

"breakpoint here";
     `
    },
    {
        id: 2,
        name: 'Issue Sample 2',
        link: 'https://share.sourceacademy.nus.edu.sg/2da5u',
        context: ISSUE_CONTEXT2,
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

"breakpoint here"; 
     `
    },
    {
        id: 3,
        name: 'Issue Sample 3',
        link: 'https://share.sourceacademy.nus.edu.sg/ajnug',
        context: ISSUE_CONTEXT3,
        description: 'Empty frame should not be drawn',
        code: `/* Fixed */
function longfn(a) {
    a = (x) => {
        "breakpoint here";
    };
    a(10);
}

longfn(undefined);
     `
    },
    {
        id: 4,
        name: 'Issue Sample 4',
        link: 'https://share.sourceacademy.nus.edu.sg/ovib1',
        context: ISSUE_CONTEXT4,
        description: 'Frame missing',
        code: `/* Fixed */
function fn0() {
    const a = fn1(10);
    "breakpoint here";
}

function fn1(x) {
    return () => 1;
}

fn0();
     `
    },
    {
        id: 5,
        name: 'Issue Sample 5',
        link: 'https://share.sourceacademy.nus.edu.sg/m14tx',
        context: ISSUE_CONTEXT5,
        description: 'Representation of functions belonging to the global frame (e.g. const x = pair)',
        code: `/* Fixed */
const x = 10;
const y = accumulate;
const z= pair;
"breakpoint here";
     `
    },
    {
        id: 6,
        name: 'Issue Sample 6',
        link: 'https://share.sourceacademy.nus.edu.sg/oi91d',
        context: ISSUE_CONTEXT6,
        description: 'Canvas gets cut off when size exceeds 1000px',
        code: `/* Fixed */
const y = enum_list(1,20);
"breakpoint here";
     `
    },
    {
        id: 7,
        name: 'Issue Sample 7',
        link: 'https://share.sourceacademy.nus.edu.sg/jcrbe',
        context: ISSUE_CONTEXT7,
        description: 'Frame spacing too big',
        code: `/* Fixed */
function fib(n) {
    if (n<=1) {
        return n;
    } else {
        "breakpoint here";
        return fib(n-1)+fib(n-2);
        
    }
}

fib(5);
     `
    },
    {
        id: 8,
        name: 'Issue Sample 8',
        link: '',
        context: ISSUE_CONTEXT8,
        description: '',
        code: `const y = list(4,5,6);
const x = [1,"hello world", ()=>1, list(1,2,3), y, null];
const z = ()=>2;
"breakpoint here";
     `
    },
    {
        id: 9,
        name: 'Issue Sample 9',
        link: '',
        context: ISSUE_CONTEXT9,
        description: '',
        code: `const x = list(1,pair);
 "breakpoint here";`
    }
]