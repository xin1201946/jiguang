<template>
  <BizModal
    :visible="visible"
    title="比赛成绩查看"
    :footer="false"
    :width="600"
    @cancel="handleCancel"
  >
    <div class="modal">
      <a-descriptions bordered :column="4">
        <a-descriptions-item :span="2" label="代表队">{{formData.groupName}}</a-descriptions-item>
        <a-descriptions-item :span="2" label="阶段名称">{{ formData.stageName }}</a-descriptions-item>
        <a-descriptions-item :span="2" label="项目名称">{{formData.projectName}}</a-descriptions-item>
        <a-descriptions-item :span="2" label="项目组别">{{formData.projectGroup}}</a-descriptions-item>
      </a-descriptions>
<!--      <h3>{{ formData.player1Name }}</h3>-->
      <br/>
      <a-table bordered :pagination="false" :data-source="[...formData.detailScoreList1,...formData.detailScoreList2]" :columns="columns"></a-table>
<!--      <h3>{{ formData.player2Name }}</h3>-->
<!--      <a-table :pagination="false" :data-source="" :columns="columns"></a-table>-->
    </div>
    <div v-if="type === 0" style="height: 50px; display: flex;align-items: center;justify-content: flex-end">
      <a-button type="primary" @click="handlePrint">打印</a-button>
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
      list: [],
      columns: [
        {
          title: '姓名',
          dataIndex: 'playerName',
          align: 'center'
        },
        {
          title: '发序',
          dataIndex: 'shootCode',
          align: 'center'
        },
        {
          title: '环数',
          dataIndex: 'score',
          align: 'center'
        },
        {
          title: '时间',
          dataIndex: 'beginTime',
          align: 'center'
        },
        {
          title: 'X',
          dataIndex: 'xcoord',
          align: 'center'
        },
        {
          title: 'Y',
          dataIndex: 'ycoord',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    init(data) {
      // console.log(data)
      this.type = 1
      this.formData = data
      this.visible = true
      this.list = [...data.detailScoreList1,...data.detailScoreList2]
      // this.list = data
    },
    info(data) {
      console.log(data)
      this.type = 0
      this.formData = data
      this.visible = true
      this.list = [
        ...data.detailScoreList1,
        ...data.detailScoreList2
      ]
    },
    handleCancel() {
      this.visible = false
    },

    bodyContent() {
      const arr = this.list.map(item => {
        return `<tr style="height: 50px; line-height: 50px">
            <td align="center">${item.playerName}</td>
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${item.beginTime.length <= 9 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 6) }</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>`
      })

      // console.log(arr)
      const imgs = window._CONFIG.printSponsorBottomImgs.map((item, index) => (
        `<img src="../${item}" style="width: calc(${(100 / window._CONFIG.printSponsorBottomImgs.length)}% - ${((6 * 2) * window._CONFIG.printSponsorBottomImgs.length)}px); height: 2.5cm;margin: 0 6px"/>`
      ))
      return (`
        <style>
          th{border: 1px solid}

        </style>
        <div style="height: auto;;">
<!--          <div style="text-align: center"><img style="width: 40%;margin-bottom: 20px" src="../${window._CONFIG.printSponsorImg}" alt=""></div>-->
          <!-- <div style="display: grid; grid-template-rows: repeat(2, 50px); grid-template-columns: repeat(2, 50%); border: 1px solid">
            <div style="display: flex;width: 100%;justify-content: space-around;height: 50px;line-height: 50px;border-right: 1px solid; border-bottom: 1px solid">
              <div style="width: 40%;text-align: center;border-right: 1px solid">代表队:</div><div style="width: 60%;text-align: center">${this.formData.groupName}</div>
            </div>
            <div style="display: flex;width: 100%;justify-content: space-around;height: 50px;line-height: 50px;border-bottom: 1px solid">
              <div style="width: 40%;text-align: center;border-right: 1px solid">阶段名称:</div><div style="width: 60%;text-align: center">${this.formData.stageName}</div>
            </div>
            <div style="display: flex;width: 100%;justify-content: space-around;height: 50px;line-height: 50px;border-right: 1px solid;border-bottom: 1px solid">
              <div style="width: 40%;text-align: center;border-right: 1px solid">项目名称:</div><div style="width: 60%;text-align: center">${this.formData.projectName}</div>
            </div>
            <div style="display: flex;width: 100%;justify-content: space-around;height: 50px;line-height: 50px;border-bottom: 1px solid">
              <div style="width: 40%;text-align: center;border-right: 1px solid">项目组别:</div><div style="width: 60%;text-align: center">${this.formData.projectGroup}</div>
            </div>
          </div> -->
          <div>
            <img src="../${window._CONFIG.printSponsorImg}" style="position: absolute;left: 0;right: 0;width: 20%" alt="">
            <h1 style="text-align: center">${this.formData.contestName}</h1>
            <h2 style="text-align: center">${this.formData.projectName}</h2>
            <h3 style="text-align: center">${this.formData.projectGroup}${this.formData.stageName}</h3>
            <p style="text-align: center">${this.formData.groupName}</p>
          </div>
          <div style="margin-top: 20px">
            <table align="center" cellSpacing="0" border="0" style="width: 100%;font-family: 宋体;" >
              <thead>
                <tr style="height: 50px; line-height: 50px" >
                  <th style="width: 20%">姓名</th>
                  <th style="width: 10%">发序</th>
                  <th style="width: 10%">环数</th>
                  <th style="width: 30%">时间</th>
                  <th style="width: 15%">X</th>
                  <th style="width: 15%">Y</th>
                </tr>
              </thead>
              <tbody>
                ${arr.join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="6">
                    <div style="height: 3cm"></div>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div style="position: fixed;left: 0;bottom: 0;height: 2.8cm;margin-bottom: .5cm;padding-top: .2cm ;width: 100%;display: flex;justify-content: space-between">
              ${imgs.join("")}
            </div>
          </div>
        </div>
      `)
    },

    handlePrint() {
      /* const pwin = window.open(); //打开一个新窗口
      // pwin.document.write(prints); //写入打印内容
      pwin.document.write(this.bodyContent())
      // pwin.document.write("打印")
      pwin.print(); //调用打印机
      pwin.close() //这个点取消和打印就会关闭新打开的窗口
      pwin.addEventListener('afterprint', () => {
        pwin.close()
      }); */
      const iframe= document.createElement("iframe");
      document.body.appendChild(iframe);
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(this.bodyContent());
      iframe.width = '100%'
      iframe.height = '800px'
      setTimeout(() => {
        iframe.contentWindow.print()
        iframe.contentWindow.document.close();
        iframe.contentWindow.addEventListener('afterprint', () => {
          iframe.contentWindow.document.close()
          document.body.removeChild(iframe)
        });
        document.body.removeChild(iframe)
      },50)
    }
  }
}
</script>


<style scoped lang="less">
.modal{
  height: calc(100% - 50px);
  overflow-y: auto;
}
</style>