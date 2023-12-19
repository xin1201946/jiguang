<template>
  <BizModal :title="type == 'edit' ? title : '添加成绩'" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 14 }" :rules="rules" ref="form" :model="formData" v-if="type == 'edit'">
      <a-form-model-item label="组数">
        <a-input v-model="formData.groupCount" disabled></a-input>
      </a-form-model-item>
      <a-form-model-item label="发序">
        <a-input v-model="formData.shootCode" disabled></a-input>
      </a-form-model-item>
      <a-form-model-item label="成绩" prop="score">
        <a-input v-model="formData.score"></a-input>
      </a-form-model-item>
    </a-form-model>
    <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 14 }" :rules="rules" ref="form" :model="formData" v-else>
      <a-form-model-item label="当前组数" prop="group_num">
        <a-input v-model="formData.group_num"></a-input>
      </a-form-model-item>
      <a-form-model-item label="命中序号" prop="shoot_code">
        <a-input v-model="formData.shoot_code"></a-input>
      </a-form-model-item>
      <a-form-model-item label="命中环数" prop="score">
        <a-input v-model="formData.score"></a-input>
      </a-form-model-item>
      <a-form-model-item label="命中区位" prop="direction_point">
        <a-select style="width: 100%" v-model="formData.direction_point">
          <a-select-option value="1">上</a-select-option>
          <a-select-option value="2">下</a-select-option>
          <a-select-option value="3">左</a-select-option>
          <a-select-option value="4">右</a-select-option>
          <a-select-option value="5">右上</a-select-option>
          <a-select-option value="6">右下</a-select-option>
          <a-select-option value="7">左上</a-select-option>
          <a-select-option value="8">左下</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="命中坐标x" prop="x_coord">
        <a-input v-model="formData.x_coord"></a-input>
      </a-form-model-item>
      <a-form-model-item label="命中坐标y" prop="y_coord">
        <a-input v-model="formData.y_coord"></a-input>
      </a-form-model-item>
      <a-form-model-item label="开始时间" prop="begin_time">
        <a-date-picker style="width: 100%" show-time v-model="formData.begin_time" valueFormat="YYYY-MM-DD HH:MM:SS" format="YYYY-MM-DD HH:MM:SS" />
      </a-form-model-item>
      <a-form-model-item label="当前模式" prop="current_mode">
        <a-select style="width: 100%" v-model="formData.current_mode">
          <a-select-option value="0">试射</a-select-option>
          <a-select-option value="1">比赛</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="语音报靶模式" prop="voice_status">
        <a-select style="width: 100%" v-model="formData.voice_status">
          <a-select-option value="0">关</a-select-option>
          <a-select-option value="1">开</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'gameInfoDrawModal',
  components: {
    BizModal,
  },
  data() {
    return {
      title: '修改成绩',
      visible: false,
      loadingModal: false,
      formData: {},
      type: '',
      rules: {
        score: {
          validator: (rule, value, callback) => {
            if (value < 0) {
              callback('分数不得小于0！')
            } else if (value > 10.9) {
              callback('分数不得大于10.9！')
            } else {
              callback()
            }
          },
        },
        group_num: { required: true, message: '请输入当前组数', trigger: ['change', 'blur'] },
        shoot_code: { required: true, message: '请输入命中序号', trigger: ['change', 'blur'] },
        score: { required: true, message: '请输入命中环数', trigger: ['change', 'blur'] },
        direction_point: { required: true, message: '请选择命中区位', trigger: ['change', 'blur'] },
        x_coord: { required: true, message: '请输入命中坐标x', trigger: ['change', 'blur'] },
        y_coord: { required: true, message: '请输入命中坐标y', trigger: ['change', 'blur'] },
        begin_time: { required: true, message: '请选择开始时间', trigger: ['change', 'blur'] },
        current_mode: { required: true, message: '请选择当前模式', trigger: ['change', 'blur'] },
        voice_status: { required: true, message: '请选择语音报靶模式', trigger: ['change', 'blur'] },
      },
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate((data) => {
        if (data) {
          this.$emit('ok', { data: this.formData, type: this.type })
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    init(row, type) {
      console.log(row)
      this.visible = true
      this.type = type
      this.formData = { ...row }
    },
  },
}
</script>

<style scoped lang="less">
</style>