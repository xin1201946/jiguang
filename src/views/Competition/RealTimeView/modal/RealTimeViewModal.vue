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
        <a-descriptions-item :span="2" label="选手名称">xxxx</a-descriptions-item>
        <a-descriptions-item :span="2" label="项目名称">xxxx</a-descriptions-item>
        <a-descriptions-item :span="2" label="团体名称">xxxx</a-descriptions-item>
        <a-descriptions-item :span="2" label="阶段名称">xxxx</a-descriptions-item>
        <a-descriptions-item :span="2" label="靶位">xxxx</a-descriptions-item>
        <a-descriptions-item :span="2" label="总成绩">xxxx</a-descriptions-item>
      </a-descriptions>
      <br/>
      <div class="tables">
        <a-descriptions bordered :column="2" title="射击成绩(所有环数)">
          <a-descriptions-item
            v-for="(item, i) in target"
            :key="i"
            :span="1"
            :label="`第${numToCapital(item.group)}发`"
          >1</a-descriptions-item>
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
      target: [
        {
          group: 1
        },
        {
          group: 2
        },
        {
          group: 3
        },
        {
          group: 4
        },
        {
          group: 5
        },
        {
          group: 6
        },
        {
          group: 7
        },
        {
          group: 8
        },
        {
          group: 9
        },
        {
          group: 10
        },
      ]
    }
  },
  methods: {
    numToCapital,
    inits() {
      this.visible = true
    },
    handleOk() {},
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="less">
.tables{
  /deep/.ant-descriptions-item-label.ant-descriptions-item-colon{
    width: 100px;
  }
}
.echar{
  height: 300px;
  width: 300px;
  //width: 500px;
}
</style>