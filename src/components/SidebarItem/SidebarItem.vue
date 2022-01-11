<template>
  <div class="sidebar__item">
    <p class="sidebar__item__title title">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
