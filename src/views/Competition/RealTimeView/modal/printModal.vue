<template>
  <BizModal
    :visible="visible"
    title="比赛成绩查看"
    :footer="false"
    :width="600"
    @cancel="handleCancel"
  >
    <div style="height: 100%; overflow-y: auto">
      <a-descriptions bordered :column="4">
        <a-descriptions-item :span="2" label="选手名称">{{ formData.playerName }}</a-descriptions-item>
        <a-descriptions-item :span="2" label="团体名称">{{formData.groupName}}</a-descriptions-item>
        <a-descriptions-item :span="2" label="项目名称">{{formData.projectName}}</a-descriptions-item>
        <a-descriptions-item :span="2" label="项目组别">{{formData.projectGroup}}</a-descriptions-item>
      </a-descriptions>
      <div v-for="item in list">
        <h3></h3>
        <a-table></a-table>
      </div>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
export default {
  name: 'printModal',
  components: {
    BizModal
  },
  data() {
    return {
      title: "比赛成绩查看",
      visible: false,
      type: 0,
      formData: {},
      list: []
    }
  },
  methods: {
    init(data) {
      console.log(data)
      this.formData = data[0]
      this.visible = true
      this.list = data
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>


<style scoped lang="scss">

</style>