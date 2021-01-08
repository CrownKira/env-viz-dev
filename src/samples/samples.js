const SAMPLES = [
  {
    code: `const fn = () => "L";
    const x = [1, pair(() => 1, () => 2), list(1, pair(2, 3), () => 3), () => "THIS", 5, 6];
    const y = list(x[1], x[2], tail(x[1]), tail(x[2]), fn);
    
    debugger;`
  },
  {
    code: `const fn = () => 1;
    const x = [1, pair(pair(1, 2), 3), 4];
    const l = list(1,
    list(list(1, 2, 3, fn),x[1] , [1, pair(1,2), fn, 4, 5], 4),
    () => 9, x);

    debugger;`
  },
  {
    code: `const x1 = list(1, 2);
    const x2 = list(3, 4);
    
    set_head(tail(x2), x1);
    set_tail(tail(x1), x2);
    
    debugger;`
  },
  {
    code: `const e = list(null, 2, list(3,4,5));
    set_head(e, head(tail(tail(e))));
    
    const f = pair(1,2);
    
    const g = list(null, 2, list(() => 1,4,5));
    set_head(g, head(tail(tail(g))));
    
    const y = pair(null, pair(() => 2, pair(1,2)));
    set_head(y, tail(tail(y)));
    
    debugger;`
  }
];

export default SAMPLES;
