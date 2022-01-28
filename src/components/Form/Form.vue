<template>
  <form :class="formClass">
    <slot></slot>
  </form>
</template>

<script>
export default {
  props:{
    formClass: {
      type: String,
      default: 'form'
    }
  }
}
</script>
