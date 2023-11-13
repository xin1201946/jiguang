<template>
  <a-modal
    :visible="visible"
    :title="title"
    :maskClosable="false"
    :keyboard="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <slot></slot>
  </a-modal>
</template>

<script>
export default {
  name: 'lasergunModal',
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    title: {
      required: true,
      type: String
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleOk() {
      this.$emit("ok")
    },
    handleCancel() {
      this.$emit("cancel")
    }
  }
}
</script>

<style scoped lang="scss">

</style>