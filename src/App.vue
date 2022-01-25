<template>
  <main class="main">
    <Header/>
    <div class="main-wrapper">
      <Container>
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

    watchEffect(() => state.isLoaded = store.state.isLoaded)

    return{
      state
    }
  }
}
</script>