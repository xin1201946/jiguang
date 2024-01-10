<template>
  <BizModal :widths="'50%'" :title="title" :visible="visible" :footer="false" @cancel="handleCancel" :loading="loadingModal">
    <template>
      <div>
        <a-tabs default-active-key="bi1" @change="callback">
          <a-tab-pane key="bi1" tab="正式比赛">
            <Competition ref="competitionRef" />
          </a-tab-pane>
          <a-tab-pane key="shi1" tab="试射">
            <FireForAdjustment ref="FireForAdjustmentRef" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </template>
  </BizModal>
</template>

<script>
import Card from '@comp/card/card.vue'
import BizModal from '@comp/modal/BizModal.vue'
import Competition from './modules/competition.vue'
import FireForAdjustment from './modules/fireForAdjustment.vue'
export default {
  name: 'tabletMonitoring', //平板监控
  components: {
    Card,
    BizModal,
    Competition,
    FireForAdjustment,
  },
  data() {
    return {
      title:'平板监控',
      visible: false,
      loadingModal: false,
      arr:{},
    }
  },
  mounted() {
  },
  methods: {
    init(row){
      this.visible = true
      console.log(row);
      this.arr = row
      this.$nextTick(()=>{
        this.$refs.competitionRef.init(this.arr)
      })
      // 
    },
    callback(key) {
      if (key === 'bi1') {
        console.log(this.arr);
        this.$refs.competitionRef.init(this.arr)
      }
      if (key === 'shi1') {
        this.$nextTick(()=>{
          this.$refs.FireForAdjustmentRef.init(this.arr)
        })
      }
    },
    handleCancel() {
      this.visible = false
    },
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-drawer-body {
  padding: 0 24px 24px 24px;
}
</style>