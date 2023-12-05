<template>
  <BizModal
    :title="title"
    :visible="visible"
    :loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >

    <div class="modes">
      <a-form-model
        :labelCol="{span: 6}"
        :wrapperCol="{span: 14}"
        :rules="rules"
        ref="form"
        :model="formData"
      >
        <a-form-model-item label="阶段名称" prop="stageName">
<!--          <a-input v-model="formData.stageName"></a-input>-->
          <a-select v-model="formData.stageName">
            <a-select-option v-for="(item,i) in stageName" :key="i" :value="item.value">{{item.label}}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="阶段顺序" prop="stageOrder">
          <a-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model="formData.stageOrder"/>
        </a-form-model-item>
        <a-form-model-item
          label="是否团体排名"
          :labelCol="{span: 6}"
          :wrapperCol="{span: 14, offset: 1}"
          prop="isGroupRank">
          <a-radio-group v-model="formData.isGroupRank">
            <a-radio
              v-for="item in isGroupRank"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <template v-if="formData.isGroupRank !== '0'">
          <a-form-model-item label="参团选手" prop="playerGroup">
            <a-select v-model="formData.playerGroup">
              <a-select-option
                v-for="item in playerGroup"
                :key="item.value"
                :value="item.value"
              >{{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="参团人数" prop="playerNum">
            <a-input
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="formData.playerNum"
            ></a-input>
          </a-form-model-item>
        </template>
        <a-form-model-item label="积分方式" prop="integrationMethod">
          <a-select v-model="formData.integrationMethod">
            <a-select-option
              v-for="item in integrationMethod"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <!--      中数-->
        <template v-if="formData.integrationMethod === '3'">
          <a-form-model-item label="环数区间" required>
            <a-row :gutter="24">
              <a-col :span=12>
                <a-form-model-item
                  :labelCol="{span: 0}"
                  prop="ringHigh"
                  :rules=" { required: formData.integrationMethod === '3', message: '请输入高数环数', trigger: 'blur' }"
                >
                  <a-input
                    oninput="value=value.replace(/[^\d]/g,'')"
                    v-model="formData.ringHigh"
                  ></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span=12>
                <a-form-model-item
                  prop="ringHigh"
                  :labelCol="{span: 0}"
                  :rules=" { required: formData.integrationMethod === '3', message: '请输入低数环数', trigger: 'blur' }"
                >
                  <a-input
                    oninput="value=value.replace(/[^\d]/g,'')"
                    v-model="formData.ringLow"
                  ></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model-item>
        </template>
        <!--      目标积分-->
        <template v-if="formData.integrationMethod === '4'">
          <a-form-model-item
            label="目标分"
            prop="targetScore"
            :rules=" { required: formData.integrationMethod === '4', message: '请输入目标分', trigger: 'blur' }"
          >
            <a-input
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="formData.targetScore"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="胜者得分"
            prop="winSocre"
            :rules=" { required: formData.integrationMethod === '4', message: '请输入胜者得分', trigger: 'blur' }"
          >
            <a-input
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="formData.winSocre"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="平局得分"
            prop="drawScore"
            :rules=" { required: formData.integrationMethod === '4', message: '请输入平局得分', trigger: 'blur' }"
          >
            <a-input
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="formData.drawScore"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            label="败者得分"
            prop="loserScore"
            :rules=" { required: formData.integrationMethod === '4', message: '请输入败者得分', trigger: 'blur' }"
          >
            <a-input
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="formData.loserScore"
            ></a-input>
          </a-form-model-item>
        </template>
        <a-form-model-item
          :labelCol="{span: 6}"
          :wrapperCol="{span: 14, offset: 1}"
          label="计分模式"
          prop="scoreModel"
        >
          <a-radio-group v-model="formData.scoreModel">
            <a-radio
              v-for="item in scoreModel"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <template v-if="formData.scoreModel !== '1' && formData.integrationMethod !== '4'">
          <a-form-model-item label="默认组数" prop="groupCount">
            <a-input
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="formData.groupCount"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="每组枪数">
            <a-input
              disabled
              :readonly="true"
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="formData.gunsPerGroup"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="射击时长" prop="shootPeriod">
            <a-input
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="formData.shootPeriod"
              addon-after="分"
            />
          </a-form-model-item>
        </template>
        <a-form-model-item label="是否试射" prop="isAdjustment">
          <a-select v-model="formData.isAdjustment">
            <a-select-option
              v-for="item in isAdjustment"
              :key="item.value"
              :value="item.value"
            >{{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="晋级名次" prop="riseNum">
          <a-input
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model="formData.riseNum"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { bizContestProjectStageSave, bizContestProjectStageUpdate } from '@api/competition'
import {
  integrationMethod,
  isAdjustment,
  isGroupRank,
  playerGroup,
  scoreModel,
  rules
} from '@views/Competition/projectPhase/projectPhase.config'
const stageName = [
  {
    label: '资格赛',
    value: '资格赛'
  },
  {
    label: '淘汰赛',
    value: '淘汰赛'
  },

  {
    label: '金/铜牌赛',
    value: '金/铜牌赛'
  }
]
export default {
  name: 'projectPhaseStageTableModal',
  components: {
    BizModal
  },
  data() {
    return {
      stageName,
      integrationMethod,
      isAdjustment,
      isGroupRank,
      playerGroup,
      scoreModel,
      rules,
      title: "",
      visible: false,
      loading: false,
      type: 0,
      cproId: "",
      formData: {
        stageName: "",
        stageOrder: "",
        isGroupRank: "",
        playerGroup: "",
        playerNum: "",
        integrationMethod: "",
        scoreModel: "",
        groupCount: '',
        gunsPerGroup: '10',
        shootPeriod: '',
        isAdjustment: '',
        riseNum: '',
        cproStageId: "",
        targetScore: "",
        winSocre: '',
        drawScore: '',
        loserScore: "",
        ringHigh: "",
        ringLow: ""
      }
    }
  },
  methods: {
    okData() {
      const data = JSON.parse(JSON.stringify(this.formData))
      if (this.type === 0) {
        delete data.cproStageId
      }
      return data
    },
    quit(res) {
      if (res.code === 200) {
        this.$message.success(res.message)
        this.$emit("list")
        this.visible = false
      }else {
        this.$message.error(res.message)
        this.loading = false
      }
    },
    handleOk() {
      this.$refs.form.validate(v => {
        if (v) {
          this.loading = true
          const data = {
            ...this.okData(),
            cproId: this.cproId,
            contestId: this.$route.query.id
          }
          if (this.type === 0) {
            bizContestProjectStageSave(data).then(this.quit)
          }
          if (this.type === 1) {
            bizContestProjectStageUpdate(data).then(this.quit)
          }
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    init(id) {
      this.cproId = id
      this.type = 0
      this.loading = false
      this.title = "添加比赛阶段"
      this.visible = true
      this.$nextTick(() => {
        for (const key in this.formData) {
          if (key !== 'gunsPerGroup')
            this.formData[key] = ''
        }
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    edit(row, id) {
      this.cproId = id
      this.type = 1
      this.title = "编辑比赛阶段"
      this.loading = false
      this.visible = true
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = row[key]
        }
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.modes{
  height: 100%;
  overflow-y: auto;
}
</style>