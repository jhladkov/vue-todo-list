<template>
  <div
      class="modal__inner"
      :class="className"
  >
    <video v-if="typeResult === 'video'" :src="url" controls></video>
    <audio v-else-if="typeResult === 'audio'" :src="url" controls></audio>
    <img v-else-if="typeResult === 'image'" :src="url" alt="">
    <svg
        v-else
        :class="typeResult"
        viewBox="0 0 32 32"
    >
      <path d="M28.681 7.159c-0.694-0.947-1.662-2.053-2.724-3.116s-2.169-2.030-3.116-2.724c-1.612-1.182-2.393-1.319-2.841-1.319h-15.5c-1.378 0-2.5 1.121-2.5 2.5v27c0 1.378 1.122 2.5 2.5 2.5h23c1.378 0 2.5-1.122 2.5-2.5v-19.5c0-0.448-0.137-1.23-1.319-2.841zM24.543 5.457c0.959 0.959 1.712 1.825 2.268 2.543h-4.811v-4.811c0.718 0.556 1.584 1.309 2.543 2.268zM28 29.5c0 0.271-0.229 0.5-0.5 0.5h-23c-0.271 0-0.5-0.229-0.5-0.5v-27c0-0.271 0.229-0.5 0.5-0.5 0 0 15.499-0 15.5 0v7c0 0.552 0.448 1 1 1h7v19.5z"></path>
      <path d="M23 26h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
      <path d="M23 22h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
      <path d="M23 18h-14c-0.552 0-1-0.448-1-1s0.448-1 1-1h14c0.552 0 1 0.448 1 1s-0.448 1-1 1z"></path>
    </svg>

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