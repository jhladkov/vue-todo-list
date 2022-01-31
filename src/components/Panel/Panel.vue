<template>
  <Section :section-class="`section panel ${typePanel}`">
    <div class="section__inner">
      <Title :title="title" :title-class="titleClass"/>
      <slot></slot>
    </div>
    <div class="panel__inner">
      <transition-group name="list">
        <TodoItem v-if="typePanel === 'todo'" @done="done" @remove="remove" v-for="item in state.todo"
                  @selectedOption="rewritePriority"
                  :typeData="item.storageInfo.type" :id="item.id" :value="item.value" :key="item.id"
                  :priority="item.priority"
                  :url="item.storageInfo.url"/>
        <TodoItem v-else @done="done" v-for="item in state.done" :id="item.id" :typeData="item.storageInfo.type"
                  :value="item.value" :key="item.id"
                  :url="item.storageInfo.url" @remove="remove"/>
      </transition-group>
    </div>
  </Section>
</template>

<script>


import {reactive, watchEffect} from "vue";
import {useStore} from "vuex";
import TodoItem from "../TodoItem/TodoItem";
import {useWriteData} from "../../hooks/useWriteData";
import {getStorage, ref} from "firebase/storage";
import {useRemoveData} from "../../hooks/useRemoveData";
import Section from "../../hooc/Section";

export default {
  components: {Section, TodoItem},
  props: {
    title: {
      type: String,
      required: true
    },
    typePanel: {
      type: String,
      required: true
    },
    titleClass: {
      type: String
    }
  },
  setup(props) {
    const store = useStore()
    const storage = getStorage();

    const state = reactive({
      todo: store?.state?.modal?.todos,
      done: store?.state?.modal?.todos.filter(item => item.type === 'done')
    })

    if (props.typePanel === 'done') {
      console.log(state.todo.filter(item => item.type === 'done'))
      state.todo = state.todo.filter(item => item.type === 'done')
    }


    const done = (id, img, index = null) => {
      const arr = store?.state?.modal?.todos
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
      useWriteData('todo', {data: arr})
    }


    const rewritePriority = (value, id) => {
      store?.state?.modal?.todos.map(item => {
        if (item.id === id) {
          item.priority = value
        }
      })
      store.dispatch('changeTodosArr', store.state.modal.todos)
      useWriteData('todo', {data: store.state.modal.todos})
    }

    const remove = (id, deleteData) => {
      if (deleteData) {
        const elementRef = ref(storage, deleteData);
        useRemoveData(elementRef)
      }

      const filterTodos = store.state.modal.todos.filter(item => item.id !== id)
      console.log(filterTodos)
      store.dispatch('changeTodo', filterTodos)
      useWriteData('todo', {data: store.state.modal.todos})
    }

    const comparePriority = (a,b) => {
      return b.priority - a.priority
    }

    watchEffect(() => {
      if (store.state.modal.todos) {
        state.todo = store?.state?.modal?.todos.filter(item => item.type === 'todo')
      }
      if (store.state.selectedOption) {
        const filterTodo = state.todo = store?.state?.modal?.todos.filter(item => item.type === 'todo').sort(comparePriority)
        const filterDone = state.done = store?.state?.modal?.todos.filter(item => item.type === 'done')
        if (store.state.selectedOption !== 'Все') {
          state.todo = filterTodo.filter(item => item.section === store.state.selectedOption)
          state.done = filterDone.filter(item => item.section === store.state.selectedOption)
        } else {
          state.todo = filterTodo
          state.done = filterDone
        }
      }
    })

    return {
      state, remove, done, rewritePriority
    }
  }
}
</script>
