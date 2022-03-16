<template>
  <button
      :type="buttonType"
      type="button"
      :class="itemClass"
      class="button"
  >{{text}}</button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: {
      type: String,
      default:'click'
    },
    itemClass: {
      type: String,
    },
    buttonType: {
      type: String,
    }
  },
}
</script>