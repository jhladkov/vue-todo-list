<template>
  <section
      :class="sectionClass"
      class="section"
  >
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'Section',
  props:{
    sectionClass: {
      type: String
    }
  }
}
</script>

<style scoped>

</style>