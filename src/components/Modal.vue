<template>
  <Section section-class="section modal">
    <div class="modal__wrapper">
      <div class="modal__header">
        <Title title-class="modal__title" :title="title" />
        <div @click="closeModel" class="modal__close">&times;</div>
      </div>
      <div class="modal__inner">
        <div class="modal__drag drag-area">
          <div class="drag-area-info">
            <p class="drag-area-info__text">Вставьте изображение</p>
          </div>
        </div>
      </div>
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
import {getDatabase, ref, set} from "firebase/database";
import {useStore} from "vuex";
import Form from "./Form/Form";
import {reactive} from "vue";
import useVuelidate from '@vuelidate/core'
import {required} from '@vuelidate/validators'
import {useObjectTodo} from "../hooks/useObjectTodo";

export default {
  components: {Form},
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
      errorStatus: false
    })
    const rules = {
      inputText: {required}
    }
    const v$ = useVuelidate(rules, state)

    const closeModel = () => {
      store.dispatch('changeStatusOpen')
    }

    function writeData(value) {
      const db = getDatabase();
      set(ref(db, 'user/'), {
        data: value
      });
    }

    const createTodo = () => {
      if (!v$.value.$error) {
        const obj = useObjectTodo('', state.inputText, '')

        writeData([...store.state.modal.todos, obj])
        store.dispatch('changeTodosArr', [...store.state.modal.todos, obj])
        closeModel()
        state.inputText = ''
        console.log('ok')
      } else {
        console.log('error', v$.value.$error)
      }
    }
    return {
      closeModel, state, v$, createTodo
    }
  }
}
</script>
