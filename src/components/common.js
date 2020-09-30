export default {
  clone: (x) => JSON.parse(JSON.stringify(x)),

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
