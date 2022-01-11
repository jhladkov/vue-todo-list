<template>
  <section class="sidebar">
    <SidebarItem v-for="(sidebarItemText,index) in sidebarItemsArr" :title="sidebarItemText" :key="index"/>
  </section>
</template>

<script>
import SidebarItem from "../SidebarItem/SidebarItem";
import {ref} from "vue";
export default {
  components: {SidebarItem},
  setup() {
    const sidebarItemsArr = ref(['Сегодня','Предстоящее'])

    return {
      sidebarItemsArr
    }
  }
}
</script>

<style src="@/assets/sidebar.scss" lang="scss" scoped>

</style>