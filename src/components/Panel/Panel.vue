<template>
  <Section class="section panel-todo">
    <Title :title="title" :title-class="titleClass"/>
    <p v-for="item in state.todo">{{item.value}}</p>
  </Section>
</template>

<script>


import {reactive, watchEffect} from "vue";
import {useStore} from "vuex";

export default {
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

    watchEffect(() => {
      console.log(store.state.modal.todos)
      if (store.state.modal.todos){
        state.todo = store.state.modal.todos
      }
    })

    return{
      state
    }
  }
}
</script>
