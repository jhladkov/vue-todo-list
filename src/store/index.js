import {createStore} from 'vuex'
import {modal} from "./modal";

export default createStore({
    state: {
        isAuth: false,
        userInfo: {}
    },
    mutations: {
        setUserInfo(state, payload) {
            if (payload) {
                state.userInfo = payload
            }
            state.isAuth = true
        },
        resetState(state) {
            state.userInfo = {}
            state.isAuth = false
            state.modal.todos = []
        },
        setTodo(state, payload) {
            if (payload) {
                state.modal.todos = payload
            }
        }
    },
    actions: {
        changeAuthStatus({state, commit}, payload) {
            commit('setUserInfo', payload)
        },
        resetState({state, commit}) {
            commit('resetState')
        },
        changeTodo({commit}, payload) {
            commit('setTodo',payload)
        }
    },
    modules: {
        modal
    }
})
