import {createStore} from 'vuex'
import {modal} from "./modal";
import {useWriteData} from "../hooks/useWriteData";
import {useRemoveData} from "../hooks/useRemoveData";
import {child, get, getDatabase, ref} from "firebase/database";

export default createStore({
    state: {
        isAuth: false,
        userInfo: {},
        sections: [{id: Math.floor(Math.random() * 1000000), value: 'Все', notDelete: true}],
        isLoaded: false,
        selectedOption: 'Все',
    },
    getters: {

        // getTestValue(state) {
        //     return (id) => {
        //         return id
        //     }
        // },

        getFilterTodosByDone(state) {
           return state.modal.todos.filter(item => item.type === 'done')
        },
        getFilterTodosByTodo(state) {
            return state.modal.todos.filter(item => item.type === 'todo')
        }

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
        getTodoFromDatabase({commit}, payload) {
            const dbRef = ref(getDatabase());
            get(child(dbRef, `${payload.uid}/${payload.path}`))
                .then((snapshot) => {
                    commit('setLoading', true)

                    if (snapshot.exists()) {
                        const data = snapshot.val().data
                        if (data) {
                            commit('setTodos', data)
                        }
                    } else {
                        console.log("No data available");
                    }
                })
        },

        getSectionFromDatabase({commit}, payload) {
            const dbRef = ref(getDatabase());
            get(child(dbRef, `${payload.uid}/${payload.path}`)).then((snapshot) => {
                commit('setLoading', true)

                if (snapshot.exists()) {
                    const data = snapshot.val().data
                    if (data) {
                        commit('setSections', data)
                    }
                } else {
                    commit('setSections',[{id: Math.floor(Math.random() * 1000000), value: 'Все', notDelete: true}])
                    console.log("No data available");
                }
            })
        },

        writeDataInDatabase({state, commit}, obj) {
            useWriteData(obj.path, obj.value) // write and change any data in the database
        },
        removeDataFromDatabase({commit}, payload) {
            useRemoveData(payload)
        },
        changeAuthStatus({state, commit}, payload) {
            commit('setUserInfo', payload)
        },
        resetState({commit}) {
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
