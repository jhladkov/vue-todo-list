<template>

    <div class="panel__item item">
      <div class="item__info info-wrapper">
        <div class="info-wrapper__img" v-if="url && typeData === 'image/jpeg' || typeData === 'image/png' || typeData === 'image/webp'">
          <img :src="url" alt="">
        </div>
        <div v-else-if="url && typeData === 'video/mp4'" class="info-wrapper__video">
          <video controls :src="url"></video>
        </div>
        <div class="info-wrapper__audio" v-else-if="url && typeData === 'audio/mpeg' || typeData === 'audio/ogg'">
          <audio controls :src="url"></audio>
        </div>
        <p class="item__text">{{ value }}</p>
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

export default {
  props: {
    value: String,
    id: Number,
    typeData: String,
    url: {
      type:String,
      default: ''
    }
  }
}
</script>
