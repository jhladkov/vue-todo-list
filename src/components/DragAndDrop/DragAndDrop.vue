<template>
  <div
      :class="state.drag ? 'modal__inner drag' : 'modal__inner'"
      @dragstart.prevent="state.drag = true"
      @dragleave.prevent="state.drag = false"
      @dragover.prevent="state.drag = true"
      @drop.prevent="dropData"
  >
    <div class="modal__drag drag-area">
      <div class="drag-area-info">
        <p v-if="!state.drag" class="drag-area-info__text">Вставьте изображение</p>
        <p v-else class="drag-area-info__text">Отпустите изображение</p>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
import {getStorage, ref, uploadBytes, listAll,getDownloadURL } from "firebase/storage";

export default {
  setup(props,{emit}) {
    const state = reactive({
      drag: false,
      sendDataInfo: {}
    })

    const sendDataToStorage = (value) => {
      const storage = getStorage();
      const elementRef = ref(storage, state.sendDataInfo.name);
      // const elementRef = ref(storage, 'gs://todo-list-app-433b9.appspot.com');
      const file = value;

      //  uploadBytes(elementRef, file).then((snapshot) => {
      //   console.log(snapshot);
      // });

      getDownloadURL(ref(storage, elementRef))
          .then((url) => {
            console.log(url)
          })
          .catch((error) => {
            console.log(error)
          });

    }

    const dropData = (event) => {
      const file = event.dataTransfer.files[0]
      emit('getFile',file.name)
      state.sendDataInfo.name = file.name
      sendDataToStorage(file)
      console.log(file)
      state.drag = false

    }

    return {
      state, dropData
    }
  }
}
</script>