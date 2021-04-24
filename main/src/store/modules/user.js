export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    kind: '',
    info: {}
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateKind (state, kind) {
      state.kind = kind
    },
    updateInfo (state, info) {
      state.info = info
    }
  }
}
