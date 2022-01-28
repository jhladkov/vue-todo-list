<template>
  <header class="header">
    <Container>
      <div class="header__wrapper">
        <div class="header__logo">
          <img src="@/assets/logo.png" alt="">
        </div>
        <div class="header__inner">
          <AccountInfo :src="state.img" :name="state.name" @exit="exit"/>
        </div>
      </div>
    </Container>
  </header>
</template>

<script>
import {reactive, watchEffect} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import AccountInfo from "../AccountInfo/AccountInfo";

export default {
  components: {AccountInfo},
  setup() {

    const router = useRouter()
    const store = useStore()

    const state = reactive({
      name: store?.state?.userInfo?.user?.displayName,
      img: store?.state?.userInfo?.user?.photoURL
    })

    watchEffect(() => {
      state.name = store?.state?.userInfo?.user?.displayName
      state.img = store?.state?.userInfo?.user?.photoURL
    })

    const exit = () => {
      localStorage.removeItem('userData')
      store.dispatch('resetState')
      router.push('/login')
    }

    return {
      state, exit
    }
  }
}
</script>

<style src="@/assets/header.scss" lang="scss" scoped>

</style>