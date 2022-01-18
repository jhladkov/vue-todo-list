<template>
  <h3 :class="titleClass">{{title}}</h3>
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
