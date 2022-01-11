<template>
  <header class="header">
    <Container>
      <div class="header__inner">
        <div class="header__logo">
          <img src="@/assets/logo.png" alt="">
        </div>
        <div class="header__add-task">
          <Button text="Добавить задачу" item-class="header__button button"/>
        </div>
      </div>
    </Container>
  </header>
</template>

<script>
import Button from "../../UI/Button";
import Container from "../../hooc/Container";

export default {
  components: {Container, Button}
}
</script>

<style src="@/assets/header.scss" lang="scss" scoped>

</style>