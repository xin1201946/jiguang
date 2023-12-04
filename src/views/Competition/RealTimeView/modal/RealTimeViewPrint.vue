<template>
  <BizModal
    :visible="visible"
    @cancel="handleCancel"
    :footer="false"
    widths="50%"
    :title="title"
  >
    <div class="prints">
      <div>
        <a-descriptions bordered :column="4">
          <a-descriptions-item :span="2" label="选手名称">{{ formData.playerName }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="团体名称">{{formData.groupName}}</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">{{formData.projectName}}</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目组别">{{formData.projectGroup}}</a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="printBody" id="printMe" ref="print">
        <h2>射击成绩</h2>
        <div v-for="(item, i) in list" :key="i" class="list">
          <template v-if="item.list && item.list.length">
            <h3>{{item.title}}</h3>
            <a-table bordered :pagination="false" :columns="columns" :data-source="item.list"></a-table>
          </template>
        </div>
      </div>
      <div class="btns" v-if="type === 0">
        <a-button type="primary" @click="handlePrint">打印</a-button>
      </div>
    </div>
  </BizModal>
</template>

<script >
import BizModal from '@comp/modal/BizModal.vue'

export default {
  name: 'RealTimeViewPrint',
  components: {
    BizModal
  },
  data () {
    return {
      title: "",
      visible: false,
      type: 0,
      formData: {
      },
      columns: [
        {
          dataIndex: 'shootCode',
          title: '发序',
          align: 'center'
        },
        {
          dataIndex: 'score',
          title: '环数',
          align: 'center'
        },
        {
          dataIndex: 'beginTime',
          title: '时间',
          align: 'center'
        },
        {
          dataIndex: 'xcoord',
          title: 'X',
          align: 'center'
        },
        {
          dataIndex: 'ycoord',
          title: 'Y',
          align: 'center'
        },
      ],
      list: [],
      html: ''
    }
  },
  mounted() {
    window.addEventListener('afterprint', () => {
      document.body.innerHTML = this.html
      // this.$router.go(0)
    });
  },
  methods: {
    info(data) {
      this.title = '成绩详情'
      this.type = 1
      this.formData = data[0]
      this.visible = true
      const arr = data.map(item => {
        return {
          title: item.stageName,
          list: item.dtlDto.scoreList
        }
      })
      this.list = arr
    },
    init(data) {
      this.title = '成绩打印'
      this.type = 0
      this.formData = data[0]
      this.visible = true
      const arr = data.map(item => {
        return {
          title: item.stageName,
          list: item.dtlDto.scoreList
        }
      })
      // console.log(arr)
      this.list = arr
    },
    handleCancel() {
      this.visible = false
    },
    handlePrint() {

      const body = document.body.innerHTML
      // this.html = body
      // const prints = document.querySelector('.prints').innerHTML
      // document.body.innerHTML = prints
      // window.print()
      const pwin = window.open(); //打开一个新窗口
      // pwin.document.write(body); //写入打印内容
      // pwin.document.close(); //额...这个我也不知道什么意思 哈哈
      pwin.print(); //调用打印机
      // pwin.close() //这个点取消和打印就会关闭新打开的窗口
    }
  }
}
</script>

<style scoped lang="less">
.prints{
  height: 100%;
  .printBody{
    height: calc(100% - 100px);
    overflow-y: auto;

  }
  .btns{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
  }
}
.list {
  width: 100%;
}
.list_ceil{
  display: flex;
  height: 50px;
  width: 100%;
  border-left: 1px solid;
  &:last-child {
    border-bottom: 1px solid;
  }
  &>div{
    border-right: 1px solid;
    //border-bottom: 1px solid;
    padding: 0 10px ;
    box-sizing: border-box;
    text-align: center;
    line-height: 50px;
    border-top: 1px solid;
    &:nth-of-type(1) {
      width: 10%;
    }
    &:nth-of-type(2) {
      width: 15%;
    }
    &:nth-of-type(3) {
      width: 45%;
    }
    &:nth-of-type(4) {
      width: 15%;
    }
    &:nth-of-type(5) {
      width: 15%;
    }
  }
}

@media print {
  .btns{
    display: none !important;
  }
  .printBody{
    margin-top: 20px;
    height: auto !important;
    overflow-y: visible;
  }
  /deep/.ant-drawer-header{
    display: none !important;
  }
  body {
    height: auto !important;
  }
  .page{
    display: block;
    page-break-after: always;
    page-break-inside: avoid;
  }
}
</style>