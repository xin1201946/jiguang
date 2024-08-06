<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal"
    destroyOnClose>
    <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 14 }" :rules="rules" ref="form" :model="formData">
      <div class="notesDiv" v-if="this.stageName === '资格赛'">
        资格赛组数 请输入 1 、2 、3、4、5、6 组数 ! !
      </div>
      <div class="notesDiv" v-if="this.stageName === '决赛'">
        决赛组数 请输入5、10、12、14、16、18、20、22、24等顺序 ! !
      </div>
      <a-form-model-item label="发序组数" prop="groupCount"  v-if="this.stageName !== '金/铜牌赛'">
        <!-- <a-input v-model="formData.groupCount" /> -->
        <a-select style="width: 100%" v-model="formData.groupCount" v-if="this.stageName === '决赛'">
          <a-select-option :value="5">5</a-select-option>
          <a-select-option :value="10">10</a-select-option>
          <a-select-option :value="12">12</a-select-option>
          <a-select-option :value="14">14</a-select-option>
          <a-select-option :value="16">16</a-select-option>
          <a-select-option :value="18">18</a-select-option>
          <a-select-option :value="20">20</a-select-option>
          <a-select-option :value="22">22</a-select-option>
          <a-select-option :value="24">24</a-select-option>
        </a-select>
        <a-input v-model="formData.groupCount" v-else />
      </a-form-model-item>
      <a-form-model-item label="要取消的发序" prop="shootCode">
        <a-input v-model="formData.shootCode" />
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
      title: '设置发序',
      visible: false,
      loadingModal: false,
      formData: {},
      rules: {
        groupCount: {
          required: true,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请选择发序组数！')
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
      },
      row: {},
      selectList: [],
      stageName: undefined,
    }
  },
  methods: {
    init(row, i) {
      this.visible = true
      this.loadingModal = false
      this.stageName = i
      // console.log(row, this.stageName, '232222-');
      this.$nextTick(() => {
        this.formData = { ...row }
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
      this.formData = {}
      console.log(111)
    },
  },
}
</script>

<style scoped lang="less">
.notesDiv {
  color: red;
  font-size: 16px;
  margin-bottom: 20px;
}
</style>