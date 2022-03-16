<template>
  <input v-if="inputType !== 'file'"
         :type="inputType"
         :class="inputClass"
         class="input"
         :placeholder="placeholder"
         :value="modelValue"
         @input="emitChange"
  >
  <div v-else class="input-wrapper">
    <label>
      <input @input="emitChange" type="file" id="file" :placeholder="placeholder" :class="inputClass">
      {{ placeholder }}
    </label>
  </div>

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
      type: Object,
    },
    placeholder: {
      type: String,
      default: 'Введите данные'
    }
  },
  setup(props, {emit}) {
    const emitChange = (event) => {
      if (props.inputType === 'file') {

        emit('getFile', event.target.files['0'], true)
      } else {
        emit('update:modelValue', event.target.value)
      }
    }

    return {
      emitChange
    }
  }
}
</script>
