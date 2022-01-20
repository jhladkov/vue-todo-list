<template>
  <Section class="section panel todo">
    <Title :title="title" :title-class="titleClass"/>
    <div class="panel__inner">
      <transition-group name="list">
        <TodoItem @remove="remove" v-for="item in state.todo" :id="item.id" :value="item.value" :key="item.id"/>
      </transition-group>
    </div>
  </Section>
</template>

<script>


import {reactive, watchEffect} from "vue";
import {useStore} from "vuex";
import TodoItem from "../TodoItem/TodoItem";
import {useWriteData} from "../../hooks/useWriteData";

export default {
  components: {TodoItem},
  props: {
    title: {
      type: String,
      required: true
    },
    titleClass: {
      type: String
    }
  },
  setup() {
    const store = useStore()

    const state = reactive({
      todo: store?.state?.modal?.todos
    })


    const remove = (payload) => {
      const filterTodos = store.state.modal.todos.filter(item => item.id !== payload)
      store.dispatch('changeTodo', filterTodos)
      useWriteData(store.state.modal.todos)
    }

    watchEffect(() => {
      if (store.state.modal.todos) {
        state.todo = store.state.modal.todos
      }
    })

    return {
      state, remove
    }
  }
}
</script>
