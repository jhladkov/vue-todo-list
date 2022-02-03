<template>
  <Section @drop.prevent="dragEvent('','drop')" @dragover.prevent
           :section-class="`section panel ${typePanel}`">
    <div class="section__inner">
      <Title :title="title" :title-class="titleClass"/>
      <slot></slot>
    </div>
    <div class="panel__inner">
      <transition-group name="list">
        <TodoItem @dragleave.prevent="dragEvent(item.id)" draggable="true"
                  v-if="typePanel === 'todo' && state.todo.length > 0" @done="done" @remove="remove"
                  v-for="item in state.todo"
                  @selectedOption="rewritePriority"
                  :typeData="item.storageInfo.type" :id="item.id" :value="item.value" :key="item.id"
                  :priority="item.priority"
                  :url="item.storageInfo.url"/>
        <TodoItem @dragleave.prevent="dragEvent(item.id)" draggable="true" v-else-if="typePanel === 'done' && state.done.length > 0" @done="done"
                  v-for="item in state.done"
                  :id="item.id" :typeData="item.storageInfo.type"
                  :value="item.value" :key="item.id"
                  :url="item.storageInfo.url" @remove="remove"/>

      </transition-group>
      <div v-if="typePanel === 'todo' && state.todo.length === 0 && state.isLoaded" class="panel__no-task todo">
        <p> Нету дел</p>
        <img src="../../../public/gif/crying-emoji-9.gif" alt="">
      </div>
      <div v-else-if="typePanel === 'done' && state.done.length === 0 && state.isLoaded" class="panel__no-task done">
        <p> Нету выполненных дел</p>
      </div>
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
    },
    draggableItem: Number,
    parentDragItem: String,
  },
  setup(props, {emit}) {
    const store = useStore()
    const storage = getStorage();

    const state = reactive({
      todo: store?.state?.modal?.todos,
      done: store?.state?.modal?.todos.filter(item => item.type === 'done'),
      isLoaded: store.state.isLoaded
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

    const dragEvent = (value, type) => {
      if (type === 'drop') {
        if (props.draggableItem && props.parentDragItem !== props.typePanel) {
          const changedArr = store?.state?.modal?.todos.map(item => {
            if (item.id === props.draggableItem) {
              if (item.type === 'todo') {
                item.type = 'done'
              } else {
                item.type = 'todo'
              }
            }
            return item
          })
          store.dispatch('changeTodosArr', changedArr)
          useWriteData('todo', {data: changedArr})
        }

        emit('setDragInfo', 0, '')
      } else {
        if (!props.draggableItem && !props.parentDragItem) {
          emit('setDragInfo', value, props.typePanel)
        }
      }
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

    const comparePriority = (a, b) => {
      return b.priority - a.priority
    }

    watchEffect(() => {
      state.isLoaded = store.state.isLoaded
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
      state, remove, done, rewritePriority, dragEvent
    }
  }
}
</script>
