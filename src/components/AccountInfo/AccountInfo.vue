<template>
  <div
      v-if="src"
      class="header__info-about-account account"
  >


    <div class="account__inner">
      <div class="account__img">
        <img
            :src="src"
            alt=""
        >
      </div>
      <p>{{ name }}</p>
    </div>
    <Button
        @click="$emit('exit')"
        button-type="button"
        text="Выйти"
        item-class="account__exit button exit"
    />

  </div>
</template>

<script>
export default {
  props: {
    src: String,
    name: String
  }
}
</script>
