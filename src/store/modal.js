export const modal = {
    state: () => ({
        open: false,
        todos: [],
    }),
    mutations: {
        setOpen(state, status) {
            state.open = status
        },
        setTodos(state, todosArr) {
            state.todos = todosArr
        }
    },
    actions: {
        changeStatusOpen({state, commit}) {
            commit('setOpen', !state.open)
        },
        changeTodosArr({state,commit},payload) {
            console.log(payload)
            commit('setTodos', payload)
        }
    }
}