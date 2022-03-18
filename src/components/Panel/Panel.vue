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
            v-if="todoConditionShow('todo')"
            @done="doneTask"
            @remove="remove"
            v-for="item in todo"
            @selectedOption="rewritePriority"
            :typeData="item.storageInfo.type"
            :name="item.storageInfo.name"
            :id="item.id"
            :value="item.value"
            :key="item.id"
            :priority="item.priority"
            :url="item.storageInfo.url"
        />
        <TodoItem
            @dragleave.prevent="dragEvent(item.id)"
            draggable="true"
            v-else-if="doneConditionShow"
            @done="doneTask"
            v-for="item in done"
            :id="item.id"
            :name="item.storageInfo.name"
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

import TodoItem from "../TodoItem/TodoItem";
import Section from "../../hooc/Section";
import {computed, watchEffect} from "vue";

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

    const todoConditionShow = computed(() => (type) => {
      return props.typePanel === type && props.todo.length > 0
    })
    const doneConditionShow = computed(() => {
      return props.typePanel === 'done' && props.done.length > 0
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

    const remove = (id, deleteData,downloadUrl) => {
      URL.revokeObjectURL(downloadUrl)
      emit('remove',id,deleteData)
    }

    return {
       remove,
      doneTask,
      rewritePriority,
      dragEvent,
      todoConditionShow,
      doneConditionShow
    }
  }
}
</script>
