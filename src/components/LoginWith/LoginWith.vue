<template>
  <div @click="login" class="login__item item">
    <Svg :path="path"
         :viewBox="viewBox"
         :classSvg="classSvg"
    />
    <p>Продолжить через {{ title }}</p>
  </div>
</template>

<script>
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {useStore} from "vuex";

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

    const login = () => {
      signInWithPopup(auth, provider)
          .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;

            const obj = {token, user}

            store.dispatch('changeAuthStatus', obj)

            // console.log('token',token)
            // console.log('user',user)
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

    return {
      login
    }
  }
}
</script>
