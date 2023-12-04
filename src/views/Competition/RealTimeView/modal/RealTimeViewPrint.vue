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
      <div class="printBody" id="printMe" ref="print" style="margin-top: 20px">
<!--        <h2>射击成绩</h2>-->
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
    // 打印的
    bodyContent() {

      const list = (arr) => {
        const l = arr.map(item => (
          `<tr style="height: 50px; line-height: 50px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${item.beginTime}</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>`
        ))
        console.log(l.join(""))
        return `<tbody>${l.join("")}</tbody>`
      }

      const arr = this.list.map((item, i) => {
        if (item.list.length) {
          return (`<div>
            <h3>${item.title}</h3>
            <table align="center" cellspacing="0" border="1" style="width: 100%;">
              <thead>
                <tr style="height: 50px; line-height: 50px">
                  <th style="width: 10%">发序</th>
                  <th style="width: 15%">环数</th>
                  <th style="width: 45%">时间</th>
                  <th style="width: 15%">X</th>
                  <th style="width: 15%">Y</th>
                </tr>
              </thead>
              ${list(item.list)}
            </table>
          </div>`)
        }
        return ''
      })
      // console.log(arr)


      return  (`<div style="height: auto">
        <div style="display: grid; grid-template-rows: repeat(2, 50px); grid-template-columns: repeat(2, 50%); border: 1px solid">
          <div style="display: flex;width: 100%;justify-content: space-around;height: 50px;line-height: 50px;border-right: 1px solid; border-bottom: 1px solid">
            <div style="width: 40%;text-align: center;border-right: 1px solid">选手名称:</div><div style="width: 60%;text-align: center">${this.formData.playerName}</div>
          </div>
          <div style="display: flex;width: 100%;justify-content: space-around;height: 50px;line-height: 50px;border-bottom: 1px solid">
            <div style="width: 40%;text-align: center;border-right: 1px solid">团体名称:</div><div style="width: 60%;text-align: center">${this.formData.groupName}</div>
          </div>
          <div style="display: flex;width: 100%;justify-content: space-around;height: 50px;line-height: 50px;border-right: 1px solid;border-bottom: 1px solid">
            <div style="width: 40%;text-align: center;border-right: 1px solid">项目名称:</div><div style="width: 60%;text-align: center">${this.formData.projectName}</div>
          </div>
          <div style="display: flex;width: 100%;justify-content: space-around;height: 50px;line-height: 50px;border-bottom: 1px solid">
            <div style="width: 40%;text-align: center;border-right: 1px solid">项目组别:</div><div style="width: 60%;text-align: center">${this.formData.projectGroup}</div>
          </div>
        </div>

        <div style="margin-top: 20px">
          ${arr.join("</br>")}
        </div>
      </div>`)
    },
    handlePrint() {
      // const prints = document.querySelector('.prints').innerHTML
      const pwin = window.open(); //打开一个新窗口
      // pwin.document.write(prints); //写入打印内容
      pwin.document.write(this.bodyContent())
      pwin.print(); //调用打印机
      pwin.close() //这个点取消和打印就会关闭新打开的窗口
      pwin.addEventListener('afterprint', () => {
        pwin.close()
      });
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