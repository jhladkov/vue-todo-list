<template>
  <main class="main">
    <Header/>
    <div class="main-wrapper">
      <Container>
        <ControlPanel
            :is-auth="state.isAuth"
            :select-options="state.options"
            @openSectionModal="state.openWindow = true"
        />
        <router-view/>
        <div v-if="!state.isLoaded">
          <Loader/>
          <Background/>
        </div>
      </Container>
    </div>
    <ReusableWindow
        v-if="state.openWindow"
        title="Создать секцию"
        @closeWindow="state.openWindow = false"
    >
      <Form
          @submit.prevent="addSection"
          form-class="window__form"
      >
        <Input
            v-focus
            :input-class="`window__input input ${!state.error ? '' : 'error-message'}`"
            placeholder="Название секции" v-model.trim="state.sectionName"
        />
        <Button
            button-type="submit"
            item-class="window__add-section button"
            text="Добавть секцию"
        />
      </Form>
    </ReusableWindow>
    <Modal
        v-if="state.globalModalOpen"
        title="Добавить задачу"
    />
  </main>
</template>

<style src="./assets/global.scss" lang="scss">

</style>
<script>
import Header from "./components/Header/Header";

import {useStore} from "vuex";
import {defineAsyncComponent, onMounted, reactive, watchEffect} from "vue";
import Form from "./components/Form/Form";
import Select from "./UI/Select";
import ControlPanel from "./components/ControlPanel/ControlPanel";


export default {
  components: {
    ControlPanel,
    Select,
    Form,
    Modal: defineAsyncComponent(() => import ("./components/Modal")),
    Header
  },
  setup() {
    const store = useStore()
    const state = reactive({
      isLoaded: store.state.isLoaded,
      isAuth: store.state.isAuth,
      options: store.state.sections,
      sectionName: '',
      openWindow: false,
      globalModalOpen: store.state.modal.open,
      error: null,
      uid: JSON.parse(localStorage.getItem('userData'))?.user?.uid
    })

    if (localStorage.getItem('userData')) {
      const data = JSON.parse(localStorage.getItem('userData'))
      store.dispatch('changeAuthStatus', data)
    }

    const getDataTodo = async () => {
      try {
        await store.dispatch('getTodoFromDatabase', {
          path: 'todo',
          uid: state.uid,
        })
      } catch (err) {
        console.log(err)
      }
    }

    const getDataSection = async () => {
      try {
        await store.dispatch('getSectionFromDatabase', {
          path: 'sections',
          uid: state.uid
        })
      } catch (err) {
        console.log(err)
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
        store.dispatch('writeDataInDatabase', {
          path: 'sections',
          value: {data: store.state.sections},
        })
      }
    }

    onMounted(() => {
      getDataTodo()
      getDataSection()
      window.onbeforeunload = (e) => {
        if(store.state.elementRef) {
          store.dispatch('removeDataFromDatabase',store.state.elementRef)
        }
      }
    })

    // window.onbeforeunload = (e) => {
    //   console.log(e)
    //    const ms = 'stooop!'
    //    e.returnValue = ms
    //    return ms
    //  }

    watchEffect(() => {



      if (!state.sectionName) {
        state.error = true
      } else {
        state.error = false
      }
      state.isLoaded = store.state.isLoaded
      state.isAuth = store.state.isAuth
      state.globalModalOpen = store.state.modal.open
      state.options = store.state.sections
    })

    return {
      state, addSection
    }
  }
}
</script>