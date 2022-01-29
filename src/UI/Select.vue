<template>
  <div :class="`${className} select ${state.open ? 'open': 'close'} ${typeOpen === 'bottom' ? 'bottom': 'top'}`">
    <p @click="activeSelect" id="select__title" class="select__title">Секция: {{state.selected}}</p>
    <div v-if="state.open" id="options" class="select__options options">
      <p
          class="options__item"
          :key="option.id"
          v-for="option in options"
          @click="selectOption(option.value)"
      >{{option.value}}</p>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";

export default {
  name: 'Select',
  props: {
    className: String,
    typeOpen: String,
    options: {
      type: Array,
      default: [
        {id: Math.random(),value: 'Все'},
        {id: Math.random(),value: 'home task'},
        {id: Math.random(),value: 'home task2'},
      ]
    }
  },
  setup(props,{emit}) {
    const state = reactive({
      selected: 'Все',
      open:false,
    })

    const selectOption = (value) => {
      state.selected = value
      state.open = false
      emit('selectedOption', value)
    }
    const activeSelect = () => {
      state.open = !state.open
    }

    return {
      state,selectOption,activeSelect
    }
  }
}
</script>