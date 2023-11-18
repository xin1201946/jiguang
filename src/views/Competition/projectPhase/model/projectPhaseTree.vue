<template>
  <div class="projectPhaseTree">
    <div class="btns" v-if="check === '0'">
      <a-space>
        <a-button type="primary" @click="handleAdd">保存</a-button>
      </a-space>
    </div>
    <div :class="check === '0'? 'trees' : 'treea'">
      <a-form-model
        ref="form"
        :labelCol="{span: 6}"
        :wrapperCol="{span: 18}"
        :rules="rules"
        :model="data"
      >
        <a-form-model-item label="赛事名称" prop="contestName">
          <a-input
            :disabled="check === '1'"
            style="width: 100%"
            v-model="data.contestName"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item label="主办方" prop="sponsor">
          <a-input
            :disabled="check === '1'"
            style="width: 100%" v-model="data.sponsor"></a-input>
        </a-form-model-item>
        <a-form-model-item label="赛事类型" prop="contestType">
          <a-input
            :disabled="check === '1'"
            style="width: 100%" v-model="data.contestType"></a-input>
        </a-form-model-item>
        <a-form-model-item label="选手类型" prop="playerType">
          <a-select
            :disabled="check === '1'"
            v-model="data.playerType"
          >
            <a-select-option
              v-for="item in playerType"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="报名时间" prop="registTime">
          <a-range-picker
            style="width: 100%"
            :disabled="check === '1'"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            :showTime="true"
            v-model="data.registTime"
          ></a-range-picker>
        </a-form-model-item>
        <a-form-model-item label="比赛时间" prop="contestTime">
          <a-range-picker
            :disabled="check === '1'"
            v-model="data.contestTime"
            style="width: 100%"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            :disabledDate="disabledDate"
            :showTime="true"
          ></a-range-picker>
        </a-form-model-item>
        <a-form-model-item
          label="比赛地点"
          prop="location"
          :wrapperCol="{span: 24}"
        >
          <a-input
            :disabled="check === '1'"
            v-model="data.location"
            type="textarea"
            :maxLength="100"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="赛事简介"
          prop="briefIntro"
          :wrapperCol="{span: 24}"
        >
<!--          <VueEditor v-model="data.briefIntro"></VueEditor>-->
          <a-input
            :disabled="check === '1'"
            v-model="data.briefIntro"
            type="textarea"
            :maxLength="500"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="赛事详情"
          prop="content"
          :wrapperCol="{span: 24}"
        >
          <VueEditor
            :disabled="check === '1'"
            v-model="data.content"
          />
        </a-form-model-item>
      </a-form-model>
    </div>

  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { playerType } from '@views/Competition/competitionList/competitionList.config'
import { bizContestUpdate } from '@api/competition'
import dayjs from 'dayjs'
export default {
  name: 'projectPhaseTree',
  props: ["data"],
  components: {
    VueEditor
  },
  data() {
    return {
      playerType,
      rules: {
        contestName: [
          { required: true, message: '请输入赛事名称', trigger: 'blur' }
        ],
        sponsor: [
          { required: true, message: '请输入主办方', trigger: 'blur' }
        ],
        contestType: [
          { required: true, message: '请输入赛事类型', trigger: 'blur' }
        ],
        playerType: [
          { required: true, message: '请选择选手类型', trigger: 'blur' }
        ],
        registTime: [
          { required: true, message: '请选择报名时间', trigger: 'blur' }
        ],
        contestTime: [
          { required: true, message: '请选择比赛时间', trigger: 'blur' },
        ],
        location: [
          { required: true, message: '请输入比赛地点', trigger: 'blur' }
        ],
        briefIntro: [
          { required: true, message: '请输入赛事简介', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入赛事详情', trigger: 'blur' }
        ],
      },
      check: ''
    }
  },
  watch: {
    $route: {
      handler() {
        this.check = this.$route.query.check
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
  },
  inject: ["closeCurrent"],
  methods: {
    handleAdd() {
      const data = JSON.parse(JSON.stringify(this.data))
      data.contestTimeStart = data.contestTime[0]
      data.contestTimeEnd = data.contestTime[1]
      data.registTimeStart = data.registTime[0]
      data.registTimeEnd = data.registTime[1]
      delete data.contestTime
      delete data.registTime
      this.$refs.form.validate(v => {
        if (v) {
          bizContestUpdate(data).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
            }else {
              this.$message.warning(res.message)
            }
          })
        }
      })
    },
    disabledDate(current) {
      return current && (
        dayjs(current).format("YYYY-MM-DD HH:mm:ss") < dayjs(this.data.registTime[1]).add(1,"day").format("YYYY-MM-DD HH:mm:ss")
      )
    }
  }
}
</script>


<style scoped lang="less">
@height: 40px;

.projectPhaseTree{
  height: 100%;
  overflow-y: hidden;
}
.btns{
  height: @height;
  display: flex;
  margin: 10px 0;
}
.treea{
  height: 100%;
  overflow-y: auto;
  padding-right: 20px;
  /deep/.ant-input.ant-input-disabled,
  /deep/.ant-select.ant-select-disabled{
    color: #333;
    cursor: not-allowed;
  }
  /deep/.ql-container.ql-snow.ql-disabled{
    cursor: not-allowed;
  }
}
.trees{
  height: calc(100% - 20px - @height);
  overflow-y: auto;
  padding-right: 20px;
  /deep/.ant-input.ant-input-disabled,
  /deep/.ant-select.ant-select-disabled{
    color: #333;
    cursor: not-allowed;
  }
  /deep/.ql-container.ql-snow.ql-disabled{
    cursor: not-allowed;
  }
}
</style>