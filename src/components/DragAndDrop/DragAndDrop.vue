<template>
  <div v-if="!state.uploadStatus"
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
  <div v-else class="modal__inner img-wrapper">
    <div class="img-wrapper__img">
      <img :src="state.imgInfo.url" alt="">
    </div>
    <div class="img-wrapper__inner">
      <Input @getFile="dropData" input-class="button" placeholder="Изменить" input-type="file"/>
      <Button @click="deleteImg" button-type="button" text="Удалить"
              item-class="img-wrapper__inner__button button remove"/>
    </div>
  </div>

</template>

<script>
import {reactive} from "vue";
import {getStorage, ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import Input from "../../UI/Input";

export default {
  components: {Input},
  setup(props, {emit}) {
    const storage = getStorage();

    const state = reactive({
      drag: false,
      sendDataInfo: {},
      uploadStatus: false,
      imgInfo: {
        url: '',
        elementRef: ''
      }
    })

    const sendDataToStorage = (value) => {
      const elementRef = ref(storage, state.sendDataInfo.name);
      const file = value;

      uploadBytes(elementRef, file).then((snapshot) => {
        getDownloadURL(ref(storage, elementRef))
            .then((url) => {
              if (url) {
                state.imgInfo.elementRef = elementRef
                state.imgInfo.url = url
                state.uploadStatus = true
                emit('getUrlImg', url)
              }
              console.log(url)
            })
            .catch((error) => {
              console.log(error)
            });
      });
    }
    const deleteImg = () => {
      if (state.imgInfo.elementRef) {
        deleteObject(state.imgInfo.elementRef).then(() => {
          state.sendDataInfo.name = ''
          state.uploadStatus = false
          state.imgInfo.url = ''
          state.imgInfo.elementRef = ''
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });
      }
    }

    const dropData = (event,wasActiveInput) => {
      let file;
      if (wasActiveInput) {
        file = event
      }else {
        console.log('drop')
        file = event.dataTransfer.files[0]
      }
      state.sendDataInfo.name = file.name
      sendDataToStorage(file)
      state.drag = false
    }

    return {
      state, dropData, deleteImg
    }
  }
}
</script>