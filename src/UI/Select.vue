<template>
  <div
      @dragenter.prevent="state.open = true"
      :class="selectClasses"
  >
    <p
        ref="select"
        @click="activeSelect"
        id="select__title"
        class="select__title"
    >
      {{ text }} {{ state.selected }}
    </p>
    <div
        v-show="state.open"
        id="options"
        class="select__options options"
    >
      <div
          class="options__item option-select"
          :key="option.id"
          v-for="(option,index) in options"
          @click="selectOption(option.value)"
      >
        <div class="option-select__inner choice">
          <p>{{ option.value }}</p>
        </div>
        <div
            v-if="possibilityToDelete && index !== 0"
            @click.stop="removeSection(option.id,option.value,index)"
            class="option-select__select delete"
        >
          <svg
              id="icon-cross"
              viewBox="0 0 32 32"
          >
            <path
                d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onBeforeUnmount, onMounted, reactive, ref} from "vue";

export default {
  name: 'Select',
  props: {
    className: String,
    typeOpen: String,
    defaultSelectedValue: {
      type: String, //
      default: 'Все'
    },
    possibilityToDelete: {
      type: Boolean,
      default: true
    },
    text: '',
    options: {
      type: Array,
      default: [
        {id: Math.random(), value: 'Все'},
      ]
    }
  },
  setup(props, {emit}) {
    const select = ref(null)

    const state = reactive({
      selected: props.defaultSelectedValue,
      open: false,
    })
    const selectClasses = computed(() => [
      'select',
      props.className,
      state.open ? 'open' : 'close',
      props.typeOpen === 'bottom' ? 'bottom' : 'top'
    ])

    const selectOption = (value) => {
      state.selected = value
      state.open = false
      emit('selectedOption', value)
    }

    const documentHandel = (status) => {
      if (status) {
        document.addEventListener('click', hideSelect)
      } else {
        hideSelect()
        document.removeEventListener('click', hideSelect)
      }
    }

    const activeSelect = () => {
      state.open = !state.open
      documentHandel(state.open)
    }
    const hideSelect = (event) => {
      if (event?.target !== select.value) {
        state.open = false
        document.removeEventListener('click', hideSelect)
      }
    }

    const removeSection = (id, value, index) => {
      const previousValue = props.options[--index].value
      emit('removeSection', id, value)
      emit('selectedOption', previousValue)
      state.open = false
      state.selected = previousValue
    }

    return {
      state, selectOption, activeSelect, removeSection, selectClasses, select
    }
  }
}
</script>