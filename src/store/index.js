import {createStore} from 'vuex'
import {modal} from "./modal";
import {useWriteData} from "../hooks/useWriteData";
import {useRemoveData} from "../hooks/useRemoveData";
import {child, get, getDatabase, ref} from "firebase/database";
import {getDownloadURL, ref as storageRef} from "firebase/storage";

export default createStore({
    state: {
        elementRef: null,
        isAuth: false,
        userInfo: {},
        sections: [{id: Math.floor(Math.random() * 1000000), value: 'Все', notDelete: true}],
        isLoaded: false,
        selectedOption: 'Все',
    },
    getters: {
        getFilterTodosByDone(state) {
            return state.modal.todos.filter(item => item.type === 'done')
        },
        getFilterTodosByTodo(state) {
            return state.modal.todos.filter(item => item.type === 'todo')
        },
        getFilterTodosBySortPriority(state) {
            const comparePriority = (a, b) => {
                return b.priority - a.priority
            }
            return state.modal.todos.filter(item => item.type === 'todo').sort(comparePriority)
        },
        getTodosBySelectedOption(state) {
            return (value) => {
                return value.filter(item => item.section === state.selectedOption)
            }
        },

    },
    mutations: {
        setElementRef(state, payload) {
            state.elementRef = payload
        },
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
        },
        setPermissions(state, payload) {
            state.permissions = payload
        }
    },
    actions: {
        getTodoFromDatabase({commit}, payload) {
            const dbRef = ref(getDatabase());
            const interval = setInterval(() => {
                callRequest()
            }, 1000)
            const callRequest = () => {
                get(child(dbRef, `${payload.uid}/${payload.path}`))
                    .then((snapshot) => {
                        commit('setLoading', true)

                        if (snapshot.exists()) {
                            const data = snapshot.val().data
                            if (data) {
                                commit('setTodos', data)
                            } else {
                                callRequest()
                            }
                        } else {
                            console.log("No data available");
                        }
                        clearInterval(interval)
                    })
            }
            callRequest()
        },
        getSectionFromDatabase({commit}, payload) {
            const dbRef = ref(getDatabase());

            const interval = setInterval(() => {
                callRequest()
            }, 1000)
            const callRequest = () => {
                get(child(dbRef, `${payload.uid}/${payload.path}`)).then((snapshot) => {
                    commit('setLoading', true)

                    if (snapshot.exists()) {
                        const data = snapshot.val().data
                        if (data) {
                            commit('setSections', data)
                        } else {
                            console.log('request Section')
                            callRequest()
                        }
                    } else {
                        commit('setSections', [{
                            id: Math.floor(Math.random() * 1000000),
                            value: 'Все',
                            notDelete: true
                        }])
                        console.log("No data available");
                    }
                    clearInterval(interval)
                })
            }
            callRequest()
        },

        async getUrl({commit}, {storage, elementRef}) {
            return await getDownloadURL(storageRef(storage, elementRef))
                .then((url) => {
                    if (url) {
                        return url
                    }
                })
                .catch((error) => {
                    console.log('error', error)
                });

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
        changeSection({commit}, payload) {
            commit('setSections', payload)
        },
        changePermission({commit}, obj) {
            commit('setPermissions', obj)
        }
    },
    modules: {
        modal
    }
})
