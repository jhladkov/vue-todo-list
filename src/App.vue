<template>
  <main class="main">
    <Header/>
    <div class="main-wrapper">
      <Container>
        <Section section-class="section control-panel">
          <div class="control-panel__wrapper">
            <div class="control-panel__inner">
              <Button @click="openModel" text="Добавить задачу" item-class="control-panel__add-task button"/>
            </div>
            <div class="control-panel__inner">
              <Button text="Добавить секцию" item-class="control-panel__add-task button"/>
            </div>
          </div>
        </Section>
        <router-view/>
        <div v-if="!state.isLoaded">
          <Loader/>
          <Background/>
        </div>

      </Container>
    </div>
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


export default {
  components: {Modal, Header},
  setup() {
    const store = useStore()
    const state = reactive({
      isLoaded: store.state.isLoaded
    })

    if (localStorage.getItem('userData')) {
      const data = JSON.parse(localStorage.getItem('userData'))
      store.dispatch('changeAuthStatus', data)
    }
    const openModel = () => {
      store.dispatch('changeStatusOpen')
    }



    watchEffect(() => state.isLoaded = store.state.isLoaded)

    return{
      state,openModel
    }
  }
}
</script>