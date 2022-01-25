<template>

    <div class="panel__item item">
      <div class="item__info info-wrapper">
        <div class="info-wrapper__img" v-if="imgUrl">
          <img :src="imgUrl" alt="">
        </div>
        <p class="item__text">{{ value }}</p>
      </div>

      <div class="item__inner">
        <Button @click="$emit('done',id,imgUrl)" item-class="item__done button" text="Выполнено" button-type="button"/>
        <Button
            item-class="item__remove remove button"
            text="Удалить"
            button-type="button"
            @click="$emit('remove',id,imgUrl)"
        />
      </div>
    </div>
</template>

<script>

export default {
  props: {
    value: String,
    id: Number,
    imgUrl: {
      type:String,
      default: ''
    }
  }
}
</script>
