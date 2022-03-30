<template>
  <Section section-class="login">
    <Title
        title-class="login__title title"
        title="Авторизация"
    />
    <div class="login__inner">
      <LoginWith
          v-for="item in state.loginsArr"
          :title="item.title"
          :path="item.path"
          :class-svg="item.classSvg"
          :view-box="item.viewBox"
      />

    </div>
  </Section>
</template>

<script>

import LoginWith from "../LoginWith/LoginWith";
import {reactive} from "vue";

export default {
  components: {LoginWith},
  setup() {
    const state = reactive({
      loginsArr: [
        {
          path: 'M16.319 13.713v5.487h9.075c-0.369 2.356-2.744 6.9-9.075 6.9-5.463 0-9.919-4.525-9.919-10.1s4.456-10.1 9.919-10.1c3.106 0 5.188 1.325 6.375 2.469l4.344-4.181c-2.788-2.612-6.4-4.188-10.719-4.188-8.844 0-16 7.156-16 16s7.156 16 16 16c9.231 0 15.363-6.494 15.363-15.631 0-1.050-0.113-1.85-0.25-2.65l-15.113-0.006z',
          title: 'Google',
          classSvg: 'item__svg icon',
          viewBox: '0 0 32 32',
        },
      ],
    })

    return {
      state
    }
  }
}
</script>