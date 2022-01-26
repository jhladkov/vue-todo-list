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


  <div
      v-else-if="state.sendDataInfo.type === 'image/jpeg'
      || state.sendDataInfo.type === 'image/png'
      || state.sendDataInfo.type === 'image/webp'
      "

      class="modal__inner img-wrapper"

  >
    <div class="img-wrapper__img">
      <img :src="state.dataInfo.url" alt="">
    </div>
    <div class="img-wrapper__inner">
      <Input @getFile="dropData" input-class="button" placeholder="Изменить" input-type="file"/>
      <Button @click="deleteImg" button-type="button" text="Удалить"
              item-class="img-wrapper__inner__button button remove"/>
    </div>
  </div>
  <div
      class="modal__inner video-wrapper"
      v-else-if="state.sendDataInfo.type === 'video/mp4'"
  >
    <video controls :src="state.dataInfo.url"></video>

  </div>

  <div
      class="modal__inner audio-wrapper"
      v-else-if="state.sendDataInfo.type === 'audio/mpeg' || state.sendDataInfo.type === 'audio/ogg'"
  >
    <audio controls :src="state.dataInfo.url"></audio>

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
        'image/png',
        'text/plain',
        'image/jpeg',
        'video/mp4',
        'video/x-matroska',
        'audio/mpeg',
        'image/webp',
        'audio/ogg'
      ],
      dataInfo: {
        url: '',
        elementRef: ''
      }
    })

    const sendDataToStorage = (value) => {
      const elementRef = ref(storage, `${JSON.parse(localStorage.getItem('userData')).user.uid}/${state.sendDataInfo.name}`);
      const file = value;

      if (Object.values(state.validType).includes(file.type)) {
        emit('removeElementRef', elementRef)

        uploadBytes(elementRef, file).then(() => {
          getDownloadURL(ref(storage, elementRef))
              .then((url) => {
                if (url) {
                  state.loadingStatus = false
                  state.dataInfo.elementRef = elementRef
                  state.dataInfo.url = url
                  state.activeUpload = false
                  state.uploadStatus = true
                  emit('activeUpload', state.activeUpload, value.type)
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
      if (state.dataInfo.elementRef) {
        useRemoveData(state.dataInfo.elementRef)
        state.sendDataInfo.name = ''
        state.uploadStatus = false
        state.dataInfo.url = ''
        state.dataInfo.elementRef = ''
      }
    }

    const dropData = (event, wasActiveInput) => {
      state.activeUpload = true
      state.loadingStatus = true
      let file;
      if (wasActiveInput) {
        deleteImg()
        file = event
      } else {
        console.log('drop')
        file = event.dataTransfer.files[0]
      }
      emit('activeUpload', true, file.type)
      state.sendDataInfo.name = file.name
      state.sendDataInfo.type = file.type
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