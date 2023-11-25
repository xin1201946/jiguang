<template>
  <BizModal
    title="比赛成绩查看"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
    :width="600"
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
            (record.integrationMethod === 2 || record.integrationMethod === '2') ? formData.stageTotal + '_x' + formData.goodTotal : formData.stageTotal
        }}</a-descriptions-item>
        <a-descriptions-item :span="2" label="设备编号">{{ formData.tabletPcNum }}</a-descriptions-item>

      </a-descriptions>
      <br/>
      <div class="tables" v-if="formData.detailScoreList && formData.detailScoreList.length">
<!--        <a-descriptions bordered :column="2" title="射击成绩(所有环数)">
          <template v-for="(item, i) in formData.detailScoreList">
            <a-descriptions-item
              :key="i"
              :span="1"
              :label="`第${numToCapital((i + 1))}发`"
            >{{item.shootCode}}</a-descriptions-item>
          </template>
        </a-descriptions>
        <br>-->
        <a-descriptions bordered :column="2" title="射击成绩(所有环数)">
          <template v-for="(item, i) in formData.detailScoreList">
            <a-descriptions-item
              :key="i"
              :span="1"
              :label="`第${numToCapital(item.shootCode)}发`"
            >{{item.score}}</a-descriptions-item>
          </template>
        </a-descriptions>
      </div>
<!--      <div>
        <h3>射击成绩</h3>
        <br/>
        <div style="display: flex">
          <div class="echar">
            <EchatTarget></EchatTarget>
          </div>
          <div style="flex: 1;margin-left: 20px">
            <a-table
              :columns="column"
              bordered
              size="small"
            ></a-table>
          </div>
        </div>
      </div>-->
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