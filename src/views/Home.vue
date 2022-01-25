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
  <Panel title="Дела" title-class="panel-todo__title title" typePanel="todo"/>
  <Panel title="Выполненные" title-class="panel-done__title title" typePanel="done"/>
</template>

<script>
import Button from "../UI/Button";
import {useStore} from 'vuex'
import {onMounted} from "vue";
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

    const getDataTodo = () => {
      get(child(dbRef, `${JSON.parse(localStorage.getItem('userData')).user.uid}/`)).then((snapshot) => {
        store.dispatch('changeLoadingStatus',true)

        if (snapshot.exists()) {
          const data = snapshot.val().data
          if (data) {
            store.dispatch('changeTodosArr', data)
          }
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
        getDataTodo()

      });
    }

    onMounted(() => getDataTodo())


    return {
      openModel,
    }
  }
}
</script>

<style scoped>

</style>