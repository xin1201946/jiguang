<template>
  <div class="RealTimeView">
    <!--    23456-->
    <div class="btns">
      <a-select
        :placeholder="(treeList.length && '请选择赛事') || '请先创建赛事'"
        style="width: 300px"
        v-model="contestId"
        @change="handleContest"
      >
        <a-select-option v-for="(item, i) in treeList" :key="i" :value="item.contestId">{{
          item.contestName
        }}</a-select-option>
      </a-select>
    </div>
    <div class="cards">
      <TreeCard>
        <template slot="tree">
          <a-radio-group v-if="list.length" v-model="tree" @change="handleTreeChange">
            <a-radio :style="style" v-for="item in list" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
          <a-empty description="当前赛事没有项目, 请到赛事列表中创建项目" v-else />
        </template>
        <template slot="query">
          <a-form v-show="this.stageArr.length" layout="inline" :form="form">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item colon label="阶段名称">
                  <a-select v-model="query.cproStageId" @change="handleStageChange">
                    <a-select-option v-for="value in stageArr" :value="value.value" :key="value.value"
                      >{{ value.label }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item :labelCol="{ span: 0 }">
                  <a-space>
                    <a-button @click="handleSubmit" type="primary" icon="search">查询</a-button>
                    <a-button @click="handleReset" icon="reload">重置</a-button>
                  </a-space>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </template>
        <template slot="operator">
          <a-space v-show="this.stageArr.length">
            <!--            :disabled="!data.length"-->
            <a-button :disabled="!data.length" type="primary" @click="handlePrint">成绩打印</a-button>
            <a-button :disabled="!data.length" type="primary" @click="handlePrintTargetSite">靶位成绩打印</a-button>
            <a-button v-if="dataTitle.includes('资格')&&group" :disabled="!data.length" type="primary" @click="handleGroupPrint">成绩打印（分组）</a-button>
            <a-button type="primary" @click="handleSameScore">同分</a-button>
            <!--            <a-button :disabled="!data.length"  type="primary" @click="handleExport">成绩导出</a-button>-->
          </a-space>
        </template>
        <template slot="default">
          <a-table
            v-show="this.stageArr.length"
            :rowSelection="rowSelection"
            :rowClassName="(r, i) => rowClassName(r, i)"
            :columns="columns"
            :data-source="data"
            :pagination="false"
            @change="handleTableChange"
            rowKey="i"
            bordered
          ></a-table>
          <a-empty v-show="!this.stageArr.length" description="当前项目没有阶段, 暂时无法查询最终成绩" />
        </template>
      </TreeCard>
      <!--靶位打印组别 -->
      <gameInfoReportCard ref="oReportCard" @ok="remarkSuccessHandle" />
      <!-- 成绩打印组别 -->
      <gameInfoReportCardT ref="oReportCardT" @ok="remarkSuccessHandleT"></gameInfoReportCardT>
      <!-- 同分 -->
      <GameInfoSameScoreModal ref="sameScore" @ok="sameScoreSuccessHandle" />
    </div>
  </div>
</template>

<script>
import TreeCard from '@comp/card/TreeCard.vue'
import { RealTimeViewTreeStyle } from '@views/Competition/RealTimeView/RealTimeView.config'
import GameInfoSameScoreModal from '@views/Competition/gameInfo/modal/gameInfoSameScore.vue'
import {
  bizContestList,
  bizContestProjectList,
  bizContestProjectStageList,
  bizPlayerFinalScoreFinalSportsList,
  bizPlayerFinalScoreFinalPdfListByTarget,
  qualificationScorePdfByGroup,
  getStagePlayerGroup
} from '@api/competition'
import { stageName } from '@views/Competition/projectPhase/projectPhase.config'
import { reportCardFinalColumns, reportCardStageColumns } from '@views/finalScore/reportCard/reportCard.config'
import { Time } from '@/utils'
import gameInfoReportCard from '@views/finalScore/reportCard/gameInfoReportCard.vue'
import gameInfoReportCardT from '@views/finalScore/reportCard/gameInfoReportCardT.vue'
import {  sameFinals } from '@api/competition'
export default {
  name: 'reportCard',
  components: {
    TreeCard,
    gameInfoReportCard,
    GameInfoSameScoreModal,
    gameInfoReportCardT,
  },
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true,
      },
      form: this.$form.createForm(this, {
        name: 'search',
      }),
      style: RealTimeViewTreeStyle,
      contestId: '',
      tree: '',
      treeList: [],
      list: [],
      data: [],
      query: {
        cproStageId: '',
      },
      group: 0,
      groupArray: [],
      title: '',
      stageArr: [],
      dataTitle: '',
      columns: reportCardStageColumns,
      scroll: {
        x: 1500,
      },
      rank: [],
      sgTimeStart: undefined,
      grouplenght: '',
      groupL:'',
    }
  },
  computed: {},
  watch: {
    $route: {
      handler() {
        this.$nextTick(() => {
          this.getTreeList()
          // this.$refs.query.init(RealTimeViewQueryPrint)
        })
      },
      deep: true,
      immediate: true,
      groupList: [],
      selectedRowKeys: [],
      selectionRows: [],
    },
  },
  created() {},
  methods: {
    // 分页
    handleTableChange(pagination) {
      this.pagination = pagination
      this.getList()
    },
    // 修改赛事
    handleContest() {
      this.getProjectList()
    },
    // 获取阶段
    getStage() {
      bizContestProjectStageList({
        cproId: this.tree,
        contestId: this.contestId,
      }).then((res) => {
        if (res.code === 200) {
          if (res.result.length) {
            const data = res.result.map((item) => {
              return {
                ...item,
                label: item.stageName,
                value: item.cproStageId,
              }
            })
            this.stageArr = data
            this.query.cproStageId = data[0].value || ''
            this.title = data[0].label || ''
            this.group = data[0].groupCount || 0
            this.getList()
          } else {
            this.stageArr = []
            this.query.cproStageId = ''
            this.title = ''
            this.group = 0
            // this.getList()
          }
        } else {
          this.$message.error(res.message)
        }
      })
      
     
    },
    // 获取项目
    getProjectList() {
      bizContestProjectList({
        contestId: this.contestId,
      }).then((res) => {
        // console.log(res)
        if (res.code === 200) {
          // 查询下拉框
          if (res.result.length) {
            const data = res.result.map((item) => {
              return {
                ...item,
                label: `${item.projectName} - ${item.projectGroup}`,
                value: item.cproId,
              }
            })
            this.tree = data[0].value
            this.list = data
          } else {
            this.tree = ''
            this.list = []
          }
          // 阶段
          this.getStage()
       
        }
      })
    },
    // 获取比赛信息
    getTreeList() {
      bizContestList({}).then((res) => {

        this.treeList = res.result
        this.contestId = res.result[0].contestId
        this.pagination.current = 1
        // 通过比赛获取左侧项目
        this.getProjectList()
      })
    },
    // 获取比赛成绩表头
    getColumns(total) {
      let children = []
      if (Array.isArray(total)) {
        for (let i = 0; i < total.length; i++) {
          children.push({
            // title: numToCapital((i + 1) * 10),
            title: total[i],
            align: 'center',
            dataIndex: `scoreList${i + 1}`,
          })
        }
      } else {
        for (let i = 0; i < total; i++) {
          children.push({
            // title: numToCapital((i + 1) * 10),
            title: (i + 1) * 10,
            align: 'center',
            dataIndex: `scoreList${i + 1}`,
          })
        }
      }
      this.columns = reportCardStageColumns.map((item) => {
        if (item.children) {
          return {
            ...item,
            children: children,
          }
        }
        return item
      })
    },
    // 获取列表
    getList() {
      const data = {
        ...this.query,
        // pageNum: this.pagination.current,
        // pageSize: this.pagination.pageSize,
        contestId: this.contestId,
        cproId: this.tree,
      }
      bizPlayerFinalScoreFinalSportsList(data).then((res) => {
        // includes("团体")
        if (res.code === 200) {
          this.rank = res.result.remark
          if (res.result.title.includes('团体')) {
            this.columns = reportCardFinalColumns
            this.data = res.result.data.map((item, i) => {
              return {
                ...item,
                i: i + 1,
              }
            })
          } else {
            // 组
            this.getColumns(res.result.shoots && res.result.shoots.length ? res.result.shoots : this.group)
            this.groupArray = res.result.shoots
            this.data = res.result.data.map((item, i) => {
              const obj = {}
              for (let k = 0; k < item.scoreList.length; k++) {
                obj['scoreList' + (k + 1)] = item.scoreList[k]
              }
              return {
                ...item,
                ...obj,
                i: i + 1,
              }
            })
          }
          this.dataTitle = res.result.title
          this.sgTimeStart = res.result.sgTimeStart
        } else {
        }
      })
    },
    // 左侧选中
    handleTreeChange(v) {
      this.getStage()
    },
   
    // 查询
    handleSubmit() {
      // console.log(this.query)
      this.getList()
    },
    // 重置
    handleReset() {
      this.query.cproStageId = this.stageArr[0].value
      this.getList()
    },
    // 资格
    bodyContent() {
      const contest = this.treeList.filter((item) => item.contestId === this.contestId)[0]
      const contestName = this.treeList.filter((item) => item.contestId === this.contestId)[0].contestName
      const label = this.list.filter((item) => item.value === this.tree)[0]
      const group = this.stageArr.filter((item) => this.dataTitle.includes(item.stageName))[0].groupCount
      // const stage = this.stageArr.filter(item => this.dataTitle.includes(item.stageName))[0]
      // console.log(label)
      const project = this.list.filter((item) => item.value === this.tree)[0]
      // console.log(contest)
      let g = 0
      if (this.groupArray && this.groupArray.length) {
        g = this.groupArray.length
      } else {
        g = group
      }

      const th = () => {
        const arr = []
        if (this.groupArray && this.groupArray.length) {
          for (const item of this.groupArray) {
            arr.push(`<th>${item}</th>`)
          }
          return arr.join('')
        }
        for (let i = 0; i < group; i++) {
          arr.push(`<th>${(i + 1) * 10}</th>`)
        }
        return arr.join('')
      }
      const datas = [...this.data /*  ...this.data, ...this.data, ...this.data, ...this.data */]
      let tr = []
      if (this.grouplenght > 1) {
        tr = datas.map((item, trIndex) => {
          const arr = []
          for (let i = 0; i < item.scoreList.length; i++) {
            arr.push(`<td style="">${item.scoreList[i]}</td>`)
          }
          if (item.integrationMethod === '2' || item.integrationMethod === '3') {
            return `<tr >
              <td style="" colspan="2">${item.i}</td>
              <td style="" colspan="2">${item.targetSiteStr}</td>
              <td style="" colspan="2">${item.playerName}</td>
              <td style=" text-align: left;" colspan="2">${item.groupName}</td>
              ${arr.join('')}
              <td style="" colspan="2">${item.stageTotal}-${item.goodTotal}x</td>
              <td style="" colspan="1">${item.remark ? item.remark : ''}</td>
            </tr>`
          } else {
            return `<tr >
              <td style="" colspan="2">${item.i}</td>
              <td style="" colspan="2">${item.targetSiteStr}</td>
              <td style=""colspan="2">${item.playerName}</td>
              <td style=""colspan="2">${item.groupName}</td>
              ${arr.join('')}
              <td style="" colspan="2">${item.stageTotal}</td>
              <td style="" colspan="1">${item.remark ? item.remark : ''}</td>
              </tr>`
          }
        })
      } else {
        tr = datas.map((item, trIndex) => {
          const arr = []
          for (let i = 0; i < item.scoreList.length; i++) {
            arr.push(`<td style="${item.i + 1 == 9 ? 'border-bottom: 1px solid #000;' : ''}">${item.scoreList[i]}</td>`)
          }
          if (item.integrationMethod === '2' || item.integrationMethod === '3') {
            return `<tr >
              <td style="${item.i + 1 == 9 ? 'border-bottom: 1px solid #000;' : ''}" colspan="2">${item.i}</td>
              <td style="${item.i + 1 == 9 ? 'border-bottom: 1px solid #000;' : ''}" colspan="2">${
              item.targetSiteStr
            }</td>
              <td style="${
                item.i + 1 == 9 ? 'border-bottom: 1px solid #000; text-align: left' : 'text-align: left;'
              }" colspan="2">${item.playerName}</td>
              <td style="${
                item.i + 1 == 9 ? 'border-bottom: 1px solid #000; text-align: left' : 'text-align: left;'
              }" colspan="2">${item.groupName}</td>
              ${arr.join('')}
              <td style="${item.i + 1 == 9 ? 'border-bottom: 1px solid #000;' : ''}" colspan="2">${item.stageTotal}-${
              item.goodTotal
            }x</td>
              <td style="${item.i + 1 == 9 ? 'border-bottom: 1px solid #000;' : ''}" colspan="1">${
              item.i <= 8 ? (!item.remark ? 'Q' : 'Q ' + item.remark) : item.remark ? item.remark : ''
            }</td>
            </tr>`
          } else {
            return `<tr >
              <td style="${item.i + 1 == 9 ? 'border-bottom: 1px solid #000;' : ''}" colspan="2">${item.i}</td>
              <td style="${item.i + 1 == 9 ? 'border-bottom: 1px solid #000;' : ''}" colspan="2">${
              item.targetSiteStr
            }</td>
              <td style="${
                item.i + 1 == 9 ? 'border-bottom: 1px solid #000; text-align: left' : 'text-align: left;'
              }" colspan="2">${item.playerName}</td>
              <td style="${
                item.i + 1 == 9 ? 'border-bottom: 1px solid #000; text-align: left' : 'text-align: left;'
              }" colspan="2">${item.groupName}</td>
              ${arr.join('')}
              <td style="${item.i + 1 == 9 ? 'border-bottom: 1px solid #000;' : ''}" colspan="2">${item.stageTotal}</td>
              <td style="${item.i + 1 == 9 ? 'border-bottom: 1px solid #000;' : ''}" colspan="1">${
              item.i <= 8 ? (!item.remark ? 'Q' : 'Q ' + item.remark) : item.remark ? item.remark : ''
            }</td>
              </tr>`
          }
        })
      }

      const imgs = window._CONFIG.printSponsorBottomImgs.map(
        (item, index) =>
          `<img src="../${item}" style="width: calc(${100 / window._CONFIG.printSponsorBottomImgs.length}% - ${
            6 * 2 * window._CONFIG.printSponsorBottomImgs.length
          }px); height: 2.8cm;margin: 0 6px"/>`
      )
      const img = imgs.length
        ? `<div class="foot" style="height: 2.8cm;padding-top: 20px;width: 100%;display: flex;justify-content: space-between">
            ${imgs.join('')}
          </div>`
        : ''
      const foot = () => {
        if (window._CONFIG.printSponsorBottomImgs.length) {
          return `<div class="foot" style="position: fixed;left: 0;width: 100%;bottom: 0;height: 5.5cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;height: 1.6cm">
                <div style="margin-bottom: 6px;font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 14px">${this.rank.join('，')}</div>
              </div>
            </div>
          </div>
        </div>`
        }

        if (tr.length > 32) {
          return `<div class="foot" style="position: fixed;left: 0px;width: 100%;bottom: 0;height: 2cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;">
                <div style="font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 12px">
                  ${this.rank.join('，')}
                </div>
              </div>
            </div>
          </div>
        </div>`
        } else {
          return `<div class="foot" style="position: fixed;left: 0px;width: 100%;bottom: 0;height: 2.6cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;">
                <div style="font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 12px">
                  ${this.rank.join('，')}
                </div>
              </div>
            </div>
          </div>
        </div>`
        }
      }
      const pages = []
      // <img src="${ process.env.NODE_ENV === 'electron' ? window._CONFIG.zbfLogo : '../' + window._CONFIG.zbfLogo }" style="position: absolute;top: 0;left: 0;right: 0;width: 20%" alt="">
      pages.push(`
<div">
                    <h2 style="font-size: 20px;text-align: center;">${contestName}</h2>
                    <h3 style="text-align: center;">
                      ${label.projectGroup}${label.projectName}
                    </h3>
                    <h4 style="text-align: center">资格赛</h4>
                    <p style="text-align: center">${contest.location}</p>
                    <p style="text-align: center;">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(
        project.projectTimeStart,
        'HH:mm'
      )}</p>
                  </div>

          <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;font-size:14px;">
            <thead>
              <!-- <tr >
                <th colspan='${11 + g}' rowspan='1' style='border: 0;'>
                    <h2 style="font-size: 20px;text-align: center;margin-top: 60px;">${contestName}</h2>
                    <h3 style="text-align: center;padding: 0;">${label.projectGroup}${label.projectName}</h3>
                    <h4 style="text-align: center">资格赛</h4>
                    <p style="text-align: center">${contest.location}</p>
                    <p style="text-align: center;">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(
        project.projectTimeStart,
        'HH:mm'
      )}</p>
                </th>
              </tr> -->
              <tr>
                <th rowspan="2" colspan="2">排名</th>
                <th rowspan="2" colspan="2">靶位</th>
                <th rowspan="2" colspan="2" style="text-align: left">姓名</th>
                <th rowspan="2" colspan="2" style="text-align: left">代表队</th>
                <th colspan="${g}">组</th>
                <th rowspan="2" colspan="2">总计</th>
                <th rowspan="2">备注</th>
              </tr>
              <tr>${th()}</tr>
            </thead>
            <tbody> ${tr.slice(0, 40).join('')}</tbody>
            <tfoot>
              <tr style="margin-top: 1cm">
                <td colspan="${g + 7}" style="height: 4cm; margin-top: 20px"></td>
              </tr>
            </tfoot>
          </table>
        `)
      if (tr.length > 40) {
        // <img src=" ${ process.env.NODE_ENV === 'electron' ? window._CONFIG.zbfLogo : '../' + window._CONFIG.zbfLogo }" style="position: absolute;top: 0;left: 0;right: 0;width: 20%" alt="">
        pages.push(`
          <div style="position: relative;overflow: hidden;">
            <h2 style="font-size: 20px;text-align: center;margin-top: 80px;">${contestName}</h2>
            <h3 style="text-align: center;padding: 0;">
              ${label.projectGroup}${label.projectName}
            </h3>
            <h3 style="text-align: center">资格赛</h4>
            <p style="text-align: center">${contest.location}</p>
            <p style="text-align: center;margin-bottom: 1cm">${Time(
              project.projectTimeStart,
              'YYYY/MM/DD'
            )}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
          </div>
          <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;font-size:14px;">
            <thead>
              <tr>
                <th rowspan="2" colspan="2">排名</th>
                <th rowspan="2" colspan="2">靶位</th>
                <th rowspan="2" colspan="2" style="text-align: left; font-weight: 800;">姓名</th>
                <th rowspan="2" colspan="2" style="text-align: left; font-weight: 800;">代表队</th>
                <th colspan="${g}">组</th>
                <th rowspan="2" colspan="2">总计</th>
                <th rowspan="2">备注</th>
              </tr>
              <tr>${th()}</tr>
            </thead>
            <tbody> ${tr.slice(40, tr.length).join('')} </tbody>
            <tfoot>
              <tr style="margin-top: 1cm">
                <td colspan="${g + 7}" style="height: 4cm; margin-top: 20px"></td>
              </tr>
            </tfoot>
          </table>
        `)
      }
      // <h3 style="text-align: center">资格赛</h3>
      // <p style="text-align: center">${contest.location}</p>

      return `
      <style>
        td{text-align: center}
        th{border: 1px solid;}
        @media print {
          @page{
            margin-top: 2cm;
            margin-bottom: 0cm;
          }
        }
        td:nth-of-type(4){
          text-align: left;
          /*text-indent: 4rem*/
        }
        td:nth-of-type(3){
          text-align: left;
          /*text-indent: 4rem*/
        }
        td:last-of-type{
         /*text-align: left;*/
        }
        th{
          font-weight: 800;
        }
        h1,h2,h3,h4,p{
          margin: 0;
          padding: 0;
        }
      </style>
      <div>
        ${pages.join('')}
        ${foot()}
      </div>`
    },
    // 资格2 靶位排名
    bodyContent2() {
      const contest = this.treeList.filter((item) => item.contestId === this.contestId)[0]
      const contestName = this.treeList.filter((item) => item.contestId === this.contestId)[0].contestName
      const label = this.list.filter((item) => item.value === this.tree)[0]
      const group = this.stageArr.filter((item) => this.dataTitle.includes(item.stageName))[0].groupCount
      // const stage = this.stageArr.filter(item => this.dataTitle.includes(item.stageName))[0]
      // console.log(label)
      const project = this.list.filter((item) => item.value === this.tree)[0]
      // console.log(contest)
      let g = 0
      if (this.groupArray && this.groupArray.length) {
        g = this.groupArray.length
      } else {
        g = group
      }

      const th = () => {
        const arr = []
        if (this.groupArray && this.groupArray.length) {
          for (const item of this.groupArray) {
            arr.push(`<th>${item}</th>`)
          }
          return arr.join('')
        }
        for (let i = 0; i < group; i++) {
          arr.push(`<th>${(i + 1) * 10}</th>`)
        }
        return arr.join('')
      }
      const datas = [...this.data /*  ...this.data, ...this.data, ...this.data, ...this.data */]
      const tr = datas.map((item, trIndex) => {
        const arr = []
        for (let i = 0; i < item.scoreList.length; i++) {
          arr.push(`<td>${item.scoreList[i]}</td>`)
        }
        if (item.integrationMethod === '2' || item.integrationMethod === '3') {
          return `<tr >
              <td colspan="2">${item.i}</td>
              <td colspan="2">${item.targetSiteStr}</td>
              <td style="text-align: left;" colspan="2">${item.playerName}</td>
              <td style="text-align: left;" colspan="2">${item.groupName}</td>
              ${arr.join('')}
              <td colspan="2">${item.stageTotal}-${item.goodTotal}x</td>
              <td colspan="1">${item.remark ? item.remark : ''}</td>
            </tr>`
        } else {
          return `<tr >
              <td colspan="2">${item.i}</td>
              <td colspan="2">${item.targetSiteStr}</td>
              <td style="text-align: left" colspan="2">${item.playerName}</td>
              <td style="text-align: left;" colspan="2">${item.groupName}</td>
              ${arr.join('')}
              <td colspan="2">${item.stageTotal}</td>
              <td colspan="1">${item.remark ? item.remark : ''}</td>
              </tr>`
        }
      })

      const imgs = window._CONFIG.printSponsorBottomImgs.map(
        (item, index) =>
          `<img src="../${item}" style="width: calc(${100 / window._CONFIG.printSponsorBottomImgs.length}% - ${
            6 * 2 * window._CONFIG.printSponsorBottomImgs.length
          }px); height: 2.8cm;margin: 0 6px"/>`
      )
      const img = imgs.length
        ? `<div class="foot" style="height: 2.8cm;padding-top: 20px;width: 100%;display: flex;justify-content: space-between">
            ${imgs.join('')}
          </div>`
        : ''
      const foot = () => {
        if (window._CONFIG.printSponsorBottomImgs.length) {
          return `<div class="foot" style="position: fixed;left: 0;width: 100%;bottom: 0;height: 5.5cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;height: 1.6cm">
                <div style="margin-bottom: 6px;font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 14px">${this.rank.join('，')}</div>
              </div>
            </div>
          </div>
        </div>`
        }

        if (tr.length > 32) {
          return `<div class="foot" style="position: fixed;left: 0px;width: 100%;bottom: 0;height: 2cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;">
                <div style="font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 12px">
                  ${this.rank.join('，')}
                </div>
              </div>
            </div>
          </div>
        </div>`
        } else {
          return `<div class="foot" style="position: fixed;left: 0px;width: 100%;bottom: 0;height: 2.6cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;">
                <div style="font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 12px">
                  ${this.rank.join('，')}
                </div>
              </div>
            </div>
          </div>
        </div>`
        }
      }
      const pages = []
      // <img src="${ process.env.NODE_ENV === 'electron' ? window._CONFIG.zbfLogo : '../' + window._CONFIG.zbfLogo }" style="position: absolute;top: 0;left: 0;right: 0;width: 20%" alt="">
      pages.push(`
<div">
                    <h2 style="font-size: 20px;text-align: center;">${contestName}</h2>
                    <h3 style="text-align: center;">
                      ${label.projectGroup}${label.projectName}
                    </h3>
                    <h4 style="text-align: center">资格赛</h4>
                    <p style="text-align: center">${contest.location}</p>
                    <p style="text-align: center;">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(
        project.projectTimeStart,
        'HH:mm'
      )}</p>
                  </div>

          <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;font-size:14px;">
            <thead>
              <!-- <tr >
                <th colspan='${11 + g}' rowspan='1' style='border: 0;'>
                    <h2 style="font-size: 20px;text-align: center;margin-top: 60px;">${contestName}</h2>
                    <h3 style="text-align: center;padding: 0;">${label.projectGroup}${label.projectName}</h3>
                    <h4 style="text-align: center">资格赛</h4>
                    <p style="text-align: center">${contest.location}</p>
                    <p style="text-align: center;">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(
        project.projectTimeStart,
        'HH:mm'
      )}</p>
                </th>
              </tr> -->
              <tr>
                <th rowspan="2" colspan="2">排名</th>
                <th rowspan="2" colspan="2">靶位</th>
                <th rowspan="2" colspan="2" style="text-align: left">姓名</th>
                <th rowspan="2" colspan="2" style="text-align: left">代表队</th>
                <th colspan="${g}">组</th>
                <th rowspan="2" colspan="2">总计</th>
                <th rowspan="2">备注</th>
              </tr>
              <tr>${th()}</tr>
            </thead>
            <tbody> ${tr.slice(0, 40).join('')}</tbody>
            <tfoot>
              <tr style="margin-top: 1cm">
                <td colspan="${g + 7}" style="height: 4cm; margin-top: 20px"></td>
              </tr>
            </tfoot>
          </table>
        `)
      if (tr.length > 40) {
        // <img src=" ${ process.env.NODE_ENV === 'electron' ? window._CONFIG.zbfLogo : '../' + window._CONFIG.zbfLogo }" style="position: absolute;top: 0;left: 0;right: 0;width: 20%" alt="">
        pages.push(`
          <div style="position: relative;overflow: hidden;">
            <h2 style="font-size: 20px;text-align: center;margin-top: 80px;">${contestName}</h2>
            <h3 style="text-align: center;padding: 0;">
              ${label.projectGroup}${label.projectName}
            </h3>
            <h3 style="text-align: center">资格赛</h4>
            <p style="text-align: center">${contest.location}</p>
            <p style="text-align: center;margin-bottom: 1cm">${Time(
              project.projectTimeStart,
              'YYYY/MM/DD'
            )}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
          </div>
          <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;font-size:14px;">
            <thead>
              <tr>
                <th rowspan="2" colspan="2">排名</th>
                <th rowspan="2" colspan="2">靶位</th>
                <th rowspan="2" colspan="2" style="text-align: left; font-weight: 800;">姓名</th>
                <th rowspan="2" colspan="2" style="text-align: left; font-weight: 800;">代表队</th>
                <th colspan="${g}">组</th>
                <th rowspan="2" colspan="2">总计</th>
                <th rowspan="2">备注</th>
              </tr>
              <tr>${th()}</tr>
            </thead>
            <tbody> ${tr.slice(40, tr.length).join('')} </tbody>
            <tfoot>
              <tr style="margin-top: 1cm">
                <td colspan="${g + 7}" style="height: 4cm; margin-top: 20px"></td>
              </tr>
            </tfoot>
          </table>
        `)
      }
      // <h3 style="text-align: center">资格赛</h3>
      // <p style="text-align: center">${contest.location}</p>

      return `
      <style>
        td{text-align: center}
        th{border: 1px solid;}
        @media print {
          @page{
            margin-top: 2cm;
            margin-bottom: 0cm;
          }
        }
        td:nth-of-type(4){
          text-align: left;
          /*text-indent: 4rem*/
        }
        td:nth-of-type(3){
          text-align: left;
          /*text-indent: 4rem*/
        }
        td:last-of-type{
         /*text-align: left;*/
        }
        th{
          font-weight: 800;
        }
        h1,h2,h3,h4,p{
          margin: 0;
          padding: 0;
        }
      </style>
      <div>
        ${pages.join('')}
        ${foot()}
      </div>`
    },
    // 混团
    groupContent() {
      const contest = this.treeList.filter((item) => item.contestId === this.contestId)[0]
      const contestName = this.treeList.filter((item) => item.contestId === this.contestId)[0].contestName
      const label = this.list.filter((item) => item.value === this.tree)[0]
      const j = this.data.filter((item) => item.stageGroup === 1)
      const y = this.data.filter((item) => item.stageGroup === 2)
      const project = this.list.filter((item) => item.value === this.tree)[0]
      const foot = () => {
        return `<div class="foot" style="position: fixed;left: 0;width: 100%;bottom: 0;height: 4cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;display:flex;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;">
                <div style="margin-bottom: 6px;font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 14px;margin-left:5px;">${this.rank.join('，')}</div>
              </div>
            </div>
          </div>
        </div>`
      }
      const jtr = () => {
        return j
          .map((item, k) => {
            return `
            <tr>
              <td style="font-family: 微软雅黑;font-weight: 700;"">${item.i}</td>
              <td style="text-align: left;">${item.groupName}</td>
              <td style="font-family: 微软雅黑;font-weight: 700;">${item.total}</td>
              <td style="font-family: 微软雅黑;font-weight: 700;">${item.stageTotal}</td>
              <td style="width:150px;"><span>${
                k === 0 ? '金牌' + '&nbsp;' : k === 1 ? '银牌' + '&nbsp;' : ''
              }</span><span>${item.remark ? item.remark + '&nbsp;' : ''}</span></td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player2Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player1Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `
          })
          .join('')
      }
      const ytr = () => {
        return y
          .map((item, k) => {
            return `
            <tr>
              <td style="font-family: 微软雅黑;font-weight: 700;">${item.i}</td>
              <td style="text-align: left;">${item.groupName}</td>
              <td style="font-family: 微软雅黑;font-weight: 700;">${item.total}</td>
              <td style="font-family: 微软雅黑;font-weight: 700;">${item.stageTotal}</td>
              <td style="width:150px;"><span>${k === 0 ? '铜牌' + '&nbsp;' : ''}</span><span>${
              item.remark ? item.remark + '&nbsp;' : ''
            }</span></td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player2Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player1Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `
          })
          .join('')
      }

      const jdiv = j.length
        ? `<h4>金牌赛</h4>
            <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
              <thead>
                <tr>
                  <th>排名</th>
                  <th style="text-align: left;width: 300px;">姓名</th>
                  <th>总分</th>
                  <th>总环数</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                ${jtr()}
              </tbody>              
            </table>`
        : ''
      const ydiv = y.length
        ? `<h4>铜牌赛</h4>
            <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
              <thead>
                <tr>
                  <th>排名</th>
                  <th style="text-align: left;width: 300px;">姓名</th>
                  <th>总分</th>
                  <th>总环数</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                ${ytr()}
              </tbody>
             
            </table>`
        : ''
      const imgs = window._CONFIG.printSponsorBottomImgs.map(
        (item, index) =>
          `<img src="../${item}" style="width: calc(${100 / window._CONFIG.printSponsorBottomImgs.length}% - ${
            6 * 2 * window._CONFIG.printSponsorBottomImgs.length
          }px); height: 2.5cm;margin: 0 6px"/>`
      )
      return `
        <style> @media print {
          @page{
            margin-top: 2cm;
            margin-bottom: 0cm;
          }
        }td{text-align: center}th{border: 1px solid;}body{height: 80vh;margin: 0;padding: 0;}</style>
        <div>
          <div style="height: 90vh">
            <div style="position: relative;ovflow: hidden;">
              <h1 style="text-align: center; font-size: 24px;margin-top: 100px;">${contestName}</h1>
              <h2 style="text-align: center">${label.label.split('-').reverse().join('')}</h2>
              <h3 style="text-align: center">奖牌赛</h3>
              <p style="text-align: center">${contest.location}</p>
              <p style="text-align: center;margin-bottom: 1cm">${Time(
                project.projectTimeStart,
                'YYYY/MM/DD'
              )}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
            </div>
            <div>
              ${jdiv}
              <br/>
              ${ydiv}
            </div>
          </div>
           ${foot()}
        </div>
      `
    },
    // 决赛 || 淘汰赛
    content() {
      const contestName = this.treeList.filter((item) => item.contestId === this.contestId)[0].contestName
      const label = this.list.filter((item) => item.value === this.tree)[0]
      const group = this.stageArr.filter((item) => this.dataTitle.includes(item.stageName))[0].groupCount
      const project = this.list.filter((item) => item.value === this.tree)[0]
      let g = 0
      // console.log(this.stageArr.filter((item) => this.dataTitle.includes(item.stageName)), 123456)
      // console.log(this.groupArray)
      if (this.groupArray && this.groupArray.length) {
        g = this.groupArray.length
      } else {
        g = group
      }
      const th = () => {
        const arr = []
        if (this.groupArray && this.groupArray.length) {
          for (const item of this.groupArray) {
            arr.push(`<th >${item}</th>`)
          }
          return arr.join('')
        }
        for (let i = 0; i < group; i++) {
          arr.push(`<th>${(i + 1) * 10}</th>`)
        }
        return arr.join('')
      }
      const tr = this.data.map((item) => {
        const arr = []

        for (let i = 0; i < this.groupArray.length; i++) {
          arr.push(
            `<td style="font-family: 微软雅黑;font-weight: 700;font-size:14px;"><b>${item.scoreList[i] || ''}</b></td>`
          )
        }
        // console.log(arr)
        const list = this.groupArray && this.groupArray.length ? this.groupArray : []
        const array = []
        // console.log(list)
        if (list.length) {
          for (let i = 0; i < list.length; i++) {
            if (i === 0) {
              array.push({
                value: list[i],
                arr: item.detailScoreList.slice(0, list[i]),
              })
            } else {
              array.push({
                value: list[i],
                arr: item.detailScoreList.slice(list[i - 1], list[i]),
              })
            }
          }
        }
        // shoots
        // console.log(array)
        // 最大多少行
        const trs = Math.max(...array.map((i) => i.arr.length))
        const rows = []
        for (let i = 0; i < trs; i++) {
          const j = []
          for (const k of array) {
            // console.log(k,  k.arr[i] )
            j.push(`<td style="font-size: 12px">${k.arr[i] ? parseFloat(k.arr[i].score).toFixed(1) : ''}</td>`)
          }
          // console.log(j)
          // console.log(j)
          rows.push(`
            <tr>
              <td style="font-size: 12px" colspan="2"></td>
<!--              <td style="font-size: 12px;" colspan="2"></td>-->
              <td style="font-size: 12px;" colspan="2"></td>
              <td style="font-size: 12px;" colspan="2"></td>
              ${j.join('')}
              <td style="font-size: 12px;" colspan="2"></td>
              <td style="font-size: 12px;"></td>
            </tr>
          `)
        }

        // console.log(rows)
        // console.log(tr())
        // console.log(rows)
        //  <td colspan="2">${item.targetSite}</td>
        return `
          <tr>
            <td colspan="2" style="line-height:25px;text-align: center;">${item.i}</td>

            <td colspan="2" style="line-height: 25px;text-align: left;">${item.playerName}</td>
            <td colspan="2" style="line-height: 25px;text-align: left;">${item.groupName}</td>
            ${arr.join('')}
            <td colspan="2" style="font-family: 微软雅黑;font-weight: 700;"><b>${item.stageTotal}</b></td>
            <td colspan="2" style="font-family: 微软雅黑;font-weight: 700;">${item.remark ? item.remark : ''}</td>
          </tr>
          ${rows.join('')}
        `
      })

      const imgs = window._CONFIG.printSponsorBottomImgs.map(
        (item, index) =>
          `<img src="${item}" style="width: calc(${100 / window._CONFIG.printSponsorBottomImgs.length}% - ${
            6 * 2 * window._CONFIG.printSponsorBottomImgs.length
          }px); height: 2.8cm;margin: 0 6px"/>`
      )
      // console.log(imgs)
      const img = imgs.length
        ? `<div class="foot" style="height: 2.8cm;padding-top: 20px;width: 100%;display: flex;justify-content: space-between">
            ${imgs.join('')}
          </div>`
        : ''

      const foot = () => {
        if (window._CONFIG.printSponsorBottomImgs.length) {
          return `<div class="foot" style="position: fixed;left: 0;width: 100%;bottom: 0;height: 5.5cm">
          <div class="footer" style="width: 100%;">
            <div style="width: 100%;border: 0px solid;height: 2cm">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;height: 1.6cm">
                <div style="margin-bottom: 6px;font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 14px">${this.rank.join('，')}</div>
              </div>
            </div>
          </div>
        </div>`
        }
        return `<div class="foot" style="position: fixed;left: 0px;width: 100%;bottom: 0px;height: 1cm">

          <div style="width: 100%;" class="footer">
            <div style="width: 100%;border: 0px solid;">
              <div style="width: 100%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px;">
                <div style="margin-bottom: 6px;font-size: 14px">备注</div>
                <div style="color: #595656;font-size: 14px">
                  ${this.rank.join('，')}
                </div>
              </div>
            </div>
          </div>
        </div>`
      }

      const pages = []

      const p = this.sgTimeStart
        ? `<p style="text-align: center;">${Time(this.sgTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(
            this.sgTimeStart,
            'HH:mm'
          )}</p>`
        : '<p></p>'
      pages.push(`
           <div style=';height: 100vh'>
            <div style="position: relative;overflow: hidden">
          <div ">
            <h2 style="text-align: center;font-size: 20px;">${contestName}</h2>
            <h3 style="text-align: center">${this.dataTitle}成绩</h3>
            <h4 style="text-align: center">
              ${label.projectGroup}${label.projectName}
            </h4>
            ${p}
          </div>
        </div>
        <table class="table" align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
          <thead>
            <tr style="">
              <th rowspan="2" colspan="2">排名</th>
<!--              <th rowspan="2" colspan="2">靶位</th>-->
              <th rowspan="2" colspan="2" style='width: 60px'>姓名</th>
              <th rowspan="2" colspan="2" style='width: 290px'>代表队</th>
              <th colspan="${g}">组</th>
              <th rowspan="2" colspan="2">总计</th>
              <th rowspan="2">备注</th>
            </tr>
            <tr>${th()}</tr>
          </thead>
          <tbody>${tr.slice(0, 8).join('')}
          </tbody>

          <tfoot>
            <tr style="margin-top: 1cm">
              <td colspan="${g + 7}" style=" margin-top: 20px">

              </td>
            </tr>
          </tfoot>
        </table>
</div>
        `)
      //       if (tr.length > 3) {
      //         pages.push(`
      // <div style='height: 90vh'>
      //  <div style="position: relative;overflow: hidden">
      //           <div ">
      //             <h1 style="text-align: center;font-size: 24px;">${contestName}</h1>
      //             <h2 style="text-align: center">${this.dataTitle}成绩</h2>
      //             <h3 style="text-align: center">
      //               ${label.projectGroup}${label.projectName}
      //             </h3>
      //             ${p}
      //           </div>
      //         </div>
      //         <table class="table" align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
      //           <thead>
      //             <tr style="padding-bottom: 1cm">
      //               <th rowspan="2" colspan="2">排名</th>
      // <!--              <th rowspan="2" colspan="2">靶位</th>-->
      //               <th rowspan="2" colspan="2" style='width: 60px'>姓名</th>
      //               <th rowspan="2" colspan="2" style='width: 290px'>代表队</th>
      //               <th colspan="${g}">组</th>
      //               <th rowspan="2" colspan="2">总计</th>
      //               <th rowspan="2">备注</th>
      //             </tr>
      //             <tr>${th()}</tr>
      //           </thead>
      //           <tbody>${tr.slice(4, tr.length).join('')}
      //           </tbody>

      //           <tfoot>
      //             <tr style="margin-top: 1cm">
      //               <td colspan="${g + 7}" style=" margin-top: 20px">

      //               </td>
      //             </tr>
      //           </tfoot>
      //         </table>
      // </div>

      //         `)
      //       }
      return `
      <style>
        td{text-align: center;font-size:14px;}
        th{border: 1px solid;font-size:14px;}
        html,body{margin: 0 !important;
        padding: 0 !important;
          }
        tfoot>tr>td{
          height: 1cm;
        }
        @media print {
          size: A4;
          @page{
            margin: 0;
            margin-bottom: 0cm;
            @top-center {
              content: "";
            }
            @bottom-center {
              content: "";
            }
          }
        }
        ::-webkit-scrollbar {
      display: none;
    }
        h1,h2,h3,h4,p{
          margin: 0;
          padding: 0;
        }
      </style>
        <div>
        ${pages.join('')}
        ${foot()}
      </div>`
    },
    // 普通成绩打印
    handlePrint() {
      const data = {
        ...this.query,
        // pageNum: this.pagination.current,
        // pageSize: this.pagination.pageSize,
        contestId: this.contestId,
        cproId: this.tree,
      }
      
        bizPlayerFinalScoreFinalSportsList(data).then((res) => {
          // includes("团体")
          if (res.code === 200) {
            this.rank = res.result.remark
            if (res.result.title.includes('团体')) {
              this.columns = reportCardFinalColumns
              this.data = res.result.data.map((item, i) => {
                return {
                  ...item,
                  i: i + 1,
                }
              })
            } else {
              // 组
              this.getColumns(res.result.shoots && res.result.shoots.length ? res.result.shoots : this.group)
              this.groupArray = res.result.shoots
              this.data = res.result.data.map((item, i) => {
                const obj = {}
                for (let k = 0; k < item.scoreList.length; k++) {
                  obj['scoreList' + (k + 1)] = item.scoreList[k]
                }
                return {
                  ...item,
                  ...obj,
                  i: i + 1,
                }
              })
            }
            this.dataTitle = res.result.title
            this.sgTimeStart = res.result.sgTimeStart
            this.$nextTick(() => {
              this.getHandelPrint()
            })
          } else {
          }
        })
    },
    //分组打印
    handleGroupPrint(){
      this.groupList = []
      const row = {
        contestId: this.contestId, //赛事id
        cproId: this.tree, //赛事项目id
        stageId: this.query.cproStageId, //项目阶段id
      }
      getStagePlayerGroup(row).then((res) => {
          if (res.success) {
            this.groupList = res.result
            this.grouplenght = this.groupList.length
            if (this.groupList.length > 1) {
              this.$refs.oReportCardT.init(row)
            } else {
              let stageGroup = {
                group: 1,
              }
              this.remarkSuccessHandleT(stageGroup)
            }
          }
        })
    },
    //资格赛打印分组回调
    remarkSuccessHandleT(e) {
      const data = {
        ...this.query,
        // pageNum: this.pagination.current,
        // pageSize: this.pagination.pageSize,
        contestId: this.contestId,
        cproId: this.tree,
        // stageGroup: this.stageGroup,
        stageGroup: e.group,
      }
      qualificationScorePdfByGroup(data).then((res) => {
        // includes("团体")
        if (res.code === 200) {
          this.rank = res.result.remark
          if (res.result.title.includes('团体')) {
            this.columns = reportCardFinalColumns
            this.data = res.result.data.map((item, i) => {
              return {
                ...item,
                i: i + 1,
              }
            })
          } else {
            // 组
            this.getColumns(res.result.shoots && res.result.shoots.length ? res.result.shoots : this.group)
            this.groupArray = res.result.shoots
            this.data = res.result.data.map((item, i) => {
              const obj = {}
              for (let k = 0; k < item.scoreList.length; k++) {
                obj['scoreList' + (k + 1)] = item.scoreList[k]
              }
              return {
                ...item,
                ...obj,
                i: i + 1,
              }
            })
          }
          this.dataTitle = res.result.title
          this.sgTimeStart = res.result.sgTimeStart
          this.$nextTick(() => {
            this.getHandelPrint()
          })
        } else {
        }
      })
    },
    // 靶位打印
    handlePrintTargetSite() {
      this.groupList = []
      const row = {
        contestId: this.contestId, //赛事id
        cproId: this.tree, //赛事项目id
        stageId: this.query.cproStageId, //项目阶段id
      }
      getStagePlayerGroup(row).then((res) => {
        console.log(res, 'res')
        if (res.success) {
          this.groupList = res.result
          if (this.groupList.length > 1) {
            this.$refs.oReportCard.init(row)
          } else {
            let stageGroup = {
              group: 1,
            }
            this.remarkSuccessHandle(stageGroup)
          }
        }
      })
    },
    // 回调
    remarkSuccessHandle(e) {
      const data = {
        ...this.query,
        // pageNum: this.pagination.current,
        // pageSize: this.pagination.pageSize,
        contestId: this.contestId,
        cproId: this.tree,
        // stageGroup: this.stageGroup,
        stageGroup: e.group,
      }
      bizPlayerFinalScoreFinalPdfListByTarget(data).then((res) => {
        console.log(res, '63622!!')
        // includes("团体")
        if (res.code === 200) {
          this.rank = res.result.remark
          if (res.result.title.includes('团体')) {
            this.columns = reportCardFinalColumns
            this.data = res.result.data.map((item, i) => {
              return {
                ...item,
                i: i + 1,
              }
            })
          } else {
            // 组
            this.getColumns(res.result.shoots && res.result.shoots.length ? res.result.shoots : this.group)
            this.groupArray = res.result.shoots
            this.data = res.result.data.map((item, i) => {
              const obj = {}
              for (let k = 0; k < item.scoreList.length; k++) {
                obj['scoreList' + (k + 1)] = item.scoreList[k]
              }
              return {
                ...item,
                ...obj,
                i: i + 1,
              }
            })
          }
          this.dataTitle = res.result.title
          this.sgTimeStart = res.result.sgTimeStart
          const e = 1
          this.getHandelPrint(e)
        } else {
        }
      })
    },
    // 打印弹窗
    getHandelPrint(i) {
      // console.log(123,this.dataTitle,i)
      const print = (fn) => {
        const title = this.dataTitle
        const iframe = document.createElement('iframe')
        document.body.appendChild(iframe)
        iframe.contentWindow.document.open()
        iframe.contentWindow.document.write(fn)
        iframe.width = '100%'
        iframe.height = '800px'
        iframe.contentWindow.addEventListener('beforeprint', () => {
          function getNumberOfPages() {
            // A4纸高度
            const totalHeight = 1123
            const foot = iframe.contentDocument.querySelector('.foot')
            const body = iframe.contentDocument.body.scrollHeight
            const pageHeight = body + foot.scrollHeight
            const pageCount = Math.ceil(pageHeight / totalHeight)
            console.log(title)
            // 显示
            if (pageCount === 1) {
            }
            // 隐藏 追加
            else {
              const footer = iframe.contentDocument.querySelector('.footer')
              const newfooter = iframe.contentDocument.createElement('div')
              newfooter.innerHTML = footer.innerHTML
              if (title.includes('决赛')) {
                // 判断低图是否有
                // if (window._CONFIG.printSponsorBottomImgs.length) {
                //   newfooter.style.marginTop =
                //     totalHeight * pageCount - (body + foot.scrollHeight + foot.scrollHeight + foot
                //       .scrollHeight) + 'px'
                //   newfooter.style.marginBottom = foot.scrollHeight / 2 + 'px'
                // } else {
                //   newfooter.style.marginTop =
                //     totalHeight * pageCount -
                //     (body + foot.scrollHeight + foot.scrollHeight + foot.scrollHeight + 20) +
                //     'px'
                //   // newfooter.style.marginBottom = foot.scrollHeight / 2 + 'px'
                // }
              }
              // 资格赛
              else {
                console.log(totalHeight, pageCount, foot.scrollHeight)
                console.log(foot.scrollHeight * pageCount * 3)
                if (window._CONFIG.printSponsorBottomImgs.length) {
                  newfooter.style.marginTop =
                    totalHeight * pageCount - (body + foot.scrollHeight + foot.scrollHeight / 2) + 'px'
                  newfooter.style.marginBottom = foot.scrollHeight / 2 + 'px'
                } else {
                  // newfooter.style.marginTop = '450px'
                  newfooter.style.marginTop = foot.scrollHeight * pageCount + 'px'
                }
              }
              // console.log(newfooter)
              footer.style.visibility = 'hidden'
              iframe.contentDocument.body.append(newfooter)
            }
          }
          // if (!title.includes('团体')) {
          getNumberOfPages()
          // }
        })
        iframe.contentWindow.addEventListener('afterprint', () => {
          document.body.removeChild(iframe)
        })
        setTimeout(() => {
          iframe.contentWindow.print()
          iframe.contentWindow.document.close()
          document.body.removeChild(iframe)
        }, 50)
      }
      if (this.dataTitle.includes('团体')) {
        print(this.groupContent())
      } else {
        if (this.dataTitle.includes('决赛') || this.dataTitle.includes('淘汰赛')) {
          print(this.content())
        } else {
          // 资格赛
          if (i === 1) {
            print(this.bodyContent2())
          } else {
            print(this.bodyContent())
          }
        }
      }
    },
    // 导出
    handleExport() {
      const stage = stageName.filter((item) => this.dataTitle.includes(item.value))[0]
      const parser = new DOMParser()
      let htmlDoc
      switch (stage.id) {
        case 0:
          // htmlDoc = parser.parseFromString(this.bodyContent(), 'text/html');
          htmlDoc = this.bodyContent()
          break
        case 1:
          htmlDoc = this.content()
          // htmlDoc = parser.parseFromString(this.content(), 'text/html');
          break
        case 2:
          htmlDoc = this.groupContent()
          // htmlDoc = parser.parseFromString(this.groupContent(), 'text/html');
          break
      }
      // const iframe= document.createElement("iframe");
      // document.body.appendChild(iframe);
      // iframe.contentWindow.document.open();
      // iframe.contentWindow.document.write(htmlDoc);
      // iframe.contentWindow.document.close();
      // html2canvas(iframe.contentWindow.document.body).then(function(canvas) {
      //   const pdf = new jsPDF(undefined, 'pt', 'a4');
      //   pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, pdf.internal.pageSize.width, canvas.height * pdf.internal.pageSize.width / canvas.width);
      //   console.log(pdf)
      //   pdf.save('example.pdf');
      //   document.body.removeChild(iframe)
      // });
    },
    // 获取阶段名字
    handleStageChange(v) {
      const a = this.stageArr.filter((item) => item.value === v)[0]
      this.title = a.label
      this.group = a.groupCount
      
    },
    //可编辑结尾
    rowClassName(r, i) {
      if (r.sameStatus == 1) {
        return 'tongfen'
      }
    },
    /**
     * 同分
     */
    handleSameScore() {
      if (this.selectedRowKeys.length < 2) {
        return this.$message.error('至少选中两名参赛选手!')
      }
      this.$refs.sameScore.init(this.selectionRows)
    },
    sameScoreSuccessHandle(data) {
      sameFinals({
        ...data,
        stageId: this.query.cproStageId,
      }).then((res) => {
        if (res.success) {
          this.$message.success('同分操作成功！')
          this.getTableList()
          this.$refs.sameScore.handleCancel()
          this.selectedRowKeys = []
          this.selectionRows = []
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.selectionRows = selectedRows
        },
      }
    },
  },
}
</script>

<style scoped lang="less">
@btnHeight: 50px;

/deep/.tongfen {
  background: rgba(252, 241, 87, 0.3);
}
.RealTimeView {
  height: 100%;
  overflow-y: hidden;

  /deep/.treeCard[data-v-1f5a15ad] .ant-card-body {
    height: 100%;
    overflow-y: auto;
  }

  .btns {
    height: @btnHeight;
    background: #fff;
    margin-bottom: 10px;
    line-height: @btnHeight;
    overflow: hidden;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    justify-content: space-between;

    /deep/.ant-page-header-heading {
      display: flex;
      align-items: center;
    }
  }

  .cards {
    height: calc(100% - @btnHeight - 10px);
  }
}
</style>