<template>
  <div class="window">
    <div class="window__inner">
      <Title :title="title" title-class="window__title title"/>
      <div @click="closeWindow" class="window__close">&times;</div>
    </div>
    <div class="window__content">
      <slot></slot>
    </div>
  </div>
  <Background @click="closeWindow"/>
</template>

<script>

export default {
  name: 'ReusableWindow',
  props: {
    title: String,
  },
  setup(props,{emit}) {

    const closeWindow = () => {
      emit('closeWindow')
    }

    return{
      closeWindow
    }
  }
}
</script>
