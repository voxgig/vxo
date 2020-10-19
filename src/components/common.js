export default {
  clone: (x) => JSON.parse(JSON.stringify(x)),
  genid: (p) => ((p=(null===p?'':null==p?'ID':p),
                  p+Math.random()).substring(p.length)),
  
  taskbox: {
    field: {
      kinds: {
        string: true,
        done: true,
        custom: true,
        component: true,
      },
    },
  },
}
