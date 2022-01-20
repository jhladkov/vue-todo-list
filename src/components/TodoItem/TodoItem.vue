<template>
  <div class="panel__item item">
    <p class="item__text">{{value}}</p>
    <div class="item__inner">
      <Button item-class="item__done button" text="Выполнено" button-type="button"/>
      <Button
          item-class="item__remove remove button"
          text="Удалить"
          button-type="button"
          @click="$emit('remove',id)"
      />
    </div>
  </div>
</template>

<script>

export default {
  props: {
    value: String,
    id: Number
  }
}
</script>
