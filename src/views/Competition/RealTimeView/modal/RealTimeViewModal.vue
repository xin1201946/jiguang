<template>
  <BizModal
    title="比赛成绩查看"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
    :width="600"
    :footer="false"
  >
    <div style="height: 100%; overflow-y: auto">
      <a-descriptions bordered :column="4">
        <a-descriptions-item :span="2" label="选手名称">{{ formData.playerName }}</a-descriptions-item>
        <a-descriptions-item :span="2" label="项目名称">{{formData.projectName}}</a-descriptions-item>
        <a-descriptions-item :span="2" label="项目组别">{{formData.projectGroup}}</a-descriptions-item>
        <a-descriptions-item :span="2" label="团体名称">{{ formData.groupName }}</a-descriptions-item>
        <a-descriptions-item :span="2" label="阶段名称">{{ formData.stageName }}</a-descriptions-item>
        <a-descriptions-item :span="2" label="阶段组别">{{ formData.stageGroup }}</a-descriptions-item>
        <a-descriptions-item :span="2" label="总成绩">{{
            (formData.integrationMethod === 2 || formData.integrationMethod === '2') ? formData.stageTotal + '_x' + formData.goodTotal : formData.stageTotal
        }}</a-descriptions-item>
        <a-descriptions-item :span="2" label="设备编号">{{ formData.tabletPcNum }}</a-descriptions-item>

      </a-descriptions>
      <br/>
      <div class="tables" v-if="formData.detailScoreList && formData.detailScoreList.length">
        <h3>射击成绩(所有环数)</h3>
        <a-descriptions
          style="margin-bottom: 20px"
          bordered
          :column="2"
          v-for="(item, i) in list"
          :title="`第${numToCapital(i+1)}组`" :key="item"        >
          <template v-for="(key, value) in item">
            <a-descriptions-item
              :key="value"
              :span="1"
              :label="`第${numToCapital(key.shootCode)}发`"
            >{{key.score}}</a-descriptions-item>
          </template>
        </a-descriptions>
      </div>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import BizMixins from '@views/biz/bizMixins'
import EchatTarget from '@views/view/targetmap/modules/EchatTarget.vue'
import { numToCapital } from '@/utils'
export default {
  name: 'RealTimeViewModal',
  components: {
    BizModal,
    EchatTarget
  },
  mixins: [BizMixins],
  data() {
    return {
      title: "比赛成绩查看",
      visible: false,
      type: 0,
      formData: {},
      column: [
        {
          title: '次数',
          align: 'center'
        },
        {
          title: '成绩',
          align: 'center'
        }
      ],
      list: []
    }
  },
  methods: {
    numToCapital,
    inits() {
      this.visible = true
    },
    info(data, record) {
      this.visible = true
      this.formData = data
      if (data.detailScoreList && data.detailScoreList.length) {
        const arr = []
        // 过滤阶段
        const stageGroupArr = data.detailScoreList.filter(item => item.stageGroup === data.stageGroup)
        stageGroupArr.map(item => {
          arr.push(item.groupCount)
          return item
        })
        const list = [...new Set(arr)]
        this.list = list.map((item) => {
          return stageGroupArr.filter(i => i.groupCount === item)
        })
      }
    },
    handleOk() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
.tables{
  /deep/.ant-descriptions-item-label.ant-descriptions-item-colon{
    width: 150px;
  }
}
.echar{
  height: 300px;
  width: 300px;
  //width: 500px;
}
</style>