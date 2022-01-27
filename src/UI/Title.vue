<template>
  <h2 :class="titleClass">{{title}}</h2>
</template>

<script>
export default {
  name: 'Title',
  props: {
    title:String,
    titleClass: {
      type:String,
      default: 'title'
    }
  }
}
</script>
