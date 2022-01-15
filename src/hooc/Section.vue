<template>
  <section :class="sectionClass">
    <slot></slot>
  </section>
</template>

<script>
export default {
  props:{
    sectionClass: {
      type: String,
      default: 'section'
    }
  }
}
</script>

<style scoped>

</style>