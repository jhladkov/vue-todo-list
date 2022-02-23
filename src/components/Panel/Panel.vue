<template>
  <Section
      @drop.prevent="dragEvent('','drop')"
      @dragover.prevent
      :section-class="['panel', typePanel]"
  >

    <div class="section__inner">
      <Title
          :title="title"
          :title-class="titleClass"
      />
      <slot></slot>
    </div>
    <div class="panel__inner">
      <transition-group name="list">
        <TodoItem
            @dragleave.prevent="dragEvent(item.id)"
            draggable="true"
            v-if="typePanel === 'todo' && todo.length > 0"
            @done="doneTask"
            @remove="remove"
            v-for="item in todo"
            @selectedOption="rewritePriority"
            :typeData="item.type"
            :id="item.id"
            :value="item.value"
            :key="item.id"
            :priority="item.priority"
            :url="item.storageInfo.url"
        />
        <TodoItem
            @dragleave.prevent="dragEvent(item.id)"
            draggable="true"
            v-else-if="typePanel === 'done' && done.length > 0"
            @done="doneTask"
            v-for="item in done"
            :id="item.id"
            :typeData="item.storageInfo.type"
            :value="item.value"
            :key="item.id"
            :url="item.storageInfo.url"
            @remove="remove"
        />

      </transition-group>
      <div
          v-if="typePanel === 'todo'
          && todo.length === 0
          && isLoaded"
          class="panel__no-task todo"
      >
        <p> Нету дел</p>
        <img src="../../../public/gif/crying-emoji-9.gif" alt="">
      </div>
      <div
          v-else-if="typePanel === 'done'
          && done.length === 0
          && isLoaded"
          class="panel__no-task done">
        <p> Нету выполненных дел</p>
      </div>
    </div>
  </Section>
</template>

<script>


import {reactive} from "vue";
import {useStore} from "vuex";
import TodoItem from "../TodoItem/TodoItem";
import {getStorage, ref} from "firebase/storage";
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
    todo: Array,
    done: Array,
    isLoaded: Boolean,
    draggableItem: Number,
    parentDragItem: String,
  },
  setup(props, {emit}) {
    const store = useStore()
    const storage = getStorage();

    const state = reactive({

    })

    const doneTask = (id, img, index = null) => {
      emit('doneTask',id,img,index)
    }

    const dragEvent = (value, type) => {
     emit('changeTypeByDragAndDrop',value,type, props.typePanel)
    }

    const rewritePriority = (value, id) => {
      emit('rewritePriority',value,id)
    }

    const remove = (id, deleteData) => {
      if (deleteData) {
        const elementRef = ref(storage, deleteData);
        store.dispatch('removeDataFromDatabase', elementRef)
      }
      const filterTodos = state.allTodos.filter(item => item.id !== id)
      console.log(filterTodos)
      store.dispatch('changeTodo', filterTodos)
      store.dispatch('writeDataInDatabase', {
        path: 'todo',
        value: {data: filterTodos}
      })
    }

    // watchEffect(() => {
    //   state.allTodos = store?.state.modal.todos
    //   state.isLoaded = store.state.isLoaded
    //   if (state.allTodos) {
    //     state.todo = store.getters.getFilterTodosByTodo
    //     state.done = store.getters.getFilterTodosByDone
    //   }
    //   if (store.state.selectedOption) {
    //     const filterTodo = store.getters.getFilterTodosBySortPriority
    //     const filterDone = store.getters.getFilterTodosByDone
    //
    //     if (store.state.selectedOption !== 'Все') {
    //       state.todo = store.getters.getTodosBySelectedOption(filterTodo)
    //       state.done = store.getters.getTodosBySelectedOption(filterDone)
    //     } else {
    //       state.todo = filterTodo
    //       state.done = filterDone
    //     }
    //   }
    // })

    return {
      state, remove, doneTask, rewritePriority, dragEvent
    }
  }
}
</script>
