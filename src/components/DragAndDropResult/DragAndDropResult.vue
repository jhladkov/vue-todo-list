<template>
  <div
      class="modal__inner"
      :class="className"
  >
    <video v-if="typeResult === 'video'" :src="url" controls></video>
    <audio v-if="typeResult === 'audio'" :src="url" controls></audio>
    <img v-if="typeResult === 'image'" :src="url" alt="">

    <div class="img-wrapper__inner">
      <Input @getFile="change" input-class="button" placeholder="Изменить" input-type="file"/>
      <Button @click="remove" button-type="button" text="Удалить"
              item-class="img-wrapper__inner__button button remove"/>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    typeResult: {
      type: String,
      required: true,
    },
    url: String,
    className: String
  },
  setup(props,{emit}) {

    const change = (event, wasActiveInput) => {
      console.log(event,wasActiveInput)
      emit('dropData',event, wasActiveInput)
    }
    const remove = () => {
      emit('deleteData')
    }

    return{
      change,remove
    }
  }
}
</script>