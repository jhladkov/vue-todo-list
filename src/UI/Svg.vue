<template>
  <svg
      :class="classSvg"
      :viewBox="viewBox"
  >
    <path :d="path"></path>
  </svg>
</template>

<script>
export default {
  name: 'Svg',
  props: {
    classSvg: {
      type: String,
      default: 'icon'
    },
    viewBox: {
      type: String,
      default: '0 0 32 32',
      required: true
    },
    path: {
      type: String,
      required: true
    }
  }
}
</script>