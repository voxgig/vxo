export default {
  clone: (x) => JSON.parse(JSON.stringify(x)),
  genid: (p) =>
    ((null === p ? '' : null == p ? 'ID' : p) + Math.random()).replace(
      /0\./g,
      ''
    ),

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
