<template>
  <div
      v-if="!state.uploadStatus"
      :class="dragClass"
      @dragstart.prevent="state.drag = true"
      @dragleave.prevent="state.drag = false"
      @dragover.prevent="state.drag = true"
      @drop.prevent="dropData"
  >
    <div class="modal__drag drag-area">
      <div
          v-if="state.loadingStatus"
          class="drag-area__loader"
      >
        <Loader/>
        <Button
            @click="cancelSendData"
            item-class="drag-area__button remove"
            text="Отменить загрузку"
        />
      </div>
      <div
          v-else
          class="drag-area-info"
      >
        <div
            v-if="!state.drag"
            class="img-wrapper__inner"
        >
          <Input
              @getFile="dropData"
              input-class="button"
              placeholder="Выберите файл"
              input-type="file"
          />
        </div>
        <p
            v-if="!state.drag"
            class="drag-area-info__text"
        >
          или Вставьте файл
        </p>
        <div
            v-if="!state.drag"
            class="drag-area-info__inner"
        >
          <p class="drag-area-info__text"> или </p>
          <Svg
              v-if="!state.recordingAudioStatus"
              @click="recordingAudio(true)"
              view-box="0 0 32 32"
              class-svg="drag-area-info__svg svg"
              :path="recordingStartPathSvg"
          />
          <Svg
              v-if="state.recordingAudioStatus"
              @click="recordingAudio(false)"
              view-box="0 0 32 32"
              class-svg="drag-area-info__svg svg"
              :path="recordingStopPathSvg"
          />
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
      v-else-if="conditionImgResult"
  />
  <DragAndDropResult
      @dropData="dropData"
      @deleteData="deleteData"
      :url="state.dataInfo.url"
      class-name="modal__inner video-wrapper"
      type-result="video"
      v-else-if="conditionVideoResult"
  />
  <DragAndDropResult
      @dropData="dropData"
      @deleteData="deleteData"
      :url="state.dataInfo.url"
      class-name="modal__inner audio-wrapper"
      type-result="audio"
      v-else-if="conditionAudioResult"
  />
</template>

<script>
import {reactive, computed} from "vue";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {useRemoveData} from "../../hooks/useRemoveData";
import DragAndDropResult from "../DragAndDropResult/DragAndDropResult";
import Svg from "../../UI/Svg";

export default {
  components: {Svg, DragAndDropResult},
  setup(props, {emit}) {
    const storage = getStorage();
    const state = reactive({
      stopRecording: false,
      itemsRecorder: [],
      drag: false,
      cancel: false,
      recordingAudioStatus: false,
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
        'audio/ogg',
        'audio/webm',
      ],
      dataInfo: {
        url: '',
        elementRef: ''
      }
    })

    const dragClass = computed(() => {
      return state.drag ? 'modal__inner drag' : 'modal__inner'
    })
    const recordingStartPathSvg = computed(() => {
      return 'M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM12 9l12 7-12 7z'
    })
    const recordingStopPathSvg = computed(() => {
      return 'M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM16 29c-7.18 0-13-5.82-13-13s5.82-13 13-13 13 5.82 13 13-5.82 13-13 13zM10 10h4v12h-4zM18 10h4v12h-4z'
    })
    const conditionImgResult = computed(() => {
      return state.sendDataInfo.type === 'image/jpeg'
          || state.sendDataInfo.type === 'image/png'
          || state.sendDataInfo.type === 'image/webp'
    })
    const conditionVideoResult = computed(() => {
      return state.sendDataInfo.type === 'video/mp4'
    })
    const conditionAudioResult = computed(() => {
      return state.sendDataInfo.type === 'audio/mpeg'
          || state.sendDataInfo.type === 'audio/ogg'
          || state.sendDataInfo.type === 'audio/webm'
    })

    let upload;

    const sendDataToStorage = (value, isBlob) => {
      if (isBlob) {
        emit('activeUpload', true, 'audio/webm')
      }
      state.activeUpload = true
      state.loadingStatus = true
      const elementRef = ref(storage, `${JSON.parse(localStorage.getItem('userData')).user.uid}/${state.sendDataInfo.name}`);
      const file = value;
      console.log('filesend', file)

      console.log('elemRef', elementRef)
      console.log('state.sendDataInfo.name', state.sendDataInfo.name)

      if (Object.values(state.validType).includes(file.type) || isBlob) {
        emit('removeElementRef', elementRef)
        upload = uploadBytesResumable(elementRef, file)
        // watchEffect(() => {
        //   if (state.cancel) {
        //     console.log(upload.cancel());
        //     state.cancel = false
        //     state.loadingStatus = false
        //
        //   }
        // })
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
        console.log('errorType', file)
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
    const recordingAudio = (active) => {
      if (active) {
        emit('activeUpload', true, state.sendDataInfo.type)
        state.stopRecording = false   //
      }
      state.recordingAudioStatus = !state.recordingAudioStatus
      if (!Array.isArray(state.itemsRecorder)) {
        state.itemsRecorder = []
      }
      const device = navigator.mediaDevices.getUserMedia({audio: true})
      let items = [];
      device.then(stream => {
        const recorder = new MediaRecorder(stream)
        if (recorder.state !== 'recorder') {
          recorder.ondataavailable = e => {
            if (!state.stopRecording) {
              items.push(e.data)
              if (Array.isArray(state.itemsRecorder)) {
                state.itemsRecorder = items
              }
            } else {
              recorder.stop()
              items = []
            }
          }
        }
        if (active) {
          recorder.start(10)
        } else {
          try {
            if (!state.recordingAudioStatus) {
              state.recordingAudioStatus = false
              state.stopRecording = true
              const blob = new Blob(state.itemsRecorder, {type: 'audio/webm'})
              state.sendDataInfo.name = recorder.stream.id
              state.sendDataInfo.type = 'audio/webm'
              state.itemsRecorder = null
              if (blob) {
                sendDataToStorage(blob, true)
              }
            }
          } catch (err) {
            console.log(err)
          }
        }
      })
    }
    const cancelSendData = () => {
      upload.cancel();
      state.sendDataInfo = {}
      state.loadingStatus = false
      emit('activeUpload', false, state.sendDataInfo.type)
      emit('removeElementRef', null)
    }
    return {
      state,
      dropData,
      deleteData,
      cancelSendData,
      recordingAudio,
      dragClass,
      recordingStartPathSvg,
      recordingStopPathSvg,
      conditionImgResult,
      conditionAudioResult,
      conditionVideoResult
    }
  }
}
</script>