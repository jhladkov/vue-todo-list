<template>
  <Section section-class="section modal">
    <div class="modal__wrapper">
      <div class="modal__header">
        <Title title-class="modal__title" :title="title"/>
        <div @click="closeModel" class="modal__close">&times;</div>
      </div>
      <DragAndDrop @getUrlImg="getImg" @activeUpload="activeUpload" @removeElementRef="setElementRef"/>
      <Form @submit.prevent="createTodo" form-class="modal__form form">
        <div class="form__inner">
          <Input
              v-focus
              @blur="v$.inputText.$touch"
              v-model.trim="state.inputText"
              :input-class="v$.$error ? 'form__input input error-message' : 'form__input input' "

          />
          <Select text="Секция: " @selectedOption="setSection" className="form__select" typeOpen="top" :options="state.options"/>
        </div>
        <Button
            item-class="form__button button"
            text="Добавить задачу"
            button-type="submit"
        />

      </Form>
    </div>
  </Section>
  <Background @click="closeModel"/>
</template>

<script>
import {useStore} from "vuex";
import Form from "./Form/Form";
import {reactive, watchEffect} from "vue";
import useVuelidate from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {useObjectTodo} from "../hooks/useObjectTodo";
import {useWriteData} from "../hooks/useWriteData";
import DragAndDrop from "./DragAndDrop/DragAndDrop";
import {useRemoveData} from "../hooks/useRemoveData";
import Select from "../UI/Select";


export default {
  components: {Select, DragAndDrop, Form},
  props: {
    title: {
      type: String,
      default: 'Дополнительные настройки'
    }
  },
  setup() {
    const store = useStore()

    const state = reactive({
      inputText: '',
      section: 'Все',
      options: store.state.sections,
      storageData: {
        url: '',
        type: ''
      },
      errorStatus: false,
      activeUpload: false,
      elementRef: ''
    })
    const rules = {
      inputText: {required}
    }
    const v$ = useVuelidate(rules, state)

    const closeModel = (deleteData = true) => {
      if (!state.activeUpload) {
        store.dispatch('changeStatusOpen')
        if (state.elementRef && deleteData) {
          useRemoveData(state.elementRef)
        }
      }
    }

    const getImg = (payload) => {
      state.storageData.url = payload
    }

    const setSection = (value) => {
      if (value) {
        state.section = value
      }
    }
    const activeUpload = (value, typeData) => {
      state.storageData.type = typeData
      state.activeUpload = value
    }

    const setElementRef = (value) => {
      if (value) {
        state.elementRef = value
      }
    }

    const createTodo = () => {
      if (!v$.value.$error && !state.activeUpload) {
        const obj = useObjectTodo(state.section,1, 'todo', state.inputText, state.storageData.url, state.storageData.type, Math.floor(Math.random() * 1000000))

        useWriteData('todo',{data: [...store.state.modal.todos, obj] })

        store.dispatch('changeTodosArr', [...store.state.modal.todos, obj])
        closeModel(false)
        state.inputText = ''
        state.storageData.url = ''
      } else {
        console.log('error', v$.value.$error)
      }
    }

    watchEffect(() => {
      state.options = store.state.sections
    })

    return {
      closeModel, state, v$, createTodo, getImg, activeUpload, setElementRef, setSection
    }
  }
}
</script>
