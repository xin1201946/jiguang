<template>
  <BizModal :visible="visible" @cancel="handleCancel" :footer="false" widths="50%" :title="title">
    <div class="prints">
      <div>
        <a-descriptions bordered :column="4">
          <a-descriptions-item :span="2" label="选手名称">{{ formData.playerName }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="代表队">{{ formData.groupName }}</a-descriptions-item>
          <a-descriptions-item :span="2" label="项目名称">
            {{
              formData.projectName ||
              (formData.detailScoreList && formData.detailScoreList.length > 0
                ? formData.detailScoreList[0].projectName
                : '')
            }}
          </a-descriptions-item>
          <a-descriptions-item :span="2" label="项目组别">
            {{
              formData.projectGroup ||
              (formData.detailScoreList && formData.detailScoreList.length > 0
                ? formData.detailScoreList[0].projectGroup
                : '')
            }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div class="printBody" id="printMe" ref="print" style="margin-top: 20px">
        <div v-for="(item, i) in list" :key="i" class="list">
          <template v-if="item.list && item.list.length">
            <h3>{{ item.title }}</h3>
            <a-table
              bordered
              :pagination="false"
              :columns="columns"
              :data-source="item.list"
              :row-key="record => record.playerScoreId || record.shootCode">
              <template slot="operation" slot-scope="text, record, index">
                <a-button
                  v-if="index + 1 > extractNumber(formData.projectName)"
                  type="danger"
                  size="small"
                  ghost
                  icon="delete"
                  @click="handleDelete(item.list, record, index)"
                  >删除</a-button
                ></template
              ></a-table
            >
          </template>
        </div>
      </div>
      <div class="btns" v-if="type === 0">
        <a-button type="primary" :loading="isPrinting" @click="handlePrint">打印</a-button>
      </div>
    </div>
  </BizModal>
</template>

<script>
import BizModal from '@comp/modal/BizModal.vue'
import { deleteSurplusShoot } from '@/api/competition'
import { checkAPIAvailability, tryAskAI } from '@/utils/ai/chrome_ai'

export default {
  name: 'RealTimeViewPrint',
  components: {
    BizModal
  },
  data() {
    return {
      name: '',
      stageTotal: '',
      goodTotal: '',
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
        {
          title: '操作',
          dataIndex: '',
          align: 'center',
          scopedSlots: {
            customRender: 'operation',
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
      aiSummary: '',
      isPrinting: false
    }
  },
  async mounted() {
    console.log("打印组件已加载")
    await checkAPIAvailability()
  },
  methods: {
    info(data) {
      this.title = '成绩详情'
      this.type = 1
      this.formData = data[0]
      this.visible = true
      this.list = data.map((item) => {
        return {
          title: item.stageName,
          list: item.dtlDto.scoreList,
        }
      })
    },
    init(data) {
      this.title = '成绩打印'
      this.type = 0
      this.visible = true

      if (Array.isArray(data)) {
        this.formData = data[0]
        // this.visible = true
        // 防止 data.stageName 为 undefined
        this.list = data
          .map((item) => {
            return {
              title: item.stageName,
              list: item.dtlDto.scoreList,
            }
          })
          // 这里的 data.stageName 可能为 undefined
          .filter((item) => item.stageName === (data.stageName || ''))
      } else {
        this.formData = {}
        this.stageName = data.stageName
        // 判空处理
        if (data.stageName && data.stageName.includes('团体')) {
          this.formData = data
          this.$nextTick(() => {
            if ('detailScoreList' in data && Array.isArray(data.detailScoreList)) {
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
          // 判空处理
          const arr = Array.isArray(data.list)
            ? data.list
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
            : []
          this.name = arr.length > 0 ? arr[0].title : ''
          this.scoreList = arr.length > 0 ? arr[0].scoreList : []
          this.stageTotal = arr.length > 0 ? arr[0].stageTotal : ''
          this.goodTotal = arr.length > 0 ? arr[0].goodTotal : ''
          this.formData =
            Array.isArray(data.list) && data.list.filter((item) => item.cproStageId === data.stageId).length > 0
              ? data.list.filter((item) => item.cproStageId === data.stageId)[0]
              : {}
          this.list = arr
        }
      }
    },
    extractNumber(str) {
      if (str) {
        const match = str.match(/(\d+)发/) // 匹配字符串中最后一个不在括号内的数字序列
        return match ? parseInt(match[1], 10) : null
      }
    },
    //删除多余发序
    handleDelete(i, r, index) {
      deleteSurplusShoot({ playerScoreId: r.playerScoreId }).then((res) => {
        this.$emit('delete-success')
      })
    },
    handleCancel() {
      this.visible = false
    },
    // 获取AI总结
    async getAISummary() {
      try {
        const playerInfo = `选手:${this.formData.playerName || '未知'}, 代表队:${this.formData.groupName || '未知'}, 项目:${
          this.formData.projectName || (this.formData.detailScoreList && this.formData.detailScoreList.length > 0
            ? this.formData.detailScoreList[0].projectName : '未知')
        }`;

        let scoreInfo = '';
        if (this.list && this.list.length > 0) {
          scoreInfo = this.list
            .filter(item => item.list && item.list.length) // 确保有成绩数据
            .map(item => {
              // 提取每发的详细分数
              const detailedScores = item.list
                .map(scoreItem => `发序 ${scoreItem.shootCode}: ${scoreItem.score}${scoreItem.isGood === '是' ? '*' : ''}`)
                .join(', ');
              return `${item.title || '未知阶段'}: [${detailedScores}]`;
            })
            .join('; ');
          scoreInfo = `详细成绩: ${scoreInfo}`;
        }

        const prompt = `${playerInfo}. ${scoreInfo}. 请根据以上数据，总结该选手的表现、优势与不足，并提供改进建议。`;
        console.log(prompt)
        if (await checkAPIAvailability()){
          this.aiSummary = "AI 分析:\n" + await tryAskAI(prompt)
        }else{
          this.aiSummary = ""
        }
        return this.aiSummary;
      } catch (error) {
        console.error('获取AI总结失败:', error);
        this.aiSummary = '无法生成AI总结';
        return this.aiSummary;
      }
    },
    // 自定义 markdown 转 HTML 函数，简化处理
    markdownToHtml(text) {
      if (!text) return '';

      // 处理基本的 markdown 语法
      return text
        // 处理加粗文本 **text**
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // 处理斜体 *text*
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // 处理链接 [title](url)
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
        // 处理标题 # Heading
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        // 处理无序列表
        .replace(/^\* (.*$)/gm, '<li>$1</li>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        // 处理段落
        .replace(/\n(?!\n)/g, '<br>')
        .replace(/\n\n/g, '</p><p>');
    },
    // 打印的资格赛
    bodyContent() {
      const list = (arr) => {
        const l = arr
          .map((item, index) => {
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
                <td align="center" style="font-size:12px;">${item.shootCode}</td>
                <td align="center"  ><img style="width:15px;height: 15px;" src="${
                  process.env.NODE_ENV === 'electron' ? imgSrc : '../' + imgSrc
                }" ></td>
                <td align="center" style="font-size:12px;">${item.isGood === '是' ? `${item.score} *` : item.score}</td>
                <td align="center" style="font-size:12px;">${
                  item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
                }</td>
                <td align="center" style="font-size:12px;">${item.xcoord}</td>
                <td align="center" style="font-size:12px;">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center" style="font-weight: 1000;font-size:12px;">小计</td>
                <td></td>
                <td align="center" style="font-weight: 900;font-size:12px;">${
                  this.formData.groupScoreList[(index + 1) / 10 - 1].groupTotal
                }${
                this.formData.groupScoreList[(index + 1) / 10 - 1].groupGood != null
                  ? `${'-' + this.formData.groupScoreList[(index + 1) / 10 - 1].groupGood}*`
                  : ''
              }</td>
              </tr>,
            `
            }
            return `<tr style="height: 25px; line-height: 25px">
            <td align="center" style="font-size:12px;">${item.shootCode}</td>
            <td align="center"><img style="width:15px;height:15px;" src="${
              process.env.NODE_ENV === 'electron' ? imgSrc : '../' + imgSrc
            }" ></td>
            <td align="center" style="font-size:12px;">${item.isGood === '是' ? `${item.score} *` : item.score}</td>

            <td align="center" style="font-size:12px;">${
              item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
            }</td>
            <td align="center" style="font-size:12px;">${item.xcoord}</td>
            <td align="center" style="font-size:12px;">${item.ycoord}</td>
          </tr>,`
          })
          .filter((item) => item.length !== 0)
          .join('')
          .split(',')
          .map((item) => item.replace('//n/g').trim())
          .filter((item) => item.length !== 0)

        l.push(`
          <tr style="text-align: right">
            <td align="center" style="font-weight: 900;font-size:12px;">总计</td>
            <td></td>
            <td align="center" style="font-weight: 900;font-size:12px; width:60px">${this.stageTotal}${
          this.goodTotal != null ? `${'-' + this.goodTotal}*` : ''
        }</td>
          </tr>
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
    <div style="box-sizing: border-box;padding: 10px 20px;">
      <table align="center" cellspacing="0" border="0" style="width: 800px; font-family: 宋体;">
        <thead>
          <tr>
            <th colspan="6" style="font-size: 22px; font-weight: bold; text-align: center; padding: 10px 0;">
              ${this.formData.projectGroup} ${this.formData.projectName}
            </th>
          </tr>
          <tr>
            <th colspan="6" style="font-size: 18px; text-align: center; padding: 5px 0;">
              ${this.formData.dtlDto.title || this.list[0].title}
            </th>
          </tr>
          <tr>
            <th colspan="6" style="font-size: 16px; text-align: center;">
              靶位：${this.formData.targetSiteStr}　  ${this.formData.sgTimeStart ? `　|　时间：${this.formData.sgTimeStart}` : ""}
            </th>
          </tr>
          <tr>
            <th colspan="6" style="font-size: 16px; text-align: center; padding-bottom: 10px;">
              射手：${this.formData.playerName}
            </th>
          </tr>
          <tr style="height: 30px; line-height: 30px; background-color: #f0f0f0;">
            <th style="font-size: 14px;width:40px;">发序</th>
            <th style="font-size: 14px;width:45px;">方向点</th>
            <th style="font-size: 14px;">环数</th>
            <th style="font-size: 14px;width:130px;">时间</th>
            <th style="font-size: 14px;">X</th>
            <th style="font-size: 14px;">Y</th>
          </tr>
        </thead>
        <tbody>${tds[i].join('')}</tbody>
      </table>
    </div>
  `)
          }else {
            tables.push(`
              <div style="box-sizing: border-box;padding: 5px">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr style="height: 25px; line-height: 25px">
                      <th style="font-size: 14px;width:40px;">发序</th>
                      <th style="font-size: 14px;width:45px;">方向点</th>
                      <th style="font-size: 14px;">环数</th>
                      <th style="font-size: 14px;width:130px;">时间</th>
                      <th style="font-size: 14px;">X</th>
                      <th style="font-size: 14px;">Y</th>
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
          grid-template-columns: 45% 46%;
          grid-column-gap: 8%;
        }
        .ai-summary {
          margin-top: 20px;
          padding: 10px;
          border-top: 1px dashed #ccc;
          font-size: 14px;
          line-height: 1.5;
        }
      </style>
      <div class="print" style="height: auto;">
         ${arr.join('</br>')}
      </div>
      <div class="ai-summary">
        <p>${this.markdownToHtml(this.aiSummary)}</p>
      </div>`
    },
    // 打印的决赛
    bodyContent2() {
      const list = (arr) => {
        const l = arr
          .map((item, index) => {
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
            if (index + 1 <= 10 && (index + 1) % 5 === 0) {
              return `
              <tr style="height: 25px; line-height: 25px">
                <td align="center" style="font-size:12px;">${item.shootCode}</td>
                <td align="center"  ><img style="width:15px;height: 15px;" src="${
                  process.env.NODE_ENV === 'electron' ? imgSrc : '../' + imgSrc
                }" ></td>
                <td align="center" style="font-size:12px;">${item.isGood === '���' ? `${item.score} *` : item.score}</td>
                <td align="center" style="font-size:12px;">${
                  item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
                }</td>
                <td align="center" style="font-size:12px;">${item.xcoord}</td>
                <td align="center" style="font-size:12px;">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center" style="font-weight: 900;font-size:12px;">小计</td>
                <td></td>
                <td align="center" style="font-weight: 900;font-size:12px;">
                  ${this.formData.groupScoreList[(index + 1) / 5 - 1].groupTotal}${
                this.formData.groupScoreList[(index + 1) / 5 - 1].groupGood != null
                  ? `${'-' + this.formData.groupScoreList[(index + 1) / 5 - 1].groupGood}*`
                  : ''
              }
                  </td>
              </tr>,
            `
            }
            if (index + 1 > 10 && (index + 1) % 2 === 0) {
              return `
              <tr style="height: 25px; line-height: 25px">
                <td align="center" style="font-size:12px;">${item.shootCode}</td>
                <td align="center"  ><img style="width:15px;height: 15px;" src="${
                  process.env.NODE_ENV === 'electron' ? imgSrc : '../' + imgSrc
                }" ></td>
                <td align="center" style="font-size:12px;">${item.isGood === '是' ? `${item.score} *` : item.score}</td>
                <td align="center" style="font-size:12px;">${
                  item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
                }</td>
                <td align="center" style="font-size:12px;">${item.xcoord}</td>
                <td align="center" style="font-size:12px;">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center" style="font-weight: 900;font-size:12px;">小计</td>
                <td></td>
                <td align="center" style="font-weight: 900;font-size:12px;">
                ${this.formData.groupScoreList[(index + 1 - 10) / 2 + 1].groupTotal}${
                this.formData.groupScoreList[(index + 1 - 10) / 2 + 1].groupGood != null
                  ? `${'-' + this.formData.groupScoreList[(index + 1 - 10) / 2 + 1].groupGood}*`
                  : ''
              }</td>
              </tr>,
            `
            }
            return `<tr style="height:35px; line-height:35px">
            <td align="center" style="font-size:12px;">${item.shootCode}</td>
            <td align="center"  ><img style="width:15px;height: 15px;" src="${
              process.env.NODE_ENV === 'electron' ? imgSrc : '../' + imgSrc
            }" ></td>
                <td align="center" style="font-size:12px;">${item.isGood === '是' ? `${item.score} *` : item.score}</td>
            <td align="center" style="font-size:12px;">${
              item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
            }</td>
            <td align="center" style="font-size:12px;">${item.xcoord}</td>
            <td align="center" style="font-size:12px;">${item.ycoord}</td>
          </tr>,`
          })
          .filter((item) => item.length !== 0)
          .join('')
          .split(',')
          .map((item) => item.replace('//n/g').trim())
          .filter((item) => item.length !== 0)
        l.push(`
          <tr style="text-align: right">
            <td align="center" style="font-weight: 900;font-size:12px;">总计</td>
            <td></td>
            <td align="center" style="font-weight: 900;font-size:12px;">${this.stageTotal}${
          this.goodTotal != null ? `${'-' + this.goodTotal}*` : ''
        }</td>
          </tr>
        `)
        const tds = []
        tds.push([])
        for (let i = 0; i < 20; i++) {
          tds[0].push(l[i])
        }
        if (l.length > 20) {
          l.splice(0, 20)
          for (let i = 0; i < l.length; i += 20) {
            tds.push(l.slice(i, i + 20))
          }
        }
        const tables = []
        for (let i = 0; i < tds.length; i++) {
          if (i === 0) {
            tables.push(`
              <div style="box-sizing: border-box;">
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
                      this.formData.dtlDto.title
                    }</th></tr>
                    <tr style="height: 25px; line-height: 25px">
                      <th style="font-size: 14px;width:40px;">发序</th>
                      <th style="font-size: 14px;width:45px;">方向点</th>
                      <th style="font-size: 14px;">环数</th>
                      <th style="font-size: 14px;width:130px;">时间</th>
                      <th style="font-size: 14px;">X</th>
                      <th style="font-size: 14px;">Y</th>
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
                    <tr style="height: 25px; line-height: 25px">
                      <th style="font-size: 14px;width:40px;">发序</th>
                      <th style="font-size: 14px;width:45px;">方向点</th>
                      <th style="font-size: 14px;">环数</th>
                      <th style="font-size: 14px;width:130px;">时间</th>
                      <th style="font-size: 14px;">X</th>
                      <th style="font-size: 14px;">Y</th>
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
          grid-template-columns: 45% 46%;
          grid-column-gap: 8%;
        }
        .ai-summary {
          margin-top: 20px;
          padding: 10px;
          border-top: 1px dashed #ccc;
          font-size: 14px;
          line-height: 1.5;
        }
      </style>
      <div class="print" style="height: auto">
         ${arr.join('</br>')}
      </div>
      <div class="ai-summary">
        <strong>AI分析:</strong>
        <p>${this.markdownToHtml(this.aiSummary)}</p>
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
                <td align="center">${item.isGood === '是' ? `${item.score} *` : item.score}</td>
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
                    <tr style="height: 25px; line-height: 25px;">
                    <th style="font-size: 14px;">发序</th>
                    <th style="font-size: 14px;">环数</th>
                    <th style="font-size: 14px;">时间</th>
                    <th style="font-size: 14px;">X</th>
                    <th style="font-size: 14px;">Y</th>
                    </tr>
                  </thead>
                  <tbody style="font-family: 宋��;">${tds[i].join('')}</tbody>
                </table>
              </div>
            `)
          } else {
            tables.push(`
              <div style="box-sizing: border-box;padding: 10px">
                <table align="center" cellspacing="0" border="0" style="width: 100%;">
                  <thead>
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.detailScoreList[0].stageName}</th></tr>
                    <tr style="height: 25px; line-height: 25px;">
                    <th style="font-size: 28px;"><b>发序</b></th>
                    <th style="font-size: 14px;"><b>环数</b></th>
                    <th style="font-size: 14px;"><b>时间</b></th>
                    <th style="font-size: 14px;"><b>X</b></th>
                    <th style="font-size: 14px;"><b>Y</b></th>
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
            jtds.push(`<tr style="height: 25px; line-height: 25px">
            <td align="center" style="width:25px;font-size:12px;">${item.shootCode}</td>
            <td align="center" style="width:42px" ><img style="width:15px;height: 15px;" src="${
              process.env.NODE_ENV === 'electron' ? imgSrc : '../' + imgSrc
            }" ></td>
            <td align="center" style="width:40px;font-size:12px;">${
              item.isGood === '是' ? `${item.score} *` : item.score
            }</td>
            <td align="center" style="font-size:12px;" >${
              item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
            }</td>
            <td align="center"  style="font-size:12px;">${item.xcoord}</td>
            <td align="center"  style="font-size:12px;">${item.ycoord}</td>
          </tr>`)
          }
        }
        if (this.jt['铜牌赛'].length != 0) {
          for (const item of this.jt['铜牌赛']) {
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
            ttds.push(`<tr style="height: 25px; line-height: 25px">
            <td align="center" style="width:25px;font-size:12px;" >${item.shootCode}</td>
            <td align="center"  style="width:42px" ><img style="width:15px;height: 15px;" src="${
              process.env.NODE_ENV === 'electron' ? imgSrc : '../' + imgSrc
            }" ></td>
            <td align="center" style="width:40px;font-size:12px;">${
              item.isGood === '是' ? `${item.score} *` : item.score
            }</td>
            <td align="center"  style="font-size:12px;">${
              item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)
            }</td>
            <td align="center"  style="font-size:12px;">${item.xcoord}</td>
            <td align="center"  style="font-size:12px;">${item.ycoord}</td>
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
            <tr><th></th><b style="font-size: 18px">铜牌赛</b></tr>
            <p style="height: 25px; line-height: 25px;">
            <span style="font-size: 14px;font-weight:bold;">发序</span>
            <span style="font-size: 14px;font-weight:bold;">方向点</span>
              <span style="font-size: 14px;font-weight:bold;">环数</span>
              <span style="font-size: 14px;font-weight:bold;margin-left:1.7cm;">时间</span>
              <span style="font-size: 14px;font-weight:bold;margin-left:1.8cm;">X</span>
              <span style="font-size: 14px;font-weight:bold;margin-left:0.7cm;">Y</span>
            </p>
          </thead>
          <tbody style="font-family: 宋体;">
            ${ttds.join('')}
          </tbody>
        `
          : `
        <thead>
          <tr ><th></th><b style="font-size: 18px">金牌赛</b></tr>
          <p style="height: 25px; line-height: 25px;">
            <span style="font-size: 14px;font-weight:bold;">发序</span>
            <span style="font-size: 14px;font-weight:bold;">方向点</span>
              <span style="font-size: 14px;font-weight:bold;">环数</span>
              <span style="font-size: 14px;font-weight:bold;margin-left:1.7cm;">时间</span>
              <span style="font-size: 14px;font-weight:bold;margin-left:1.8cm;">X</span>
              <span style="font-size: 14px;font-weight:bold;margin-left:0.7cm;">Y</span>
            </p>
        </thead>
        <tbody style="font-family: 宋体;">
          ${jtds.join('')}
        </tbody>
        `
        return `
          <div>
            <p style="font-size: 18px"><b>靶位:${this.formData.targetSite}</b></p>
            <p style="font-size: 18px"><b>时间:${this.formData.sgTimeStart}</b></p>
            <p style="font-size: 18px"><b>${this.formData.detailScoreList[0].projectName}</b></p>
            <p style="font-size: 18px"><b>${this.formData.playerName}</b></p>
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

          .print{
            display: grid;
            grid-template-columns: 45% 45%;
          }
          .ai-summary {
            margin-top: 20px;
            padding: 10px;
            border-top: 1px dashed #ccc;
            font-size: 14px;
            line-height: 1.5;
          }
        </style>
        <div class="print" style="height: auto">${jtList()}</div>
        <div class="ai-summary">
          <strong>AI分析:</strong>
          <p>${this.markdownToHtml(this.aiSummary)}</p>
        </div>
      `
    },
    /**
     * 兼容性打印方法
     * @param {string} htmlContent 打印内容
     */
    compatiblePrint(htmlContent) {
      // 优先使用 iframe 方式
      try {
        const iframe = document.createElement('iframe')
        document.body.appendChild(iframe)
        iframe.width = '100%'
        iframe.height = '800px'
        iframe.style.display = 'none'

        iframe.onload = () => {
          try {
            const doc = iframe.contentWindow.document
            doc.open()
            doc.write(`
              <!DOCTYPE html>
              <html>
                <head>
                  <title>Print</title>
                  <meta charset="utf-8">
                </head>
                <body>
                  ${htmlContent}
                </body>
              </html>
            `)
            doc.close()
            setTimeout(() => {
              iframe.contentWindow.print()
              iframe.contentWindow.addEventListener('afterprint', () => {
                document.body.removeChild(iframe)
              })
              setTimeout(() => {
                if (document.body.contains(iframe)) {
                  document.body.removeChild(iframe)
                }
              }, 1000)
            }, 100)
          } catch (e) {
            // fallback
            document.body.removeChild(iframe)
            this.windowWritePrint(htmlContent)
          }
        }
        iframe.onerror = () => {
          document.body.removeChild(iframe)
          this.windowWritePrint(htmlContent)
        }
        // 触发 onload
        iframe.src = 'about:blank'
      } catch (e) {
        this.windowWritePrint(htmlContent)
      }
    },
    /**
     * window.open + document.write 兼容打印
     */
    windowWritePrint(htmlContent) {
      const printWindow = window.open('', '_blank')
      if (!printWindow) return
      printWindow.document.open()
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print</title>
            <meta charset="utf-8">
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    },
    async handlePrint() {
      if (this.isPrinting) return; // 防止重复点击
      this.isPrinting = true;

      try {
        // 获取AI总结
        await this.getAISummary();

        let htmlContent = ''
        if (this.stageName && this.stageName.includes('团体')) {
          htmlContent = this.groupContent()
        } else {
          if (this.name == '资格赛') {
            htmlContent = this.bodyContent()
          } else {
            htmlContent = this.bodyContent2()
          }
        }

        // 执行打印
        this.compatiblePrint(htmlContent)

        // 打印成功提示
        this.$message.success('打印任务已发送');

      } catch (error) {
        console.error('打印过程中发生错误:', error);
        // 错误提示
        this.$message.error('打印失败，请重试');
      } finally {
        // 延迟关闭加载状态，给用户足够的反馈时间
        setTimeout(() => {
          this.isPrinting = false;
        }, 1000);
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
