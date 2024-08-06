<template>
  <BizModal
    :title="title"
    :visible="visible"
    :okBool="false"
    :cancelBool="false"
    @cancel="handleCancel"
    :loading="loadingModal"
    :width="700"
    destroyOnClose
  >
    <a-button style="margin-left: 85%;margin-bottom: 10px;" type="primary" size="default" icon="sync" @click="handleSearch()">刷新</a-button>
    <a-table   rowKey="shootCode" :columns="columns" :data-source="list" :pagination="false" size="small">
</a-table>
  </BizModal>
</template>
  
  <script>
import BizModal from '@comp/modal/BizModal.vue'
import {
  getDetailList, //获取混团积分监控数据
} from '@api/competition'
export default {
  name: 'gameInfoMixedGroup',
  components: {
    BizModal,
  },
  data() {
    return {
      title: '混团积分监控',
      visible: false,
      loadingModal: false,
      data: {},
      list: [],
      columns: [
        {
          dataIndex: 'shootCode',
          title: '发序',
          align: 'center',
        },
        {
          title:'代表队1',
          align: 'center',
          customRender: (text, record, index) => {
            if (record.detailList && record.detailList.length > 0) {
              return record.detailList[0].totalScore || ''
            }
            return ''
          },
        },
        // {
        //   title: '总分1',
        //   align: 'center',
        //   customRender: (text, record, index) => {
        //     if (record.detailList && record.detailList.length > 0) {
        //       return record.detailList[0].totalScore || ''
        //     }
        //     return ''
        //   },
        // },
        {
          title: "代表队2",
          align: 'center',
          customRender: (text, record, index) => {
            if (record.detailList && record.detailList.length > 0) {
              return record.detailList[1].totalScore || ''
            }
            return ''
          },
        },
        // {
        //   title: '总分2',
        //   align: 'center',
        //   customRender: (text, record, index) => {
        //     if (record.detailList && record.detailList.length > 0) {
        //       return record.detailList[1].totalScore || ''
        //     }
        //     return ''
        //   },
        // },
        {
          title: '积分',
          align: 'center',
          customRender: (text, record, index) => {
            if (record.detailList && record.detailList.length >= 2) {
              return `${record.detailList[0].point}/${record.detailList[1].point}`
            }
            return ''
          },
        },
        {
          title: '总积分',
          align: 'center',
          customRender: (text, record, index) => {
            if (record.detailList && record.detailList.length >= 2) {
              return `${record.detailList[0].totalPoint}/${record.detailList[1].totalPoint}`
            }
            return ''
          },
        },
      ],
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.loadingModal = false
      this.data = data
      this.handleGetDetailList()
      // this.$nextTick(() => {

      // })
    },
    handleGetDetailList() {
      getDetailList(this.data).then((res) => {
        console.log(res, '232222-')
        this.list = res.result
          // 更新表头标题
          this.updateColumnTitles(res.result);
      })
      
    },
    updateColumnTitles(list) {
      if (list.length > 0) {
        const team1Name = list[0].detailList[0].groupName+'总分' || '代表队1';
        const team2Name = list[0].detailList[1].groupName+'总分' || '代表队2';
        this.columns[1].title = team1Name;
        this.columns[2].title = team2Name;
      }
    },
    handleSearch() {
      this.handleGetDetailList()
    },

    handleCancel() {
      this.visible = false
    },
  },
}
</script>
  
  <style scoped lang="less">
.notesDiv {
  color: red;
  font-size: 16px;
  margin-bottom: 20px;
 
}
</style>