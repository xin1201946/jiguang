<template>
  <BizModal :title="title" :visible="visible" @cancel="handleCancel" :loading="loadingModal" :footer="false"
    widths="85%">
    <div class="modal">
      <a-descriptions bordered :columns="4" title="个人信息">
        <a-descriptions-item label="姓名" :span="1">{{ formData.playerName }}</a-descriptions-item>
        <a-descriptions-item label="性别" :span="1">{{ formData.playerSex == '1' ? '男' : '女' }}</a-descriptions-item>
        <a-descriptions-item label="代表队" :span="1">{{ formData.groupName }}</a-descriptions-item>
        <a-descriptions-item label="靶位" :span="1">{{ formData.targetSite }}</a-descriptions-item>
        <a-descriptions-item label="当前组总环数" :span="2">{{ formData.numberOfRings }}</a-descriptions-item>
      </a-descriptions>
      <div class="box">
        <div id="main" class="box_E"></div>
      </div>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import * as echarts from 'echarts'
export default {
  name: 'gameInfoAchievementModal',
  components: {
    BizModal,
  },
  data() {
    return {
      title: '成绩详情',
      visible: false,
      loadingModal: false,
      type: 0,
      formData: {},
      spanArr: [],
      pos: 0,
    }
  },
  methods: {
    detailsList(res) {
      this.visible = true
      this.type = 1
      this.loadingModal = false
      this.formData = res
      this.$nextTick(() => {
        this.handleEcharts()
      })
    },
    handleCancel() {
      this.visible = false
    },
    handleEcharts() {
      var chartDom = document.getElementById('main')
      var myChart = echarts.init(chartDom)
      var option
      option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true
          }
        ]
      }
      option && myChart.setOption(option)
    },
  },
}
</script>

<style scoped lang="less">
.modal {
  height: 100%;
  overflow-y: auto;
  font-size: 12px !important;

  h3 {
    margin-top: 20px;
    font-weight: 800;
  }
}

/deep/.ant-descriptions-item-label,
/deep/.ant-table {
  font-size: 12px !important;
}

.box {
  width: 100%;
  height: 100%;

  .box_E {
    width: 80vw;
    height: 50vh;
  }
}
</style>