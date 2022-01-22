<template>
  <Section section-class="section modal">
    <div class="modal__wrapper">
      <div class="modal__header">
        <Title title-class="modal__title" :title="title"/>
        <div @click="closeModel" class="modal__close">&times;</div>
      </div>
     <DragAndDrop @getUrlImg="getImg"/>
      <Form @submit.prevent="createTodo" form-class="modal__form form">
        <p class="form__error error-message" v-if="v$.$error">Это поле обязательное</p>
        <Input
            v-focus
            @blur="v$.inputText.$touch"
            v-model.trim="state.inputText"
            :input-class="v$.$error ? 'form__input input error-message' : 'form__input input' "

        />
        <Button
            item-class="form__button button"
            text="Добавить задачу"
            button-type="submit"
        />
      </Form>
    </div>
  </Section>
  <div @click="closeModel" class="background"></div>
</template>

<script>
import {useStore} from "vuex";
import Form from "./Form/Form";
import {reactive} from "vue";
import useVuelidate from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {useObjectTodo} from "../hooks/useObjectTodo";
import {useWriteData} from "../hooks/useWriteData";
import DragAndDrop from "./DragAndDrop/DragAndDrop";

export default {
  components: {DragAndDrop, Form},
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
      imgUrl: '',
      errorStatus: false
    })
    const rules = {
      inputText: {required}
    }
    const v$ = useVuelidate(rules, state)

    const closeModel = () => {
      store.dispatch('changeStatusOpen')
    }

    const getImg = (payload) => {
      state.imgUrl = payload
    }

    const createTodo = () => {
      if (!v$.value.$error) {
        const obj = useObjectTodo('','todo', state.inputText, state.imgUrl, Math.floor(Math.random() * 1000000))

        useWriteData([...store.state.modal.todos, obj])

        store.dispatch('changeTodosArr', [...store.state.modal.todos, obj])
        closeModel()
        state.inputText = ''
        state.imgUrl = ''
      } else {
        console.log('error', v$.value.$error)
      }
    }
    return {
      closeModel, state, v$, createTodo,getImg
    }
  }
}
</script>
