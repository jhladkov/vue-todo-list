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
      :class-name="validation"
      :type-result="validation"
      v-if="validation && state.dataInfo.url"
  />
</template>

<script>
import {reactive, computed} from "vue";
import {getStorage, ref,uploadBytesResumable} from "firebase/storage";
import DragAndDropResult from "../DragAndDropResult/DragAndDropResult";
import Svg from "../../UI/Svg";
import {useStore} from "vuex";

export default {
  components: {Svg, DragAndDropResult},
  setup(props, {emit}) {
    const storage = getStorage();
    const store = useStore()
    const state = reactive({
      uid: JSON.parse(localStorage.getItem('userData')).user.uid,
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
      },
      file: null
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
    const validation = computed(() => {
      switch (state.sendDataInfo.type) {
        case 'image/jpeg':
          return 'image'
        case  'image/png':
          return 'image'
        case 'image/webp':
          return 'image'
        case 'video/mp4':
          return 'video'
        case  'audio/mpeg':
          return 'audio'
        case  'audio/ogg':
          return 'audio'
        case 'audio/webm':
          return 'audio'
        case 'text/plain':
          return 'text'
        default:
          return null
      }
    })

    let upload;

    const sendDataToStorage = (value, isBlob) => {

      if (isBlob) {
        emit('activeUpload', true, 'audio/webm')
      }
      state.activeUpload = true
      state.loadingStatus = true

      console.log('filesend', value)
      const elementRef = ref(storage, `${state.uid}/${state.sendDataInfo.name}`);
      store.commit('setElementRef',elementRef)
      state.dataInfo.elementRef = elementRef
      console.log('elementRefStorage',elementRef)
      console.log('elemRef', elementRef)
      console.log('state.sendDataInfo.name', state.sendDataInfo.name)

      if (Object.values(state.validType).includes(value.type) || isBlob) {
        emit('removeElementRef', elementRef)
        upload = uploadBytesResumable(elementRef, value)
        upload.then(() => {
          store.dispatch('getUrl',{storage,elementRef})
          .then(url => {
            console.log('url',url)
            state.loadingStatus = false
            state.dataInfo.url = url
            state.activeUpload = false
            state.uploadStatus = true
            emit('activeUpload', state.activeUpload, value.type)
            emit('getUrlImg', url)
          })
        })
      } else {
        state.activeUpload = false
        state.uploadStatus = false
        state.loadingStatus = false
        emit('activeUpload', state.activeUpload, value.type)
        alert('Данный тип не потдерживаеться')
      }
    }
    const deleteData = () => {
      if (state.dataInfo.elementRef) {
        store.dispatch('removeDataFromDatabase', state.dataInfo.elementRef)
        state.sendDataInfo = {}
        state.uploadStatus = false
        state.dataInfo.url = ''
        state.dataInfo.elementRef = ''
        store.commit('setElementRef',null)
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
      state.file = file
      console.log(file)
      sendDataToStorage(file)
      state.drag = false

    }
    const recordingAudio = (active) => {
      let items = [];

      navigator.mediaDevices.getUserMedia({audio: true})
          .then(stream => {
            if (active) {
              emit('activeUpload', true, state.sendDataInfo.type)
              state.stopRecording = false   //
            }
            state.recordingAudioStatus = !state.recordingAudioStatus
            if (!Array.isArray(state.itemsRecorder)) {
              state.itemsRecorder = []
            }
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
            }
          })
          .catch(err => {
            alert('Вы запретили или не разрешили использовать микрофон')
          })
    }

    window.onbeforeunload = (e) => {
      if(store.state.elementRef) {
        upload.cancel()
        store.dispatch('removeDataFromDatabase',store.state.elementRef)
      }
    }

    const cancelSendData = () => {
      upload.cancel()
      store.commit('setElementRef',null)
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
      validation,
    }
  }
}
</script>