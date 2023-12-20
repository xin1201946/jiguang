<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <a-form-model :labelCol="{span: 6}" :wrapperCol="{span: 14}" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="原靶位" prop="targetSite">
        <a-input v-model="formData.targetSite" disabled />
      </a-form-model-item>
      <a-form-model-item label="新靶位" prop="targetSiteNew">
        <a-select style="width: 100%" v-model="formData.targetSiteNew">
          <a-select-option v-for="item in selectList" :key="item.cproDeviceId" :value="item.targetSite">
            {{item.targetSite}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="备注">
        <a-input v-model="formData.remark" />
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import { selectTargetList } from '@/api/competition'
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'gameInfoTargetModal',
  components: {
    BizModal,
  },
  data() {
    return {
      title: '更换靶位',
      visible: false,
      loadingModal: false,
      formData: {},
      rules: {
        targetSiteNew: {
          required: true,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请选择靶位！')
            }
          },
        },
        shootCode: {
          required: true,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请填写发序！')
            }
          },
        },
        score: {
          required: true,
          validator: (rule, value, callback) => {
            if (!value) {
              callback('请填写分数！')
            } else if (value < 0) {
              callback('分数不得小于0！')
            }
            if (value > 10.9) {
              callback('分数不得大于10.9！')
            } else {
              callback()
            }
          },
        },
        remarkPenalty: {
          required: true,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请填写备注！')
            }
          },
        },
      },
      row: {},
      selectList: [],
    }
  },
  methods: {
    init(row) {
      this.visible = true
      this.loadingModal = false
      this.$nextTick(() => {
        this.formData = row
        const data = {
          contestId: row.contestId,
          cproId: row.cproId,
          stageGroup: row.stageGroup,
          stageId: row.stageId,
        }
        selectTargetList(data).then((res) => {
          this.selectList = res.result
          console.log(res)
        })
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    handleOk() {
      this.$emit('confirm', { ...this.formData })
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>

<style scoped lang="less">
</style>