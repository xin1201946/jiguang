<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top: 5%; height: 85%; overflow-y: hidden"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="validatorRules">
        <a-form-model-item label="版本号" required prop="version">
          <a-input v-model="model.version" :disabled="roleDisabled" placeholder="请输入版本号" />
        </a-form-model-item>
        <a-form-model-item label="更新内容" required prop="info">
          <!-- <a-input v-model="model.info" placeholder="请输入更新内容" /> -->
          <a-textarea placeholder="请输入更新内容" :rows="4" v-model="model.info" />
        </a-form-model-item>
        <a-form-model-item label="上传文件" prop="file">
          <a-upload
            :file-list="fileList"
            :maxCount="1"
            action="#"
            :customRequest="handleChildChange"
            :remove="handleRemove"
          >
            <a-button> <a-icon type="upload" /> 上传apk文件 </a-button>
          </a-upload>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
  
  <script>
import { bizUploadApk } from '@/api/biz'
export default {
  name: 'TableModal',
  data() {
    return {
      staticAction: window._CONFIG['domianURL'] + '/sys/common/static/temp/',
      title: '操作',
      visible: false,
      roleDisabled: false,
      model: {
        file: null,
      },
      fileList: [],
      layout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 14 },
      },
      confirmLoading: false,
      validatorRules: {
        version: [
          { required: true, message: '请输入版本号!' },
          { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
        ],
        info: [{ required: true, message: '请输入更新内容!' }],
        file: [{ required: true, message: '请上传apk文件!' }],
      },
    }
  },
  created() {
    //备份model原始值

    this.modelDefault = JSON.parse(JSON.stringify(this.model))
  },
  methods: {
    add() {
      this.model = {}
      this.edit(this.modelDefault)
    },
    edit(record) {
      this.model = Object.assign({}, record)
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      const data = new FormData()
      data.append('version', this.model.version)
      data.append('info', this.model.info)
      data.append('file', this.model.file)

      // 触发表单验证
      this.$refs.form.validate((valid) => {
        if (valid) {
          that.confirmLoading = true
          let obj = bizUploadApk(data)

          obj
            .then((res) => {
              console.log(res)
              if (res.success) {
                that.$message.success('添加成功！')
                that.$emit('ok')

                this.fileList = []
                this.model.file = null
              } else {
                that.$message.warning(res.message)

                this.fileList = []
                this.model.file = null
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.close()
      this.fileList = []
      this.model.file = null
    },
    handleChildChange(info) {
      // 定义处理函数来接收数据
      let latestFile = info.file // 直接取最新的文件，因为:maxCount="1"已限制只上传一个文件

      // 如果文件上传成功并返回了URL，设置file.url
      if (latestFile.status === 'done' && latestFile.response) {
        latestFile.url = latestFile.response.url
      }
      // 更新fileList需要维护一个数组，尽管只显示最新的
      this.fileList = [latestFile] // 仅保留最新的一个文件
      // 将最新的文件赋值给model.file
      this.model.file = latestFile
    },
    handleRemove() {
      this.fileList = []
      this.model.file = null
    },
  },
}
</script>
  
  <style scoped>
</style>