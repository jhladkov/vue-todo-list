import {createStore} from 'vuex'
import {modal} from "./modal";

export default createStore({
    state: {
        isAuth: false,
        userInfo: {}
    },
    mutations: {
        setUserInfo(state, payload) {
            state.userInfo = payload
            state.isAuth = true
        },
        resetState(state) {
            state.userInfo = {}
            state.isAuth = false
            state.modal.todos = []
        }
    },
    actions: {
        changeAuthStatus({state, commit}, payload) {
            commit('setUserInfo',payload)
        },
        resetState({state,commit}) {
            commit('resetState')
        }
    },
    modules: {
        modal
    }
})
