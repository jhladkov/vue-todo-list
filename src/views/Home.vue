<template>
    <Panel
        :todo="state.todo"
        :is-loaded="state.isLoaded"
        :parent-drag-item="state.dragInfo.typePanel"
        :draggable-item="state.dragInfo.id"
        @setDragInfo="setDragInfo"
        @rewritePriority="rewritePriority"
        @doneTask="done"
        @changeTypeByDragAndDrop="changeTypeByDragAndDrop"
        @remove="remove"
        title="Дела"
        title-class="panel-todo__title"
        typePanel="todo"
    >
      <Select
          default-selected-value="По приоритету"
          :possibility-to-delete="false"
          type-open="bottom"
          class-name="panel-todo__filter-select"
          :options="state.options"
          text="Фильтровать: "
      />
    </Panel>
    <Panel
        :done="state.done"
        :is-loaded="state.isLoaded"
        :parent-drag-item="state.dragInfo.typePanel"
        :draggable-item="state.dragInfo.id"
        @setDragInfo="setDragInfo"
        @remove="remove"
        @rewritePriority="rewritePriority"
        @doneTask="done"
        @changeTypeByDragAndDrop="changeTypeByDragAndDrop"
        title="Выполненные"
        title-class="panel-done__title"
        typePanel="done"
    />
</template>

<script>
import Button from "../UI/Button";
import {useStore} from 'vuex'
import {reactive, watchEffect} from "vue";
import Section from "../hooc/Section";
import Panel from "../components/Panel/Panel";
import {getStorage, ref} from "firebase/storage";
import Select from "../UI/Select";

export default {
  components: {Select, Panel, Section, Button},
  setup() {
    const store = useStore()
    const storage = getStorage()

    const state = reactive({
      options: [
        {id: Math.floor(Math.random() * 1000000), value: 'По приоритету'},
      ],
      dragInfo: {
        typePanel: '',
        drag: false,
        id: 0,
      },
      allTodos: store.state.modal.todos,
      isLoaded: store.state.isLoaded,
      todo: store.getters.getFilterTodosByTodo,
      done: store.getters.getFilterTodosByDone,
    })

    const done = (id, img, index) => {
      const arr = state.allTodos
      arr.forEach((item, elemIndex) => {
        if (item.id === id) {
          index = elemIndex
        }
      })
      if (arr[index].type === 'done') {
        arr[index].type = 'todo'
      } else {
        arr[index].type = 'done'
      }
      console.log(arr)
      store.dispatch('changeTodosArr', arr)
      store.dispatch('writeDataInDatabase', {
        path: 'todo',
        value: {data: arr}
      })
    }

    const remove = (id, deleteData) => {
      if (deleteData) {
        console.log('delete data ', deleteData)
        const elementRef = ref(storage, deleteData);
        store.dispatch('removeDataFromDatabase', elementRef)
      }
      const filterTodos = state.allTodos.filter(item => item.id !== id)
      store.dispatch('changeTodo', filterTodos)
      store.dispatch('writeDataInDatabase', {
        path: 'todo',
        value: {data: filterTodos}
      })
    }

    const changeTypeByDragAndDrop = (value, type, typePanel) => {
      if (type === 'drop') {
        console.log('drop', value, type, typePanel)
        if (state.dragInfo.id && state.dragInfo.typePanel !== typePanel) {
          const changedArr = state.allTodos.map(item => {
            if (item.id === state.dragInfo.id) {
              if (item.type === 'todo') {
                item.type = 'done'
              } else {
                item.type = 'todo'
              }
            }
            return item
          })
          store.dispatch('changeTodosArr', changedArr)
          store.dispatch('writeDataInDatabase', {
            path: 'todo',
            value: {data: changedArr}
          })
        }

        setDragInfo(0, '')
      } else {
        if (!state.dragInfo.id && !state.dragInfo.typePanel) {
          setDragInfo(value, typePanel)
        }
      }
    }

    const rewritePriority = (value, id) => {
      state.allTodos.map(item => {
        if (item.id === id) {
          item.priority = value
        }
      })
      store.dispatch('changeTodosArr', state.allTodos)
      store.dispatch('writeDataInDatabase', {
        path: 'todo',
        value: {data: state.allTodos}
      })
    }

    const setDragInfo = (id, type) => {
      state.dragInfo.id = id
      state.dragInfo.typePanel = type
    }

    watchEffect(() => {
      state.allTodos = store?.state.modal.todos
      state.isLoaded = store.state.isLoaded
      if (state.allTodos) {
        state.todo = store.getters.getFilterTodosByTodo
        state.done = store.getters.getFilterTodosByDone
      }
      if (store.state.selectedOption) {
        const filterTodo = store.getters.getFilterTodosBySortPriority
        const filterDone = store.getters.getFilterTodosByDone

        if (store.state.selectedOption !== 'Все') {
          state.todo = store.getters.getTodosBySelectedOption(filterTodo)
          state.done = store.getters.getTodosBySelectedOption(filterDone)
        } else {
          state.todo = filterTodo
          state.done = filterDone
        }
      }
    })

    return {
      state,
      setDragInfo,
      done,
      remove,
      changeTypeByDragAndDrop,
      rewritePriority,
    }

  }
}
</script>

<style scoped>

</style>