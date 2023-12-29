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
          <a-descriptions-item :span="2" label="项目名称">{{formData.projectName || formData.detailScoreList[0].projectName}}</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目组别">{{formData.projectGroup || formData.detailScoreList[0].projectGroup}}</a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="printBody" id="printMe" ref="print" style="margin-top: 20px">

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
import { Time } from '@/utils'
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
          align: 'center',
          customRender: text => {
            // console.log(text)
            return text.length <= 19? text : text.substring(0, text.length - 7)
            // return Time(new Date(text), "YYYY-MM-DD HH:mm:ss") || ""
          }
        },
      ],
      list: [],
      scoreList: [],
      html: '',
      stageName: '',
      jt: {
        "金牌赛": [],
        "铜牌赛": []
      }
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
      this.visible = true
      if (Array.isArray(data)) {
        this.formData = data[0]
        // this.visible = true
        const arr = data.map(item => {
          return {
            title: item.stageName,
            list: item.dtlDto.scoreList
          }
        }).filter(item => item.stageName === data.stageName)
        // console.log(arr)
        this.list = arr
      }else {
        this.formData = {}
        this.stageName = data.stageName
        if (data.stageName.includes('团体')) {
          this.formData = data
          console.log(data)
          // this.list =
          this.$nextTick(() => {
            if ('detailScoreList' in data) {
              this.jt['金牌赛'] = data.detailScoreList.filter(item => item.stageGroup === 1)
              this.jt['铜牌赛'] = data.detailScoreList.filter(item => item.stageGroup !== 1)
              this.list = [{list: data.detailScoreList, title: ""}]
            }else {
              this.jt['金牌赛'] = []
              this.jt['铜牌赛'] = []
              this.list = [{list: [], title: ""}]
            }
          })

        }else {

          const arr = data.list
            .filter(item => item.cproStageId === data.stageId)
            .map(item => {
            return {
              title: item.stageName,
              list: item.dtlDto.scoreList,
              scoreList: item.scoreList
            }
          })
          this.scoreList = arr[0].scoreList
          this.formData = data.list.filter(item => item.cproStageId === data.stageId)[0]
          this.list = arr
        }
      }
    },
    handleCancel() {
      this.visible = false
    },
    // 打印的
    bodyContent() {
      const list = (arr) => {
        const l = arr.map((item, index) => {
          if ((index + 1) % 10 === 0 && index !== 0) {
            return (`
              <tr style="height: 50px; line-height: 50px">
                <td align="center">${item.shootCode}</td>
                <td align="center">${item.score}</td>
                <td align="center">${item.beginTime.length <= 19? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
                <td align="center">${item.xcoord}</td>
                <td align="center">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center">总计</td>
                <td align="center">${this.formData.scoreList[((index + 1) / 10) - 1] || 0}</td>
              </tr>,
            `)
          }
          return (
            `<tr style="height: 50px; line-height: 50px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${item.beginTime.length <= 19? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>,`
          )
        })
          .filter(item => item.length !== 0)
          .join('')
          .split(',')
          .map(item => item.replace("/\/n/g").trim())
          .filter(item => item.length !== 0)
        const tds = []
        tds.push([])
        for (let i = 0; i < 14; i ++) {
          tds[0].push(l[i])
        }
        if (l.length > 14) {
          l.splice(0, 14)
          for (let i = 0; i < l.length; i += 19) {
            tds.push(l.slice(i, i + 19))
          }
        }
        const tables = []
        for (let i = 0; i < tds.length; i++) {
          if (i === 0) {
            tables.push(`
              <div style="box-sizing: border-box;padding: 10px">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">靶位:${this.formData.targetSiteStr}</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">时间:${this.formData.sgTimeStart}</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.projectGroup}${this.formData.projectName}</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.playerName}</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.dtlDto.title}</th></tr>
                    <tr style="height: 50px; line-height: 50px">
                      <th>发序</th>
                      <th>环数</th>
                      <th>时间</th>
                      <th>X</th>
                      <th>Y</th>
                    </tr>
                  </thead>
                  <tbody>${tds[i].join("")}</tbody>
                </table>
              </div>
            `)
          }else {
            tables.push(`
              <div style="box-sizing: border-box;padding: 10px">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr style="height: 50px; line-height: 50px">
                      <th>发序</th>
                      <th>环数</th>
                      <th>时间</th>
                      <th>X</th>
                      <th>Y</th>
                    </tr>
                  </thead>
                  <tbody>${tds[i].join("")}</tbody>
                </table>
              </div>
            `)
          }
        }
        return tables.join("")
      }
      const arr = this.list.map((item, i) => {
        if (item.list.length) {
          return (`<div>${list(item.list)}</div>`)
        }
        return ''
      })
      return  (`
      <style>
        @media print {
          @page {
            margin: 0;
          }
        }
        thead>tr{
          height: 50px;
          line-height: 50px;
        }
        .print>div{
          display: grid;
          grid-template-columns: 45% 45%;
        }
      </style>
      <div class="print" style="height: auto">
         ${arr.join("</br>")}
      </div>`)
    },
    groupContent() {
      const list = () => {
        // console.log()
        const scoreList = JSON.parse(JSON.stringify(this.formData.detailScoreList))
        const l = scoreList.map((item, index) => {
          if ((index + 1) % 10 === 0 && index !== 0) {
            return (`
              <tr style="height: 50px; line-height: 50px">
                <td align="center">${item.shootCode}</td>
                <td align="center">${item.score}</td>
                <td align="center">${item.beginTime.length <= 19? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
                <td align="center">${item.xcoord}</td>
                <td align="center">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center">总计</td>
                <td align="center">${this.formData.scoreList[((index + 1) / 10) - 1] || 0}</td>
              </tr>,
            `)
          }
          return (
            `<tr style="height: 50px; line-height: 50px">
              <td align="center">${item.shootCode}</td>
              <td align="center">${item.score}</td>
              <td align="center">${item.beginTime.length <= 19? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
              <td align="center">${item.xcoord}</td>
              <td align="center">${item.ycoord}</td>
            </tr>,`
          )
        })
          .filter(item => item.length !== 0)
          .join('')
          .split(',')
          .map(item => item.replace("/\/n/g").trim())
          .filter(item => item.length !== 0)
        const tds = []
        tds.push([])
        for (let i = 0; i < 14; i ++) {
          tds[0].push(l[i])
        }
        if (l.length > 14) {
          l.splice(0, 14)
          for (let i = 0; i < l.length; i += 19) {
            tds.push(l.slice(i, i + 19))
          }
        }
        const tables = []
        for (let i = 0; i < tds.length; i++) {
          if (i === 0) {
            tables.push(`
              <div style="box-sizing: border-box;padding: 10px">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">靶位:${this.formData.targetSite}</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">时间:${this.formData.sgTimeStart}</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.detailScoreList[0].projectName}</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.playerName}</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.detailScoreList[0].stageName}</th></tr>
                    <tr style="height: 50px; line-height: 50px">
                      <th>发序</th>
                      <th>环数</th>
                      <th>时间</th>
                      <th>X</th>
                      <th>Y</th>
                    </tr>
                  </thead>
                  <tbody>${tds[i].join("")}</tbody>
                </table>
              </div>
            `)
          }else {
            tables.push(`
              <div style="box-sizing: border-box;padding: 10px">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.detailScoreList[0].stageName}</th></tr>
                    <tr style="height: 50px; line-height: 50px">
                      <th>发序</th>
                      <th>环数</th>
                      <th>时间</th>
                      <th>X</th>
                      <th>Y</th>
                    </tr>
                  </thead>
                  <tbody>${tds[i].join("")}</tbody>
                </table>
              </div>
            `)
          }
        }
        return tables.join("")
      }
      const jtList = () => {
        const jtds = []
        const ttds = []
        for (const item of this.jt["金牌赛"]) {
          jtds.push(`<tr style="height: 50px; line-height: 50px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${item.beginTime.length <= 19? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>`)
        }
        for (const item of this.jt["铜牌赛"]) {
          ttds.push(`<tr style="height: 50px; line-height: 50px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${item.beginTime.length <= 19? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>`)
        }

        const ttable = ttds.length && (`
          <table align="center" cellspacing="0" border="0" style="width: 100%;">
            <thead>
              <tr><th>铜牌赛</th></tr>
              <tr style="height: 50px; line-height: 50px">
                <th>发序</th>
                <th>环数</th>
                <th>时间</th>
                <th>X</th>
                <th>Y</th>
              </tr>
            </thead>
            <tbody>
              ${ttds.join("")}
            </tbody>
          </table>
        `) || ''

        return (`
          <div>
            <p><b>靶位:${this.formData.targetSite}</b></p>
            <p><b>时间:${this.formData.sgTimeStart}</b></p>
            <p><b>${this.formData.detailScoreList[0].projectName}</b></p>
            <p><b>${this.formData.playerName}</b></p>
            <table align="center" cellspacing="0" border="0" style="width: 100%;">
              <thead>
                <tr><th>金牌赛</th></tr>
                <tr style="height: 50px; line-height: 50px">
                  <th>发序</th>
                  <th>环数</th>
                  <th>时间</th>
                  <th>X</th>
                  <th>Y</th>
                </tr>
              </thead>
              <tbody>
                ${jtds.join("")}
              </tbody>
            </table>
          </div>
          <div>
            ${ttable}
          </div>
        `)
      }

      return (`
        <style>
          @media print {
            @page {
              margin: 0;
            }
          }
          thead>tr{
            height: 50px;
            line-height: 50px;
          }
          .print{
            display: grid;
            grid-template-columns: 45% 45%;
          }
        </style>
        <div class="print" style="height: auto">${jtList()}</div>
      `)
      // return ""
    },
    handlePrint() {
      const prints = (fn) => {
        const iframe= document.createElement("iframe");
        document.body.appendChild(iframe);
        iframe.contentWindow.document.open();
        // iframe.contentWindow.document.write(this.bodyContent());
        iframe.contentWindow.document.write(fn());
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
      if (this.stageName.includes('团体')) {
        prints(this.groupContent)
      }else{
        prints(this.bodyContent)
      }
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