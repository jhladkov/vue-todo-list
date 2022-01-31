<template>
  <main class="main">
    <Header/>
    <div class="main-wrapper">
      <Container>
        <Section v-if="state.isAuth" section-class="section control-panel">
          <div class="control-panel__wrapper">
            <div class="control-panel__inner">
              <Button @click="openModel" text="Добавить задачу" item-class="control-panel__add-task button"/>
            </div>
            <div class="control-panel__inner">
              <Button @click="state.openWindow = true" text="Добавить секцию"
                      item-class="control-panel__add-task button"/>
            </div>
            <Select
                @selectedOption="setSelectedOptionInStore"
                className="control-panel__select"
                typeOpen="bottom"
                text="Секции: "
                :options="state.options"
            />
          </div>
        </Section>
        <router-view/>
        <div v-if="!state.isLoaded">
          <Loader/>
          <Background/>
        </div>

      </Container>
    </div>
    <ReusableWindow v-if="state.openWindow" title="Создать секцию" @closeWindow="state.openWindow = false">
      <Form @submit.prevent="addSection" form-class="window__form">
        <Input v-focus :input-class="`window__input input ${!state.error ? '' : 'error-message'}`"
               placeholder="Название секции" v-model.trim="state.sectionName"/>
        <Button button-type="submit" item-class="window__add-section button" text="Добавть секцию"/>
      </Form>
    </ReusableWindow>
    <Modal v-if="this.$store.state.modal.open" title="Добавить задачу"/>
  </main>
</template>

<style src="./assets/global.scss" lang="scss">

</style>
<script>
import Header from "./components/Header/Header";
import Modal from "./components/Modal";
import {useStore} from "vuex";
import {reactive, watchEffect} from "vue";
import {useWriteData} from "./hooks/useWriteData";
import Form from "./components/Form/Form";
import Select from "./UI/Select";


export default {
  components: {Select, Form, Modal, Header},
  setup() {
    const store = useStore()
    const state = reactive({
      isLoaded: store.state.isLoaded,
      isAuth: store.state.isAuth,
      options: store.state?.sections,
      sectionName: '',
      openWindow: false,
      error: null
    })

    if (localStorage.getItem('userData')) {
      const data = JSON.parse(localStorage.getItem('userData'))
      store.dispatch('changeAuthStatus', data)
    }
    const openModel = () => {
      store.dispatch('changeStatusOpen')
    }
    const setSelectedOptionInStore = (value) => {
      if (value) {
        store.dispatch('changeSelectedOption', value)
      }
    }

    const addSection = () => {
      if (state.sectionName) {
        store.dispatch('changeSection', [...store.state.sections, {
          id: Math.floor(Math.random() * 1000000),
          value: state.sectionName
        }])
        state.openWindow = false
        state.sectionName = ''
        useWriteData('sections', {data: store.state.sections})
      }
    }

    watchEffect(() => {
      if (!state.sectionName) {
        state.error = true
      }else {
        state.error = false
      }
      state.isLoaded = store.state.isLoaded
      state.isAuth = store.state.isAuth
      state.options = store.state.sections
    })

    return {
      state, openModel, setSelectedOptionInStore, addSection
    }
  }
}
</script>