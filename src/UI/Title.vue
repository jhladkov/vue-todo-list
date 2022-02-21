<template>
  <h2
      :class="titleClass"
      class="title"
  >{{title}}</h2>
</template>

<script>
export default {
  name: 'Title',
  props: {
    title:String,
    titleClass: {
      type:String,
    }
  }
}
</script>
