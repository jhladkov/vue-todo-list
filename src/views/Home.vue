<template>
  <Section section-class="section control-panel">
    <div class="control-panel__wrapper">
      <div class="control-panel__inner">
        <Button @click="openModel" text="Добавить задачу" item-class="control-panel__add-task button"/>
      </div>
      <div class="control-panel__inner">
        <Button text="Добавить секцию" item-class="control-panel__add-task button"/>
      </div>
    </div>
  </Section>
</template>

<script>
import Button from "../UI/Button";
import {useStore} from 'vuex'
import Section from "../hooc/Section";

export default {
  components: {Section, Button},
  setup() {
    const store = useStore()

    const openModel = () => {
      store.dispatch('changeStatusOpen')
      // console.log(store.state.modal.open)
    }
    return {
      openModel,
    }
  }
}
</script>

<style scoped>

</style>