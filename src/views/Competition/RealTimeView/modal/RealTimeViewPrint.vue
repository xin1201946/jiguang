<template>
  <BizModal :visible="visible" @cancel="handleCancel" :footer="false" widths="50%" :title="title">
    <div class="prints">
      <div>
        <a-descriptions bordered :column="4">
          <a-descriptions-item :span="2" label="选手名称">{{ formData.playerName }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="代表队">{{ formData.groupName }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">{{
            formData.projectName || formData.detailScoreList[0].projectName
          }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目组别">{{
            formData.projectGroup || formData.detailScoreList[0].projectGroup
          }}</a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="printBody" id="printMe" ref="print" style="margin-top: 20px">
        <div v-for="(item, i) in list" :key="i" class="list">
          <template v-if="item.list && item.list.length">
            <h3>{{ item.title }}</h3>
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
    BizModal,
  },
  data() {
    return {
      name: '',
      stageTotal: '',
      goodTotal:'',
      title: '',
      visible: false,
      type: 0,
      formData: {},
      columns: [
        {
          dataIndex: 'shootCode',
          title: '发序',
          align: 'center',
        },
        {
          dataIndex: 'score',
          title: '环数',
          align: 'center',
        },
        {
          dataIndex: 'beginTime',
          title: '时间',
          align: 'center',
          customRender: (text) => {
            return text.length <= 19 ? text : text.substring(0, text.length - 7)
            // return Time(new Date(text), "YYYY-MM-DD HH:mm:ss") || ""
          },
        },
      ],
      list: [],
      scoreList: [],
      html: '',
      stageName: '',
      jt: {
        金牌赛: [],
        铜牌赛: [],
      },
    }
  },
  mounted() {},
  methods: {
    info(data) {
      this.title = '成绩详情'
      this.type = 1
      this.formData = data[0]
      this.visible = true
      const arr = data.map((item) => {
        return {
          title: item.stageName,
          list: item.dtlDto.scoreList,
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
        const arr = data
          .map((item) => {
            return {
              title: item.stageName,
              list: item.dtlDto.scoreList,
            }
          })
          .filter((item) => item.stageName === data.stageName)
        this.list = arr
      } else {
        this.formData = {}
        this.stageName = data.stageName
        if (data.stageName.includes('团体')) {
          this.formData = data
          // this.list =
          this.$nextTick(() => {
            if ('detailScoreList' in data) {
              this.jt['金牌赛'] = data.detailScoreList.filter((item) => item.stageGroup === 1)
              this.jt['铜牌赛'] = data.detailScoreList.filter((item) => item.stageGroup !== 1)
              this.list = [{ list: data.detailScoreList, title: '' }]
            } else {
              this.jt['金牌赛'] = []
              this.jt['铜牌赛'] = []
              this.list = [{ list: [], title: '' }]
            }
          })
        } else {
          const arr = data.list
            .filter((item) => item.cproStageId === data.stageId)
            .map((item) => {
              return {
                title: item.stageName,
                list: item.dtlDto.scoreList,
                scoreList: item.scoreList,
                stageTotal: item.stageTotal,
                goodTotal: item.goodTotal,
              }
            })
          this.name = arr[0].title
          this.scoreList = arr[0].scoreList
          this.stageTotal = arr[0].stageTotal
          this.goodTotal = arr[0].goodTotal
          this.formData = data.list.filter((item) => item.cproStageId === data.stageId)[0]
          this.list = arr
        }
      }
    },
    handleCancel() {
      this.visible = false
    },
    // 打印的资格赛
    bodyContent() {
      const list = (arr) => {
       
        //每次小计的好十环数
        let goodXcount = 0
        const l = arr
          .map((item, index) => {
            if (item.isGood === '是') {
              goodXcount++ // 如果当前项满足条件，增加计数器
            }
            const imgSrc =
              item.directionPoint == 1
                ? `${window._CONFIG.jiantoushang}`
                : item.directionPoint == 2
                ? `${window._CONFIG.jiantouxia}`
                : item.directionPoint == 3
                ? `${window._CONFIG.jiantouzuo}`
                : item.directionPoint == 4
                ? `${window._CONFIG.jiantouyou}`
                : item.directionPoint == 5
                ? `${window._CONFIG.jiantouyoushang}`
                : item.directionPoint == 6
                ? `${window._CONFIG.jiantouyouxia}`
                : item.directionPoint == 7
                ? `${window._CONFIG.jiantouzuoshang}`
                : item.directionPoint == 8
                ? `${window._CONFIG.jiantouzuoxia}`
                : `''`
            if ((index + 1) % 10 === 0 && index !== 0) {
              return `
              <tr style="height: 25px; line-height: 25px">
                <td align="center">${item.shootCode}</td>
                <td align="center"  ><img style="width:15px;height: 15px;" src="${
                  process.env.NODE_ENV === 'electron' ? imgSrc : '../' + imgSrc
                }" ></td>
                <td align="center">${item.isGood === '是' ? `${item.score} *` : item.score}</td>
                <td align="center">${
                  item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
                }</td>
                <td align="center">${item.xcoord}</td>
                <td align="center">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center" style="font-weight: 1000;">小计</td>
                <td align="center" style="font-weight: 900;">${this.formData.scoreList[(index + 1) / 10 - 1] || 0}${
                  goodXcount != 0 ? `${'-' + goodXcount} *` : ''
              }</td>
              </tr>,
            `
              // 重置计数器以便下一轮计数
              goodXcount = 0
            }
            return `<tr style="height: 25px; line-height: 25px">
            <td align="center">${item.shootCode}</td>
            <td align="center"><img style="width:15px;height:15px;" src="${
              process.env.NODE_ENV === 'electron' ? imgSrc : '../' + imgSrc
            }" ></td>
            <td align="center">${item.isGood === '是' ? `${item.score} *` : item.score}</td>
           
            <td align="center">${
              item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
            }</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>,`
          })
          .filter((item) => item.length !== 0)
          .join('')
          .split(',')
          .map((item) => item.replace('//n/g').trim())
          .filter((item) => item.length !== 0)
        l.push(`
          <tr style="text-align: right">
            <td align="center" style="font-weight: 900;">总计</td>
            <td align="center" style="font-weight: 900;">${this.stageTotal}</td>
            <td align="center" style="font-weight: 900;">好十环总数</td>
            <td align="left" style="font-weight: 900;">${this.goodTotal}</td>
          </tr>,
        `)
        const tds = []
        tds.push([])
        for (let i = 0; i < 32; i++) {
          tds[0].push(l[i])
        }
        if (l.length > 32) {
          l.splice(0, 32)
          for (let i = 0; i < l.length; i += 35) {
            tds.push(l.slice(i, i + 35))
          }
        }
        const tables = []
        for (let i = 0; i < tds.length; i++) {
          if (i === 0) {
            tables.push(`
              <div style="box-sizing: border-box;padding: 10px">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr><th colspan="5" style="font-size: 18px; text-align: left">靶位:${
                      this.formData.targetSiteStr
                    }</th></tr>
                    <tr><th colspan="5" style="font-size: 18px; text-align: left">时间:${
                      this.formData.sgTimeStart
                    }</th></tr>
                    <tr><th colspan="5" style="font-size: 18px; text-align: left">${this.formData.projectGroup}${
              this.formData.projectName
            }</th></tr>
                    <tr><th colspan="5" style="font-size: 18px; text-align: left">${this.formData.playerName}</th></tr>
                    <tr><th colspan="5" style="font-size: 18px; text-align: left">${
                      this.formData.dtlDto.title || this.list[0].title
                    }</th></tr>
                    <tr style="height: 25px; line-height: 25px">
                      <th >发序</th>
                      <th>方向点</th>
                      <th>环数</th>
                      <th>时间</th>
                      <th>X</th>
                      <th>Y</th>
                    </tr>
                  </thead>
                  <tbody style="font-family: 宋体;">${tds[i].join('')}</tbody>
                </table>
              </div>
            `)
          } else {
            tables.push(`
              <div style="box-sizing: border-box;padding: 5px">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr style="height: 25px; line-height: 25px">
                      <th>发序</th>
                      <th>方向点</th>
                      <th>环数</th>
                      <th>时间</th>
                      <th>X</th>
                      <th>Y</th>
                    </tr>
                  </thead>
                  <tbody style="font-family: 宋体;">${tds[i].join('')}</tbody>
                </table>
              </div>
            `)
          }
        }
        return tables.join('')
      }
      const arr = this.list.map((item, i) => {
        if (item.list.length) {
          return `<div>${list(item.list)}</div>`
        }
        return ''
      })
      return `
      <style>
        @media print {
          @page {
            margin: 0;
            margin-top: 1cm;
          }
        }
        thead>tr{
          height: 25px;
          line-height: 25px;
        }
        .print>div{
          display: grid;
          grid-template-columns: 47% 50%;
        }
      </style>
      <div class="print" style="height: auto;">
         ${arr.join('</br>')}
      </div>`
    },
    // 打印的决赛
    bodyContent2() {
      const list = (arr) => {
        const l = arr
          .map((item, index) => {
            if (index + 1 <= 10 && (index + 1) % 5 === 0) {
              return `
              <tr style="height: 45px; line-height: 45px">
                <td align="center">${item.shootCode}</td>
                <td align="center">${item.score}</td>
                <td align="center">${
                  item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
                }</td>
                <td align="center">${item.xcoord}</td>
                <td align="center">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center" style="font-weight: 900;">小计</td>
                <td align="center" style="font-weight: 900;">${this.formData.scoreList[(index + 1) / 5 - 1] || 0}</td>
              </tr>,
            `
            }
            if (index + 1 > 10 && (index + 1) % 2 === 0) {
              return `
              <tr style="height: 45px; line-height: 45px">
                <td align="center">${item.shootCode}</td>
                <td align="center">${item.score}</td>
                <td align="center">${
                  item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
                }</td>
                <td align="center">${item.xcoord}</td>
                <td align="center">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center" style="font-weight: 900;">小计</td>
                <td align="center" style="font-weight: 900;">${this.formData.scoreList[(index + 1 - 10) / 2 + 1]}</td>
              </tr>,
            `
            }
            return `<tr style="height: 45px; line-height: 45px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${
              item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
            }</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>,`
          })
          .filter((item) => item.length !== 0)
          .join('')
          .split(',')
          .map((item) => item.replace('//n/g').trim())
          .filter((item) => item.length !== 0)
        l.push(`
          <tr style="text-align: right">
            <td align="center" style="font-weight: 900;">总计</td>
            <td align="center" style="font-weight: 900;">${this.stageTotal}</td>
          </tr>,
        `)
        const tds = []
        tds.push([])
        for (let i = 0; i < 14; i++) {
          tds[0].push(l[i])
        }
        if (l.length > 14) {
          l.splice(0, 14)
          for (let i = 0; i < l.length; i += 20) {
            tds.push(l.slice(i, i + 20))
          }
        }
        const tables = []
        for (let i = 0; i < tds.length; i++) {
          if (i === 0) {
            tables.push(`
              <div style="box-sizing: border-box;padding: 10px;">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">靶位:${
                      this.formData.targetSiteStr
                    }</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">时间:${
                      this.formData.sgTimeStart
                    }</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.projectGroup}${
              this.formData.projectName
            }</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.playerName}</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${
                      this.formData.dtlDto.title
                    }</th></tr>
                    <tr style="height: 50px; line-height: 50px">
                      <th>发序</th>
                      <th>环数</th>
                      <th>时间</th>
                      <th>X</th>
                      <th>Y</th>
                    </tr>
                  </thead>
                  <tbody style="font-family: 宋体;">${tds[i].join('')}</tbody>
                </table>
              </div>
            `)
          } else {
            tables.push(`
              <div style="box-sizing: border-box;padding: 10px;">
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
                  <tbody style="font-family: 宋体;">${tds[i].join('')}</tbody>
                </table>
              </div>
            `)
          }
        }
        return tables.join('')
      }
      const arr = this.list.map((item, i) => {
        if (item.list.length) {
          return `<div>${list(item.list)}</div>`
        }
        return ''
      })
      return `
      <style>
        @media print {
          @page {
            margin: 0;
            margin-top: 2cm;
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
         ${arr.join('</br>')}
      </div>`
    },
    groupContent() {
      const list = () => {
        const scoreList = JSON.parse(JSON.stringify(this.formData.detailScoreList))
        const l = scoreList
          .map((item, index) => {
            if ((index + 1) % 10 === 0 && index !== 0) {
              return `
              <tr style="height: 50px; line-height: 50px">
                <td align="center">${item.shootCode}</td>
                <td align="center">${item.score}</td>
                <td align="center">${
                  item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
                }</td>
                <td align="center">${item.xcoord}</td>
                <td align="center">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center">总计</td>
                <td align="center">${this.formData.scoreList[(index + 1) / 10 - 1] || 0}</td>
              </tr>,
            `
            }
            return `<tr style="height: 50px; line-height: 50px">
              <td align="center">${item.shootCode}</td>
              <td align="center">${item.score}</td>
              <td align="center">${
                item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
              }</td>
              <td align="center">${item.xcoord}</td>
              <td align="center">${item.ycoord}</td>
            </tr>,`
          })
          .filter((item) => item.length !== 0)
          .join('')
          .split(',')
          .map((item) => item.replace('//n/g').trim())
          .filter((item) => item.length !== 0)
        const tds = []
        tds.push([])
        for (let i = 0; i < 14; i++) {
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
              <div style="box-sizing: border-box;padding: 10px;">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">靶位:${
                      this.formData.targetSite
                    }</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">时间:${
                      this.formData.sgTimeStart
                    }</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${
                      this.formData.detailScoreList[0].projectName
                    }</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.playerName}</th></tr>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${
                      this.formData.detailScoreList[0].stageName
                    }</th></tr>
                    <tr style="height: 50px; line-height: 50px">
                      <th>发序</th>
                      <th>环数</th>
                      <th>时间</th>
                      <th>X</th>
                      <th>Y</th>
                    </tr>
                  </thead>
                  <tbody style="font-family: 宋体;">${tds[i].join('')}</tbody>
                </table>
              </div>
            `)
          } else {
            tables.push(`
              <div style="box-sizing: border-box;padding: 10px">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${
                      this.formData.detailScoreList[0].stageName
                    }</th></tr>
                    <tr style="height: 50px; line-height: 50px">
                      <th>发序</th>
                      <th>环数</th>
                      <th>时间</th>
                      <th>X</th>
                      <th>Y</th>
                    </tr>
                  </thead>
                  <tbody style="font-family: 宋体;">${tds[i].join('')}</tbody>
                </table>
              </div>
            `)
          }
        }
        return tables.join('')
      }
      const jtList = () => {
        const jtds = []
        const ttds = []
        if (this.jt['金牌赛'].length != 0) {
          for (const item of this.jt['金牌赛']) {
            jtds.push(`<tr style="height: 50px; line-height: 50px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${
              item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
            }</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>`)
          }
        }
        if (this.jt['铜牌赛'].length != 0) {
          for (const item of this.jt['铜牌赛']) {
            ttds.push(`<tr style="height: 50px; line-height: 50px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${
              item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
            }</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>`)
          }
        }
        // if (ttds.length) {
        //   ttds.push(`<tr style="height: 50px; line-height: 50px;font-weight: 900">
        //     <td align="center">总环数</td>
        //     <td align="center">0</td>
        //   </tr>`)
        // } else {
        //   jtds.push(`<tr style="height: 50px; line-height: 50px;font-weight: 900">
        //     <td align="center">总环数</td>
        //     <td align="center">0</td>
        //   </tr>`)
        // }

        const table = ttds.length
          ? `
          <thead>
            <tr style="font-size: 24px"><th>铜牌赛</th></tr>
            <tr style="height: 50px; line-height: 50px">
              <th>发序</th>
              <th>环数</th>
              <th>时间</th>
              <th>X</th>
              <th>Y</th>
            </tr>
          </thead>
          <tbody style="font-family: 宋体;">
            ${ttds.join('')}
          </tbody>
        `
          : `
        <thead>
          <tr style="font-size: 24px"><th>金牌赛</th></tr>
          <tr style="height: 50px; line-height: 50px">
            <th>发序</th>
            <th>环数</th>
            <th>时间</th>
            <th>X</th>
            <th>Y</th>
          </tr>
        </thead>
        <tbody style="font-family: 宋体;">
          ${jtds.join('')}
        </tbody>
        `
        return `
          <div>
            <p style="font-size: 24px"><b>靶位:${this.formData.targetSite}</b></p>
            <p style="font-size: 24px"><b>时间:${this.formData.sgTimeStart}</b></p>
            <p style="font-size: 24px"><b>${this.formData.detailScoreList[0].projectName}</b></p>
            <p style="font-size: 24px"><b>${this.formData.playerName}</b></p>
            <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
              ${table}
            </table>
          </div>
        `
      }

      return `
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
      `
      // return ""
    },
    handlePrint() {
      const prints = (fn) => {
        const iframe = document.createElement('iframe')
        document.body.appendChild(iframe)
        iframe.contentWindow.document.open()
        // iframe.contentWindow.document.write(this.bodyContent());
        iframe.contentWindow.document.write(fn())
        iframe.width = '100%'
        iframe.height = '800px'
        setTimeout(() => {
          iframe.contentWindow.print()
          iframe.contentWindow.document.close()
          iframe.contentWindow.addEventListener('afterprint', () => {
            iframe.contentWindow.document.close()
            document.body.removeChild(iframe)
          })
          document.body.removeChild(iframe)
        }, 50)
      }
      if (this.stageName.includes('团体')) {
        prints(this.groupContent)
      } else {
        if (this.name == '资格赛') {
          prints(this.bodyContent)
        } else {
          prints(this.bodyContent2)
        }
      }
    },
  },
}
</script>

<style scoped lang="less">
.prints {
  height: 100%;

  .printBody {
    height: calc(100% - 100px);
    overflow-y: auto;
  }

  .btns {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
  }
}

.list {
  width: 100%;
}

.list_ceil {
  display: flex;
  height: 50px;
  width: 100%;
  border-left: 1px solid;

  &:last-child {
    border-bottom: 1px solid;
  }

  & > div {
    border-right: 1px solid;
    //border-bottom: 1px solid;
    padding: 0 10px;
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
  .btns {
    display: none !important;
  }

  .printBody {
    margin-top: 20px;
    height: auto !important;
    overflow-y: visible;
  }

  /deep/.ant-drawer-header {
    display: none !important;
  }

  body {
    height: auto !important;
  }

  .page {
    display: block;
    page-break-after: always;
    page-break-inside: avoid;
  }
}
</style>