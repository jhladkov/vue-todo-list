<template>
  <button :type="buttonType" :class="itemClass" >{{text}}</button>
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
      default: 'button'
    },
    buttonType: {
      type: String,
      default: 'button'
    }
  },
}
</script>