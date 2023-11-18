<template>
  <BizModal
    :title="title"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
    :loading="loadingModal"
  >
    <a-descriptions title="设备信息" :column="4">
      <a-descriptions-item label="平板名称" span="2">
        {{  data.bizTabletPc &&  data.bizTabletPc.tabletPcName}}
      </a-descriptions-item>
      <a-descriptions-item label="平板状态" span="2">
        {{ getLabel(tabletPcStatus, data.bizTabletPc && data.bizTabletPc.tabletPcStatus) }}
      </a-descriptions-item>
      <a-descriptions-item label="设备编号枪" span="2">
        {{ data.bizTabletPc && data.bizTabletPc.deviceNum0 }}
      </a-descriptions-item>
      <a-descriptions-item label="设备编号靶" span="2">
        {{ data.bizTabletPc && data.bizTabletPc.deviceNum1 }}
      </a-descriptions-item>
      <a-descriptions-item label="当前模式" span="2">
        {{ getLabel(tabletPcModels, data.bizTabletPc && data.bizTabletPc.tabletPcModel) }}
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="项目控制信息" :column="4">
      <a-descriptions-item label="项目名称" span="2">{{ data.bizTabletProject && data.bizTabletProject.projectName }}</a-descriptions-item>
      <a-descriptions-item label="组数" span="2">{{ data.bizTabletProject && data.bizTabletProject.groupCount }}</a-descriptions-item>
      <a-descriptions-item label="弹药" span="2">{{ data.bizTabletProject && data.bizTabletProject.ammo }}</a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="设备控制信息" :column="4">
      <a-descriptions-item label="击发控制" span="2">
        {{ getLabel(shootControl, data.bizDeviceControl && data.bizDeviceControl.shootControl) }}
      </a-descriptions-item>
      <a-descriptions-item label="音效控制" span="2">
        {{ getLabel(triggerCollect, data.bizDeviceControl && data.bizDeviceControl.soundControl) }}
      </a-descriptions-item>
      <a-descriptions-item label="报靶控制" span="2">
        {{ getLabel(triggerCollect, data.bizDeviceControl && data.bizDeviceControl.indicateTargetControl) }}
      </a-descriptions-item>
      <a-descriptions-item label="靶机倾角采集控制" span="2">
        {{ getLabel(triggerCollect, data.bizDeviceControl && data.bizDeviceControl.targetCollect) }}
      </a-descriptions-item>
      <a-descriptions-item label="扳机预压采集控制" span="2">
        {{ getLabel(triggerCollect, data.bizDeviceControl && data.bizDeviceControl.triggerCollect) }}
      </a-descriptions-item>
    </a-descriptions>
    <a-descriptions title="显示控制信息" :column="4">
      <a-descriptions-item label="靶点大小" span="2">
        {{ getLabel(targetSize, data.bizDeviceDisplay && data.bizDeviceDisplay.targetSize) }}
      </a-descriptions-item>
      <a-descriptions-item label="靶点显隐" span="2">
        {{ getLabel(autoAmplify, data.bizDeviceDisplay && data.bizDeviceDisplay.targetShow) }}
      </a-descriptions-item>
      <a-descriptions-item label="清靶模式" span="2">
        {{ getLabel(clearTargetWay, data.bizDeviceDisplay && data.bizDeviceDisplay.clearTargetWay) }}
      </a-descriptions-item>
      <a-descriptions-item label="瞄准曲线" span="2">
        {{ getLabel(autoAmplify, data.bizDeviceDisplay && data.bizDeviceDisplay.aimCurveShow) }}
      </a-descriptions-item>
      <a-descriptions-item label="压力曲线" span="2">
        {{ getLabel(autoAmplify, data.bizDeviceDisplay && data.bizDeviceDisplay.stressCurveShow) }}
      </a-descriptions-item>
      <a-descriptions-item label="发序显隐" span="2">
        {{ getLabel(autoAmplify, data.bizDeviceDisplay && data.bizDeviceDisplay.sequenceShow) }}
      </a-descriptions-item>
      <a-descriptions-item label="自动放大" span="2">
        {{ getLabel(autoAmplify, data.bizDeviceDisplay && data.bizDeviceDisplay.autoAmplify) }}
      </a-descriptions-item>
    </a-descriptions>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { getLabel } from '@/utils'


const tabletPcStatus = [
  {
    value: '0',
    label: '未连接'
  },
  {
    value: '1',
    label: '已连接'
  }
]
const tabletPcModels = [
  {
    value: '0',
    label: '试射'
  },
  {
    value: '1',
    label: '比赛'
  }
]
const triggerCollect = [
  {
    value: '0',
    label: '开'
  },
  {
    value: '1',
    label: '关'
  }
]

const shootControl = [
  {
    value: '1',
    label: '正常射击'
  },
  {
    value: '2',
    label: '轨迹扫描'
  }
]

const autoAmplify = [
  {
    value: '0',
    label: '显'
  },
  {
    value: '1',
    label: '隐'
  }
]
const clearTargetWay = [
  {
    value: '1',
    label: '一组一清'
  },
  {
    value: '2',
    label: '手动清靶'
  }
]

const targetSize = [
  {
    value: '0',
    label: '大'
  },
  {
    value: '1',
    label: '小'
  }
]

export default {
  name: 'deviceModal',
  components: {
    BizModal
  },
  data() {
    return {
      loadingModal: false,
      visible: false,
      title: '',
      data: {},
      tabletPcModels,
      triggerCollect,
      shootControl,
      autoAmplify,
      clearTargetWay,
      targetSize,
      tabletPcStatus
    }
  },
  methods: {
    getLabel,
    init(data) {
      this.visible = true
      this.data = data
      console.log(data)
    },
    handleOk() {
      this.handleCancel()
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">

</style>