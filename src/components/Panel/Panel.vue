<template>
  <Section :section-class="`section panel ${typePanel}`">
    <Title :title="title" :title-class="titleClass"/>
    <div class="panel__inner">
      <transition-group name="list">
        <TodoItem v-if="typePanel === 'todo'" @done="done" @remove="remove" v-for="item in state.todo" :typeData="item.storageInfo.type" :id="item.id" :value="item.value" :key="item.id"
                  :url="item.storageInfo.url"/>
        <TodoItem v-else @done="done" v-for="item in state.done" :id="item.id" :typeData="item.storageInfo.type" :value="item.value" :key="item.id"
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


    const done = (id,img,index = null) => {
      const arr = store?.state?.modal?.todos
      arr.forEach((item,elemIndex) => {
        if (item.id === id) {
          index = elemIndex
        }
      })
      if (arr[index].type === 'done') {
        arr[index].type = 'todo'
      }else {
        arr[index].type = 'done'
      }
      console.log(arr)
      store.dispatch('changeTodosArr',arr)
      useWriteData(arr)
    }


    const remove = (id, deleteData) => {
      if (deleteData) {
        const elementRef = ref(storage, deleteData);
        useRemoveData(elementRef)
      }

      const filterTodos = store.state.modal.todos.filter(item => item.id !== id)
      console.log(filterTodos)
      store.dispatch('changeTodo', filterTodos)
      useWriteData(store.state.modal.todos)
    }

    watchEffect(() => {
      if (store.state.modal.todos) {
        state.todo = store.state.modal.todos
        state.done = store?.state?.modal?.todos.filter(item => item.type === 'done')
      }
      store.state.modal.todos.forEach(item => {
        state.todo = store?.state?.modal?.todos.filter(item => item.type === 'todo')
        state.done = store?.state?.modal?.todos.filter(item => item.type === 'done')
      })
    })

    return {
      state, remove,done
    }
  }
}
</script>
