<template>
  <a-modal
    :visible="visible"
    :title="title"
    :maskClosable="false"
    :keyboard="false"
    @cancel="handleCancel"
    :width="width"
  >
    <slot></slot>
    <template slot="footer">
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button :loading="loading" type="primary" @click="handleOk">确定</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'bizModal',
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    title: {
      required: true,
      type: String
    },
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 520
    }
  },
  data() {
    return {
    }
  },
  mounted() {
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