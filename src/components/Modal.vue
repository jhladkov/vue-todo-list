<template>
  <Section section-class="modal">
    <div class="modal__wrapper">
      <div class="modal__header">
        <Title
            title-class="modal__title"
            :title="title"
        />
        <div
            @click="closeModel"
            class="modal__close"
        >&times;
        </div>
      </div>
      <DragAndDrop
          @getUrlImg="getImg"
          @activeUpload="activeUpload"
          @removeElementRef="setElementRef"
      />
      <Form
          @submit.prevent="createTodo"
          form-class="modal__form form"
      >
        <div class="form__inner">
          <Input
              v-focus
              @blur="v$.inputText.$touch"
              v-model.trim="state.inputText"
              :input-class="{
                'error-message': v$.$error,
                form__input: !v$.$error
              }"
          />
          <Select
              text="Секция: "
              @selectedOption="setSection"
              className="form__select"
              typeOpen="top"
              :options="state.options"
          />
        </div>
        <Button
            item-class="form__button"
            text="Добавить задачу"
            button-type="submit"
        />

        <Button @click="testF">{{test}}</Button>

      </Form>
    </div>
  </Section>
  <Background @click="closeModel"/>
</template>

<script>
import {useStore} from "vuex";
import Form from "./Form/Form";
import {reactive} from "vue";
import useVuelidate from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {useObjectTodo} from "../hooks/useObjectTodo";
import DragAndDrop from "./DragAndDrop/DragAndDrop";
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
          store.dispatch('removeDataFromDatabase', state.elementRef)
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
        state.elementRef = value
    }

    const createTodo = () => {
      if (!v$.value.$error && !state.activeUpload) {
        const obj = useObjectTodo(
            state.section,
            1,
            'todo',
            state.inputText,
            state.storageData.url,
            state.storageData.type,
            Math.floor(Math.random() * 1000000)
        )

        store.dispatch('writeDataInDatabase', {
          path: 'todo',
          value: {data: [...store.state.modal.todos, obj]}
        })

        store.commit('setTodos', [...store.state.modal.todos, obj])
        closeModel(false)
        state.inputText = ''
        state.storageData.url = ''
      } else {
        console.log('error', v$.value.$error)
      }
    }

    return {
      closeModel,
      state,
      v$,
      createTodo,
      getImg,
      activeUpload,
      setElementRef,
      setSection
    }
  }
}
</script>
