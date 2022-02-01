<template>
  <div v-if="!state.uploadStatus"
       :class="state.drag ? 'modal__inner drag' : 'modal__inner'"
       @dragstart.prevent="state.drag = true"
       @dragleave.prevent="state.drag = false"
       @dragover.prevent="state.drag = true"
       @drop.prevent="dropData"
  >
    <div class="modal__drag drag-area">
      <div class="drag-area__loader" v-if="state.loadingStatus">
        <Loader/>
        <Button @click="cancelSendData" button-type="button" item-class="drag-area__button button remove"
                text="Отменить загрузку"/>
      </div>
      <div v-else class="drag-area-info">
        <div v-if="!state.drag" class="img-wrapper__inner">
          <Input @getFile="dropData" input-class="button" placeholder="Выберите файл" input-type="file"/>
        </div>
        <p v-if="!state.drag" class="drag-area-info__text"> или Вставьте файл</p>
        <div v-if="!state.drag" class="drag-area-info__inner">
          <audio controls v-show="state.testRecorder.url" class="testElement" :src="state.testRecorder.url"></audio>

          <p class="drag-area-info__text"> или </p>
          <Svg v-if="!state.recordingAudioStatus" @click="recordingAudio" view-box="0 0 32 32"
               class-svg="drag-area-info__svg svg"
               path="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 9l12 7-12 7z"/>
          <Svg v-if="state.recordingAudioStatus" @click="recordingAudio" view-box="0 0 32 32"
               class-svg="drag-area-info__svg svg"
               path="M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM10 10h4v12h-4zM18 10h4v12h-4z"/>
        </div>

        <p v-else class="drag-area-info__text">Отпустите файл</p>
      </div>
    </div>


  </div>
  <DragAndDropResult
      @deleteData="deleteData"
      @dropData="dropData"
      :url="state.dataInfo.url"
      class-name="modal__inner img-wrapper"
      type-result="image"
      v-else-if="state.sendDataInfo.type === 'image/jpeg'
      || state.sendDataInfo.type === 'image/png'
      || state.sendDataInfo.type === 'image/webp'"
  />
  <DragAndDropResult
      @dropData="dropData"
      @deleteData="deleteData"
      :url="state.dataInfo.url"
      class-name="modal__inner video-wrapper"
      type-result="video"
      v-else-if="state.sendDataInfo.type === 'video/mp4'"
  />
  <DragAndDropResult
      @dropData="dropData"
      @deleteData="deleteData"
      :url="state.dataInfo.url"
      class-name="modal__inner audio-wrapper"
      type-result="audio"
      v-else-if="state.sendDataInfo.type === 'audio/mpeg' || state.sendDataInfo.type === 'audio/ogg'"
  />
</template>

<script>
import {reactive, watchEffect} from "vue";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {useRemoveData} from "../../hooks/useRemoveData";
import DragAndDropResult from "../DragAndDropResult/DragAndDropResult";
import Svg from "../../UI/Svg";

export default {
  components: {Svg, DragAndDropResult},
  setup(props, {emit}) {
    const storage = getStorage();

    const state = reactive({
      drag: false,
      cancel: false,
      recordingAudioStatus: false,
      sendDataInfo: {},
      uploadStatus: false,
      activeUpload: false,
      loadingStatus: false,
      testRecorder: {
        url: ''
      },
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

    let upload;

    const sendDataToStorage = (value) => {
      const elementRef = ref(storage, `${JSON.parse(localStorage.getItem('userData')).user.uid}/${state.sendDataInfo.name}`);
      const file = value;

      console.log('elemRef', elementRef)
      console.log('state.sendDataInfo.name', state.sendDataInfo.name)

      if (Object.values(state.validType).includes(file.type)) {
        emit('removeElementRef', elementRef)
        upload = uploadBytesResumable(elementRef, file)
        watchEffect(() => {
          console.log('change', state.cancel)
          console.log('state', state)
          if (state.cancel) {
            console.log(upload.cancel());
            state.cancel = false
            state.loadingStatus = false

          }
        })
        upload.then(() => {
          getDownloadURL(ref(storage, elementRef))
              .then((url) => {
                if (url) {
                  console.log('ref', elementRef)
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
                console.log('error', error)
              });

        })
      } else {
        state.activeUpload = false
        state.uploadStatus = false
        state.loadingStatus = false
        console.log('errorType', file.type)
      }
    }
    const deleteData = () => {
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
        deleteData()
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

    const recordingAudio = () => {
      state.testRecorder.url = ''
      state.recordingAudioStatus = !state.recordingAudioStatus


      const device = navigator.mediaDevices.getUserMedia({audio: true})
      let items = []
      device.then(stream => {
        console.log('stream', stream)
        const recorder = new MediaRecorder(stream)
        console.log('recorder',recorder)
        recorder.ondataavailable = e => {
          console.log('e', e)
          items.push(e.data)
        }
        recorder.start(100)
        watchEffect(() => {
          if (!state.recordingAudioStatus) {
            console.log(state.recordingAudioStatus, 'erseafascasd')
            console.log('watchEffectisWork')
            console.log('stop')
            const blob = URL.createObjectURL(new Blob(items, {type: 'audio/webm'}))
            if (!state.testRecorder.url) {
              console.log('blob', blob)
              state.testRecorder.url = blob
            }
            recorder.stop()
          }
        })
      })
      .catch(err => {
        throw err
      })
    }


    const cancelSendData = () => {
      console.log(upload.cancel());
      state.loadingStatus = false
    }

    return {
      state, dropData, deleteData, cancelSendData, recordingAudio
    }
  }
}
</script>