<template>
  <div
      @click="login"
      class="login__item item"
  >
    <p>Продолжить через {{ title }}</p>
  </div>
</template>

<script>
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {useStore} from "vuex";
import { useRouter} from 'vue-router'
import {onMounted} from "vue";

export default {
  props: {
    title: String,
    classSvg: {
      type: String,
      default: 'icon'
    },
    viewBox: {
      type: String,
      default: '0 0 32 32',
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  setup() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const store = useStore()
    const router = useRouter()

    const login = () => {
      signInWithPopup(auth, provider)
          .then(async (result) => {
            if (result) {
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;
              const user = result.user;

              const obj = {token, user}

              localStorage.setItem('userData', JSON.stringify(obj))
              store.dispatch('changeAuthStatus', obj)

             await store.dispatch('getTodoFromDatabase', {
                path: 'todo',
                uid: obj?.user?.uid,
              })
             await store.dispatch('getSectionFromDatabase',{
               path: 'sections',
               uid: obj?.user?.uid,
             })

              router.push('/')

            }

          }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log('errorCode', errorCode)
        console.log('errorMessage', errorMessage)
        console.log('email', email)
        console.log('credential', credential)
      });
    }

    onMounted(() => store.dispatch('changeLoadingStatus',true))

    return {
      login
    }
  }
}
</script>
