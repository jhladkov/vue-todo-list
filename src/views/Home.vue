<template>
  <Panel title="Дела" title-class="panel-todo__title title" typePanel="todo">
    <Select
        @selectedOption="test"
        default-selected-value="По приоритету"
        :possibility-to-delete="false"
        type-open="bottom"
        class-name="panel-todo__filter-select"
        :options="state.options"
        text="Фильтровать: "/>
  </Panel>
  <Panel title="Выполненные" title-class="panel-done__title title" typePanel="done"/>
</template>

<script>
import Button from "../UI/Button";
import {useStore} from 'vuex'
import {onMounted, reactive} from "vue";
import Section from "../hooc/Section";
import Panel from "../components/Panel/Panel";
import {getDatabase, ref, get, child} from "firebase/database";
import Select from "../UI/Select";

export default {
  components: {Select, Panel, Section, Button},
  setup() {
    const store = useStore()
    const state = reactive({
      options: [
          {id: Math.floor(Math.random() * 1000000), value: 'По приоритету'},
      ],
    })
    const dbRef = ref(getDatabase());

    const getDataTodo = (path = '') => {
      get(child(dbRef, `${JSON.parse(localStorage.getItem('userData')).user.uid}/${path}`)).then((snapshot) => {
        store.dispatch('changeLoadingStatus', true)

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

    const getDataSection = (path = '') => {
      get(child(dbRef, `${JSON.parse(localStorage.getItem('userData')).user.uid}/${path}`)).then((snapshot) => {
        store.dispatch('changeLoadingStatus', true)

        if (snapshot.exists()) {
          const data = snapshot.val().data
          if (data) {
            store.dispatch('changeSection', data)
          }
        } else {
          store.dispatch('changeSection', [{id: Math.floor(Math.random() * 1000000), value: 'Все',notDelete: true}])
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
        getDataSection()
      });
    }

    onMounted(() => {
      getDataTodo('todo')
      getDataSection('sections')
    })

    const test = (value) => {
      console.log('sortBy', value)
    }

    return{
      state,test
    }

  }
}
</script>

<style scoped>

</style>