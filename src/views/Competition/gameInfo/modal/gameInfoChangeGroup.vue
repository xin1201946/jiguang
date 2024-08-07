<template>
  <BizModal :title="title" :visible="visible" @ok="handleOk" @cancel="handleCancel" :loading="loadingModal">
    <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 14 }" :rules="rules" ref="form" :model="formData">
      <a-form-model-item label="原靶位" prop="targetSite">
        <a-input v-model="formData.targetSite" disabled />
      </a-form-model-item>
      <a-form-model-item label="替换代表队" prop="teamGoldScoreId" v-if="stageName === '金/铜牌赛'">
        <a-select style="width: 320px" v-model="formData.teamGoldScoreId" placeholder="请选择替换代表队" @change="selectChange">
          <a-select-option v-for="item in selectList1" :key="item.groupName" :value="item.teamGoldScoreId">
            {{ item.groupName+'-'+item.player1Name+'-'+item.player2Name}}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <div v-else>
        <a-form-model-item label="新分组" prop="stageGroupNew">
        <a-input v-model="formData.stageGroupNew" @change="handleOnChange" placeholder="请输入新分组" />
      </a-form-model-item>
      <a-form-model-item label="新靶位" prop="targetSiteNew">
        <a-select style="width: 100%" v-model="formData.targetSiteNew" placeholder="请选择靶位" @change="selectChange">
          <a-select-option v-for="item in selectList" :key="item.cproDeviceId" :value="item.targetSite">
            {{ item.targetSite }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      </div>
    </a-form-model>
  </BizModal>
</template>

<script>
import { selectTargetList,changeGroupList } from '@/api/competition'
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'gameInfoChangeGroup',
  components: {
    BizModal,
  },
  data() {
    return {
      title: '变更组别',
      visible: false,
      loadingModal: false,
      formData: {},
      stageName: '',
      rules: {
        // targetSiteNew: {
        //   required: true,
        //   validator: (rule, value, callback) => {
        //     if (value) {
        //       callback()
        //     } else {
        //       callback('请选择靶位')
        //     }
        //   },
        // },
        stageGroupNew: {
          required: true,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请填写新分组')
            }
          },
        },
        teamGoldScoreId: {
          required: true,
          validator: (rule, value, callback) => {
            if (value) {
              callback()
            } else {
              callback('请选择替换代表队')
            }
          },
        },
      },
      row: {},
      selectList: [],
      selectList1: [],
    }
  },
  methods: {
    init(row,i) {
      this.visible = true
      this.loadingModal = false
      this.$nextTick(() => {
        this.formData = row
        this.formData.teamGoldScoreId = undefined
        this.stageName = i
      })
      const data = {
        contestId: row.contestId,
        cproId: row.cproId,
        stageGroup: row.stageGroup,
        stageId: row.stageId,
        playerId:row.playerId
      }
      changeGroupList(data).then((res) => {
        this.selectList1 = res.result
      })
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('ok', { ...this.formData })
        }
      })

    },
    handleCancel() {
      this.visible = false
      this.$refs.form.clearValidate()
    },
    // 分组填写
    handleOnChange(e) {
      this.formData.targetSiteNew = undefined
      const data = {
        contestId: this.formData.contestId,
        cproId: this.formData.cproId,
        stageGroup: e.data,
        stageId: this.formData.stageId,
      }
      selectTargetList(data).then((res) => {
        this.selectList = res.result
      })
    },
    // 选择靶位
    selectChange(i){
      this.formData.targetSiteNew = i
      this.$forceUpdate();
    },
  },
}
</script>

<style scoped lang="less"></style>