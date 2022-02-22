<template>
  <Panel
      :parent-drag-item="state.dragInfo.typePanel"
      :draggable-item="state.dragInfo.id"
      @setDragInfo="setDragInfo"
      title="Дела"
      title-class="panel-todo__title"
      typePanel="todo"
  >
    <Select
        @selectedOption="test"
        default-selected-value="По приоритету"
        :possibility-to-delete="false"
        type-open="bottom"
        class-name="panel-todo__filter-select"
        :options="state.options"
        text="Фильтровать: "
    />
  </Panel>
  <Panel
      :parent-drag-item="state.dragInfo.typePanel"
      :draggable-item="state.dragInfo.id"
      @setDragInfo="setDragInfo"
      title="Выполненные"
      title-class="panel-done__title"
      typePanel="done"
  />
</template>

<script>
import Button from "../UI/Button";
import {useStore} from 'vuex'
import {onMounted, reactive} from "vue";
import Section from "../hooc/Section";
import Panel from "../components/Panel/Panel";
import {getDatabase, ref, get, child} from "firebase/database";
import Select from "../UI/Select";

export default {
  components: {Select, Panel, Section, Button},
  setup() {
    const state = reactive({
      options: [
        {id: Math.floor(Math.random() * 1000000), value: 'По приоритету'},
      ],
      dragInfo: {
        typePanel: '',
        drag: false,
        id: 0,
      }
    })

    const setDragInfo = (id, type) => {
      state.dragInfo.id = id
      state.dragInfo.typePanel = type
    }


    const test = (value) => {
      console.log('sortBy', value)
    }

    return {
      state, test, setDragInfo
    }

  }
}
</script>

<style scoped>

</style>