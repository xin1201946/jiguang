<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
    :cancelBool='false'
  >
    <a-form-model
      ref='form'
      :labelCol="{span: 6}"
      :wrapperCol="{span: 16}"
      :model="formData"
      :rules="rules"
    >
      <a-form-model-item label="单位名称" prop="departId">
        <j-select-depart
          modelPlaceholder='请输入单位名称按回车进行搜索'
          title='选择单位'
          placeholder='请点击选择单位'
          v-model="formData.departId"
          :multi="true"
          @back="backDepartInfo"
          :backDepart="true"
          :treeOpera="true"
        ></j-select-depart>
      </a-form-model-item>
      <a-form-model-item label="文件上传" prop="file" class='uploads'>
        <a-upload
          name="file"
          :data="(file) => ({departId: formData.departId})"
          accept=".xlsx, xls"
          :showUploadList="false"
          :multiple="false"
          :headers="tokenHeader"
          :action="importExcelUrl"
          @change="handleImportExcel"
          listType='picture-card'
          :beforeUpload="beforeUpload"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>
          <p class="ant-upload-text">点击或拖拽上传</p>
        </a-upload>
        <p>仅允许导入xls、xlsx格式文件。<a-button type='link' @click='handleDownload'>下载模板</a-button></p>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import Vue from 'vue'
import { ACCESS_TOKEN, TENANT_ID } from '@/store/mutation-types'
import { bizDevicePcGetImportTemplate } from '@api/biz'

export default {
  name: 'SlabImportModal',
  components: {
    BizModal
  },
  data() {
    return {
      title: "",
      visible: false,
      api: 'bizDevicePc/importExcel',
      formData: {
        departId: "",
        file: ""
      },
      loadingModal: false,
      rules: {
        departId: [
          { required: true, message: '请选择单位名称', trigger: 'blur' }
        ],

      }
    }
  },
  computed: {
    //token header
    tokenHeader() {
      let head = { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) }
      let tenantid = Vue.ls.get(TENANT_ID)
      if (tenantid) {
        head['tenant-id'] = tenantid
      }
      return head
    },
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.api}`
    }
  },
  methods: {
    backDepartInfo(info) {
      if (info.length) {
        // this.formData.departId = info[0].value
        // this.formData.departName = info[0].text
        this.formData.departId = info.map(item => item.value).join(',')
        this.$refs.form.clearValidate()
        // this.formData.departName = info.map(item => item.text).join(',')
      }
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(v => {
          if (v) {
            resolve()
          }
          else {
            reject()
          }
        })
      })
    },
    handleImportExcel(info) {
      const { file } = info
      if (file.status === "done") {
        const { response } = file
        if (response.code === 200) {
          if (this.loading !== undefined) {
            this.loading = false
          }
          this.$message.success(response.message + "。请点击确定按钮即可刷新列表。")
        }
        else if (response.code === 201) {
          let { message, result: { msg, fileUrl, fileName } } = response
          let href = window._CONFIG['domianURL'] + fileUrl
          this.$warning({
            title: message,
            content: (<div>
                <span>{msg}</span><br />
                <span>具体详情请 <a href={href} target="_blank" download={fileName}>点击下载</a> </span>
              </div>
            ),
          })
        }
        else {
          this.$message.error(response.message)
        }
      }
    },
    handleOk() {
      this.visible = false
      this.$emit("list")
    },
    handleCancel() {
      this.visible = false
      this.$emit("list")
    },
    handleDownload () {
      bizDevicePcGetImportTemplate().then(res => {
        const url = window.URL.createObjectURL(res)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', "平板导入模板.xlsx")
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      })
    },
    show() {
      this.visible = true
      this.formData.departId = ""
      this.formData.file = ""
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    }
  }
}
</script>

<style scoped lang='less'>
/deep/.ant-upload.ant-upload-select-picture-card{
  width: 100% !important;
}
/deep/.uploads{
  .ant-form-item-children{
    line-height: 0 !important;
    height: auto;
    display: inline-block;
  }
}
</style>