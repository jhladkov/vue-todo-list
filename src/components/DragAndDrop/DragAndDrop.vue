<template>
  <div v-if="!state.uploadStatus"
       :class="state.drag ? 'modal__inner drag' : 'modal__inner'"
       @dragstart.prevent="state.drag = true"
       @dragleave.prevent="state.drag = false"
       @dragover.prevent="state.drag = true"
       @drop.prevent="dropData"
  >
    <div class="modal__drag drag-area">
      <div class="drag-area__loader --black" v-if="state.loadingStatus">
        <Loader/>
      </div>
      <div v-else class="drag-area-info">
        <p v-if="!state.drag" class="drag-area-info__text">Вставьте файл</p>
        <p v-else class="drag-area-info__text">Отпустите файл</p>
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
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {useRemoveData} from "../../hooks/useRemoveData";

export default {
  setup(props, {emit}) {
    const storage = getStorage();

    const state = reactive({
      drag: false,
      sendDataInfo: {},
      uploadStatus: false,
      activeUpload: false,
      loadingStatus: false,
      validType: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'text/plain',
        'image/jpeg',
        'video/mp4',
        'video/x-matroska',
        'audio/mpeg'
      ],
      imgInfo: {
        url: '',
        elementRef: ''
      }
    })

    const sendDataToStorage = (value) => {
      const elementRef = ref(storage, `${JSON.parse(localStorage.getItem('userData')).user.uid}/${state.sendDataInfo.name}`);
      const file = value;

      if (Object.values(state.validType).includes(file.type)) {
        emit('removeElementRef', elementRef)

        console.log(`${JSON.parse(localStorage.getItem('userData')).user.uid}/${state.sendDataInfo.name}`)

        uploadBytes(elementRef, file).then(() => {
          getDownloadURL(ref(storage, elementRef))
              .then((url) => {
                if (url) {
                  state.loadingStatus = false
                  state.imgInfo.elementRef = elementRef
                  state.imgInfo.url = url
                  state.activeUpload = false
                  state.uploadStatus = true
                  emit('activeUpload', state.activeUpload)
                  emit('getUrlImg', url)
                }
                console.log(url)
              })
              .catch((error) => {
                console.log(error)
              });
        });
      } else {
        state.activeUpload = false
        state.uploadStatus = false
        state.loadingStatus = false
        console.log('errorType', file.type)
      }

    }
    const deleteImg = () => {
      if (state.imgInfo.elementRef) {
        useRemoveData(state.imgInfo.elementRef)
        state.sendDataInfo.name = ''
        state.uploadStatus = false
        state.imgInfo.url = ''
        state.imgInfo.elementRef = ''
      }
    }

    const dropData = (event, wasActiveInput) => {
      state.activeUpload = true
      state.loadingStatus = true
      emit('activeUpload', true)
      let file;
      if (wasActiveInput) {
        deleteImg()
        file = event
      } else {
        console.log('drop')
        file = event.dataTransfer.files[0]
      }
      state.sendDataInfo.name = file.name
      console.log(file)
      sendDataToStorage(file)
      state.drag = false

    }

    return {
      state, dropData, deleteImg
    }
  }
}
</script>