<template>
  <div class="list">
    <div class="list_header">
      <span>{{ option.title || "" }}</span>
      <span>{{ option.user || ""}}</span>
<!--      <span>{{ option.total? "总环数: " + option.total : '' }}</span>-->
      <span>总环数：{{ option.total || "" }}</span>
      <span class="info" @click="info">详情</span>
    </div>
    <div class="list_body">
      <div class="target">
        <EchatTarget></EchatTarget>
      </div>
      <div>
        <a-table
          :columns="columns"
          bordered
          size="small"
          :pagination="false"
          :dataSource="option.data"
        ></a-table>
      </div>
    </div>
  </div>
</template>

<script>
import EchatTarget from '@views/view/targetmap/modules/EchatTarget.vue'
export default {
  name: 'listEchatCard',
  components: {
    EchatTarget
  },
  props: ['option'],
  data() {
    return {
      columns: [
        {
          title: "No",
          align: 'center',
          className: 'tableHeaders'
        },
        {
          title: "整环",
          width: "80px",
          align: 'center',
          className: 'tableHeaders'
        },
        {
          title: "小数环",
          width: "80px",
          align: 'center',
          className: 'tableHeaders'
        }
      ]
    }
  },
  methods: {
    info() {
      this.$emit("click", this.option)
    }
  }
}
</script>

<style scoped lang="less">
.list{
  margin: 10px 20px;
  box-sizing: border-box;
  display: inline-flex;
  border-radius: 10px;
  box-shadow: 0 0 5px #fff, 0 0 10px #888;
  flex-direction: column;
  overflow: hidden;
  &_header{
    background: #BCCBFC;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 10px;
    .info{
      color: #0f8be3;
      font-weight: 800;
      cursor: pointer;
    }
  }
  &_body{
    padding: 20px;
    display: flex;
    .target{
      width: 200px;
      height: 200px;
      background: transparent;
      margin-right: 20px;
    }
    /deep/.tableHeaders{
      background: #888888 !important;
      color: #fff !important;
    }
    /deep/.ant-table-body{
      margin: 0 !important;
    }
  }

}

</style>