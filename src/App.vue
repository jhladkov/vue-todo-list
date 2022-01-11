<template>
  <main class="main">
    <Header/>
    <div class="main-wrapper">
      <Container>
<!--        <Sidebar/>-->
        <router-view/>
      </Container>
    </div>
  </main>
</template>

<style src="./assets/global.scss" lang="scss">

</style>
<script>
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Container from "./hooc/Container";

export default {
  components: {Container, Header}
}
</script>