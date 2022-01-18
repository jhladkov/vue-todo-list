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
        }
    },
    actions: {
        changeAuthStatus({state, commit}, payload) {
            commit('setUserInfo',payload)
        }
    },
    modules: {
        modal
    }
})
