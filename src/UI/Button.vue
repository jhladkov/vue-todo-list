<template>
  <button :class="itemClass">{{text}}</button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default:'click'
    },
    itemClass: {
      type: String,
      default: 'button'
    }
  }
}
</script>