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
<!--  <img src="gs://todo-list-app-433b9.appspot.com/это.jpg" alt="">-->
</template>

<script>
import Button from "../UI/Button";
import {useStore} from 'vuex'
import Section from "../hooc/Section";
import Panel from "../components/Panel/Panel";
import {getDatabase, ref, get, child} from "firebase/database";

export default {
  components: {Panel, Section, Button},
  setup() {
    const store = useStore()

    const openModel = () => {
      store.dispatch('changeStatusOpen')
    }

    const dbRef = ref(getDatabase());

    get(child(dbRef, `${JSON.parse(localStorage.getItem('userData')).user.uid}/`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val().data
        store.dispatch('changeTodosArr', data)
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    return {
      openModel,
    }
  }
}
</script>

<style scoped>

</style>