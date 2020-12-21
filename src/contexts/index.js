import CONTEXT1 from './code_sample1';
import CONTEXT2 from './code_sample2';
import CONTEXT3 from './code_sample3';
import CONTEXT4 from './code_sample4';
import ISSUE_CONTEXT1 from './issue_sample1';
import ISSUE_CONTEXT2 from './issue_sample2';

export const SAMPLES = [
    {
        id: 1,
        name: 'Sample 1',
        link: 'https://share.sourceacademy.nus.edu.sg/87azn',
        context: CONTEXT1,
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
    }
]