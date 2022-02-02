<template>

  <div class="panel__item item" draggable="true">
    <div class="item__info info-wrapper">
      <div class="info-wrapper__inner">
        <div class="info-wrapper__img"
             v-if="url && typeData === 'image/jpeg' || typeData === 'image/png' || typeData === 'image/webp'">
          <img :src="url" alt="">
          <div class="info-wrapper__panel panel">
            <Link :url="url" target="_blank" content="Открыть в новом окне"/>
            <Link :url=url download content="Скачать"/>
          </div>
        </div>
        <div v-else-if="url && typeData === 'video/mp4'" class="info-wrapper__video">
          <video controls :src="url"></video>
        </div>
        <div class="info-wrapper__audio" v-else-if="url && typeData === 'audio/mpeg' || typeData === 'audio/ogg' || typeData === 'audio/webm'">
          <audio controls :src="url"></audio>
        </div>
        <p class="item__text">{{ value }}</p>
      </div>
      <Select
          @selectedOption="rewritePriority"
          v-if="priority"
          :default-selected-value="priority"
          text="Приоритет: "
          :options="state.options"
          class-name="item__priority-select"
          type-open="bottom"/>
    </div>

    <div class="item__inner">
      <Button @click="$emit('done',id,url)" item-class="item__done button" text="Выполнено" button-type="button"/>
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
import {reactive} from "vue";

export default {
  components: {Select, Button},
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
    }
  },
  setup(props, {emit}) {
    const state = reactive({
      options: [
        {id: Math.floor(Math.random() * 1000000), value: 4},
        {id: Math.floor(Math.random() * 1000000), value: 3},
        {id: Math.floor(Math.random() * 1000000), value: 2},
        {id: Math.floor(Math.random() * 1000000), value: 1},
      ]
    })

    const rewritePriority = (value) => {
      emit('selectedOption', value, props.id)
    }

    return {
      state, rewritePriority
    }
  }
}
</script>
