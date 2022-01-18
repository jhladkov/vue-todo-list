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
  <Panel title="Дела" title-class="panel-todo__title title"/>
</template>

<script>
import Button from "../UI/Button";
import {useStore} from 'vuex'
import Section from "../hooc/Section";
import Panel from "../components/Panel/Panel";
import {onMounted} from "vue";
import {getDatabase, ref, onValue} from "firebase/database";

export default {
  components: {Panel, Section, Button},
  setup() {
    const store = useStore()

    const openModel = () => {
      store.dispatch('changeStatusOpen')
    }
    onMounted(() => {
      try {
        const db = getDatabase();
        const starCountRef = ref(db, '/');
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          console.log(data)
        });
      } catch (err) {
        console.log(err)
      }
    })

    return {
      openModel,
    }
  }
}
</script>

<style scoped>

</style>