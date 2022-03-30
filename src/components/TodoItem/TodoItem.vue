<template>
  <div class="panel__item item">
    <div
        class="item__header"
    >
      <p>Секция: {{section}}</p>
      <p v-if="typeData">Тип данных: {{typeData}}</p>
    </div>

    <div
        class="item__panel-task panel-todo"
    >
      <div
          v-if="typeData"
          class="panel-todo__inner"
      >
        <a :href="state.downloadUrl" :download="name">
          <Svg
              view-box="0 0 32 32"
              path="M27.844 11.252c-0.101-4.022-3.389-7.252-7.433-7.252-2.369 0-4.477 1.109-5.839 2.835-0.764-0.987-1.959-1.624-3.303-1.624-2.307 0-4.176 1.871-4.176 4.179 0 0.201 0.015 0.399 0.043 0.592-0.351-0.063-0.711-0.098-1.080-0.098-3.344-0-6.054 2.712-6.054 6.058s2.71 6.058 6.054 6.058h2.868l7.078 7.328 7.078-7.328 3.484-0c3.004-0.006 5.438-2.444 5.438-5.451 0-2.565-1.771-4.716-4.156-5.296zM16 26l-6-6h4v-6h4v6h4l-6 6z"
          />
        </a>
        <a :href="url" target="_blank">
          <Svg
              path="M16 6c-6.979 0-13.028 4.064-16 10 2.972 5.936 9.021 10 16 10s13.027-4.064 16-10c-2.972-5.936-9.021-10-16-10zM23.889 11.303c1.88 1.199 3.473 2.805 4.67 4.697-1.197 1.891-2.79 3.498-4.67 4.697-2.362 1.507-5.090 2.303-7.889 2.303s-5.527-0.796-7.889-2.303c-1.88-1.199-3.473-2.805-4.67-4.697 1.197-1.891 2.79-3.498 4.67-4.697 0.122-0.078 0.246-0.154 0.371-0.228-0.311 0.854-0.482 1.776-0.482 2.737 0 4.418 3.582 8 8 8s8-3.582 8-8c0-0.962-0.17-1.883-0.482-2.737 0.124 0.074 0.248 0.15 0.371 0.228v0zM16 13c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"
              view-box="0 0 32 32"
          />
        </a>
      </div>

      <Select
          @selectedOption="rewritePriority"
          v-if="priority"
          :possibility-to-delete="false"
          :default-selected-value="priority"
          text="Приоритет: "
          :options="state.options"
          class-name="item__priority-select"
          type-open="bottom"
      />

    </div>
    <div class="item__info info-wrapper">
      <div class="info-wrapper__inner">
        <div
            class="info-wrapper__img"
            v-if="validDataImg"
        >
          <img
              :src="url"
              alt=""
          >
        </div>
        <div
            v-else-if="validDataVideo"
            class="info-wrapper__video"
        >
          <video
              controls
              :src="url"
          ></video>
        </div>
        <div class="info-wrapper__audio"
             v-else-if="validDataAudio">
          <audio
              controls
              :src="url"
          ></audio>
        </div>
        <div class="info-wrapper__text"
             v-else-if="validDataElse">
          <svg viewBox="0 0 32 32">
            <path
                d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
            <path d="M23 26h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
            <path d="M23 22h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
            <path d="M23 18h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
          </svg>
        </div>
        <p
            v-if="value"
            class="item__text"
        >{{ value }}</p>
      </div>
    </div>

    <div class="item__inner">
      <Button
          @click="$emit('done',id,url,state.downloadUrl)"
          item-class="item__done button"
          text="Выполнено"
          button-type="button"
      />
      <Button
          item-class="item__remove remove button"
          text="Удалить"
          button-type="button"
          @click="$emit('remove',id,url)"
      />
    </div>
  </div>
</template>

<script>

import Button from "../../UI/Button";
import Select from "../../UI/Select";
import {computed, onMounted, reactive} from "vue";
import Svg from "../../UI/Svg";

export default {
  components: {Svg, Select, Button},
  props: {
    value: String,
    id: Number,
    priority: {
      type: Number,
    },
    typeData: String,
    url: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'file'
    },
    section: String
  },
  setup(props, {emit}) {
    const state = reactive({
      downloadUrl: '',
      options: [
        {id: Math.floor(Math.random() * 1000000), value: 4},
        {id: Math.floor(Math.random() * 1000000), value: 3},
        {id: Math.floor(Math.random() * 1000000), value: 2},
        {id: Math.floor(Math.random() * 1000000), value: 1},
      ]
    })

    const validDataImg = computed(() => {
      return props.url
          && props.typeData === 'image/jpeg'
          || props.typeData === 'image/png'
          || props.typeData === 'image/webp'
    })
    const validDataVideo = computed(() => {
      return props.url
          && props.typeData === 'video/mp4'
    })
    const validDataElse = computed(() => {
      return props.url
          && props.typeData === 'text/plain'
          || props.typeData === 'application/pdf'
    })
    const validDataAudio = computed(() => {
      return props.url
          && props.typeData === 'audio/mpeg'
          || props.typeData === 'audio/ogg'
          || props.typeData === 'audio/webm'
    })

    const rewritePriority = (value) => {
      emit('selectedOption', value, props.id)
    }


    onMounted(() => {
      if (props.url && props.typeData) {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
          const url = URL.createObjectURL(blob)
          state.downloadUrl = url
        };
        xhr.open('GET', props.url);
        xhr.send();
      }
    })

    return {
      state,
      rewritePriority,
      validDataImg,
      validDataVideo,
      validDataAudio,
      validDataElse,
    }
  }
}
</script>
