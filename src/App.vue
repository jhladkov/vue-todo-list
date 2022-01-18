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

export default {
  components: {Modal, Header},
  setup() {

  }
}
</script>