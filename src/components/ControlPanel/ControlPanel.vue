<template>
  <Section
      v-if="isAuth"
      section-class="section control-panel"
  >
    <div class="control-panel__wrapper">
      <div class="control-panel__inner">
        <Button
            @click="openModel"
            text="Добавить задачу"
            item-class="control-panel__add-task button"
        />
      </div>
      <div class="control-panel__inner">
        <Button
            @click="openSectionModal"
            text="Добавить секцию"
            item-class="control-panel__add-task button"
        />
      </div>
      <Select
          @selectedOption="setSelectedOptionInStore"
          @removeSection="removeSection"
          className="control-panel__select"
          typeOpen="bottom"
          text="Секция: "
          :options="selectOptions"
      />
    </div>


  </Section>
</template>

<script>
import {useStore} from "vuex";
import {ref,getStorage} from "firebase/storage";



export default {
  props: {
    isAuth: Boolean,
    selectOptions: {
      type: Array,
      default: []
    }
  },
  setup(props, {emit}) {
    const store = useStore()
    const storage = getStorage()

    const openSectionModal = () => {
      emit('openSectionModal')
    }

    const openModel = () => {
      store.dispatch('changeStatusOpen')
    }
    const setSelectedOptionInStore = (value) => {
      if (value) {
        store.commit('setSelectedOption',value)
      }
    }
    const removeSection = (id, sectionName) => {
      const filterSection = store.state.sections.filter(item => item.id !== id)
      const filterTodos = store.state.modal.todos.filter(item => {
        const elementRef = ref(storage, item.storageInfo.url);

        if (item.storageInfo.url && item.section === sectionName) {
          store.dispatch('removeDataFromDatabase',elementRef)
        }
        console.log('sectionNAme',sectionName)
        return item.section !== sectionName
      })
      console.log(filterTodos)
      store.dispatch('changeSection', filterSection)
      store.dispatch('changeTodosArr', filterTodos)
      store.dispatch('writeDataInDatabase', {
        path: 'sections',
        value: {data: filterSection}
      })
      store.dispatch('writeDataInDatabase', {
        path: 'todo',
        value: {data: filterTodos}
      })
    }

    return {
      openModel,
      setSelectedOptionInStore,
      removeSection,
      openSectionModal
    }
  }
}
</script>
