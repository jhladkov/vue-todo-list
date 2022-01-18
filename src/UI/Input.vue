<template>
  <input
      :type="inputType"
      :class="inputClass"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emitChange"
  >
</template>

<script>
export default {
  name: 'Input',
  props: {
    modelValue: {
      type: String
    },

    inputType: {
      type: String,
      default: 'text'
    },
    inputClass: {
      type: String,
      default: 'input'
    },
    placeholder: {
      type: String,
      default: 'Введите данные'
    }
  },
  setup(props,{emit}) {
    const emitChange = (event) => {
      emit('update:modelValue', event.target.value)
    }

    return {
      emitChange
    }
  }
}
</script>
