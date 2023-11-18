<template>
  <a-drawer
    :visible="visible"
    :title="title"
    :maskClosable="true"
    :keyboard="false"
    @close="handleCancel"
    :width="width"
  >
    <div class="body">
      <slot></slot>
    </div>
    <div style="display: flex; justify-content: flex-end;margin-top: 20px">
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button :loading="loading" type="primary" @click="handleOk">确定</a-button>
      </a-space>
    </div>
<!--    <template slot="footer">
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button :loading="loading" type="primary" @click="handleOk">确定</a-button>
      </a-space>
    </template>-->
  </a-drawer>
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

<style scoped lang="less">
.body{
  height: calc(100% - 60px);
}
/deep/.ant-drawer-body{
  height: calc(100% - 55px);
}
</style>