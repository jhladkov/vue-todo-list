<template>
  <a :href="url">{{ content }}</a>
</template>

<script>
export default {
  props: {
    url:String,
    content: {
      type: String,
      default: ''
    }
  },
  name: 'Link'
}
</script>