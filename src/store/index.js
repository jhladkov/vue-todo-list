import {createStore} from 'vuex'
import {modal} from "./modal";

export default createStore({
    state: {
        isAuth: false,
        userInfo: {},
        sections: [{id: Math.floor(Math.random() * 1000000), value: 'Все', notDelete: true}],
        isLoaded: false,
        selectedOption: 'Все',
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
            state.sections = [{id: Math.floor(Math.random() * 1000000), value: 'Все', notDelete: true}]
            state.selectedOption = 'Все'
        },
        setTodo(state, payload) {
            if (payload) {
                state.modal.todos = payload
            }
        },
        setLoading(state, payload) {
            state.isLoaded = payload
        },
        setSelectedOption(state, payload) {
            state.selectedOption = payload
        },
        setSections(state, payload) {
            state.sections = payload
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
            commit('setTodo', payload)
        },
        changeLoadingStatus({commit}, payload) {
            commit('setLoading', payload)
        },
        changeSelectedOption({commit}, payload) {
            commit('setSelectedOption', payload)
        },
        changeSection({commit}, payload) {
            commit('setSections', payload)
        }
    },
    modules: {
        modal
    }
})
