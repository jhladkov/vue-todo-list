<template>
  <main class="main">
    <Header/>
    <div class="main-wrapper">
      <Container>
        <router-view/>
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


export default {
  components: {Modal, Header},
  setup() {
    const store = useStore()
    if (localStorage.getItem('userData')) {
      const data = JSON.parse(localStorage.getItem('userData'))
      store.dispatch('changeAuthStatus', data)
    }
  }
}
</script>