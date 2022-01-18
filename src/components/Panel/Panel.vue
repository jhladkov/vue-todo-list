<template>
  <Section class="section panel-todo">
    <Title :title="title" :title-class="titleClass"/>
  </Section>
</template>

<script>


export default {
  props: {
    title: {
      type: String,
      required: true
    },
    titleClass: {
      type: String
    }
  }
}
</script>
