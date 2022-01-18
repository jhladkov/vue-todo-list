<template>
  <section :class="sectionClass">
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'Section',
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