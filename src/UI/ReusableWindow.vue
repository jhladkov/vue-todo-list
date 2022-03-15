<template>
  <div class="window">
    <div class="window__inner">
      <Title
          :title="title"
          title-class="window__title"
      />
      <div
          @click="closeReusableWindow"
          class="window__close"
      >&times;</div>
    </div>
    <div class="window__content">
      <slot></slot>
    </div>
  </div>
  <Background @click="closeReusableWindow"/>
</template>

<script>

export default {
  name: 'ReusableWindow',
  props: {
    title: String,
  },
  setup(props,{emit}) {

    const closeReusableWindow = () => {
      emit('closeReusableWindow')
    }

    return{
      closeReusableWindow
    }
  }
}
</script>
