<template>
  <div class="RealTimeView">
    <div class="btns">
      <a-select
        :placeholder="treeList.length && '请选择赛事' || '请先创建赛事'"
        style="width: 300px"
        v-model="contestId"
        @change="handleContest"
      >
        <a-select-option
          v-for="(item, i) in treeList"
          :key="i"
          :value="item.contestId"
        >{{item.contestName}}</a-select-option>
      </a-select>
    </div>
    <div class="cards">
      <TreeCard>
        <template slot="tree">
          <a-radio-group v-if="list.length" v-model="tree" @change="handleTreeChange">
            <a-radio
              :style="style"
              v-for="item in list"
              :key="item.value"
              :value="item.value"
            > {{ item.label }}
            </a-radio>
          </a-radio-group>
          <a-empty description="当前赛事没有项目, 请到赛事列表中创建项目" v-else/>
        </template>
        <template slot="query">
          <a-form v-show="this.stageArr.length" layout="inline" :form="form">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item colon label="阶段名称">
                  <a-select v-model="query.cproStageId" @change="handleStageChange">
                    <a-select-option
                      v-for="value in stageArr"
                      :value="value.value"
                      :key="value.value"
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
            <!--            <a-button :disabled="!data.length"  type="primary" @click="handleExport">成绩导出</a-button>-->
          </a-space>
        </template>
        <template slot="default">

          <a-table
            v-show="this.stageArr.length"
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
    </div>
  </div>
</template>

<script>
import TreeCard from '@comp/card/TreeCard.vue'
import {
  RealTimeViewTreeStyle
} from '@views/Competition/RealTimeView/RealTimeView.config'
import {
  bizContestList,
  bizContestProjectList,
  bizContestProjectStageList,
  bizPlayerFinalScoreFinalSportsList
} from '@api/competition'
import { stageName } from '@views/Competition/projectPhase/projectPhase.config'
import {
  reportCardFinalColumns,
  reportCardStageColumns
} from '@views/finalScore/reportCard/reportCard.config'
import { Time } from '@/utils'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
export default {
  name: 'reportCard',
  components: {
    TreeCard,
  },
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
      },
      form: this.$form.createForm(this, { name: 'search' }),
      style: RealTimeViewTreeStyle,
      contestId: '',
      tree: '',
      treeList: [],
      list: [],
      data: [],
      query: {
        cproStageId: ''
      },
      group: 0,
      groupArray: [],
      title: '',
      stageArr: [],
      dataTitle: '',
      columns: reportCardStageColumns,
      scroll: {
        x: 1500
      },
      rank: []
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
      immediate: true
    }
  },
  created() {},
  methods: {
    // 分页
    handleTableChange (pagination) {
      this.pagination = pagination
      this.getList()
    },
    // 修改赛事
    handleContest() {
      this.getProjectList()
    },
    // 获取阶段
    getStage () {
      bizContestProjectStageList({
        cproId: this.tree,
        contestId: this.contestId
      }).then(res => {
        if (res.code === 200) {
          if (res.result.length) {
            const data = res.result.map(item => {
              return {
                ...item,
                label: item.stageName,
                value: item.cproStageId
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
        }else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取项目
    getProjectList () {
      bizContestProjectList({
        contestId: this.contestId
      }).then(res => {
        // console.log(res)
        if (res.code === 200) {
          // 查询下拉框
          if (res.result.length) {
            const data = res.result.map(item => {
              return {
                ...item,
                label: `${item.projectName} - ${item.projectGroup}`,
                value: item.cproId
              }
            })
            this.tree = data[0].value
            this.list = data
          }else {
            this.tree = ''
            this.list = []
          }
          // 阶段
          this.getStage()
        }
      })
    },
    // 获取比赛信息
    getTreeList () {
      bizContestList({}).then(res => {
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
      if (Array.isArray(total)){
        for (let i = 0; i < total.length; i++) {
          children.push({
            // title: numToCapital((i + 1) * 10),
            title: total[i],
            align: 'center',
            dataIndex: `scoreList${i+1}`
          })
        }
      }else {
        for (let i = 0; i < total; i++) {
          children.push({
            // title: numToCapital((i + 1) * 10),
            title: (i + 1) * 10,
            align: 'center',
            dataIndex: `scoreList${i+1}`
          })
        }
      }
      this.columns = reportCardStageColumns.map( item => {
        if (item.children) {
          return {
            ...item,
            children: children
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
      bizPlayerFinalScoreFinalSportsList(data).then(res => {
        // includes("团体")
        if (res.code === 200) {
          this.rank = res.result.remark
          if(res.result.title.includes('团体')){
            this.columns = reportCardFinalColumns
            this.data = res.result.data.map((item, i) => {
              return {
                ...item,
                i: i + 1
              }
            })
          }else{
            // 组
            this.getColumns( (res.result.shoots && res.result.shoots.length) ?  res.result.shoots : this.group)
            this.groupArray = res.result.shoots
            this.data = res.result.data.map((item, i) => {
              const obj = {}
              for (let k = 0; k < item.scoreList.length; k++) {
                obj['scoreList' + (k + 1)] = item.scoreList[k]
              }
              return {
                ...item,
                ...obj,
                i: i + 1
              }
            })
          }
          this.dataTitle = res.result.title
        }else {
        }
      })
    },
    // 左侧选中
    handleTreeChange (v) {
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
    bodyContent(){
      const contest = this.treeList.filter(item => item.contestId === this.contestId)[0]
      const contestName = this.treeList.filter(item => item.contestId === this.contestId)[0].contestName
      const label = this.list.filter(item => item.value === this.tree)[0]
      const group = this.stageArr.filter(item => this.dataTitle.includes(item.stageName))[0].groupCount
      // const stage = this.stageArr.filter(item => this.dataTitle.includes(item.stageName))[0]
      // console.log(label)
      const project = this.list.filter(item => item.value === this.tree)[0]
      // console.log(contest)
      let g = 0
      if (this.groupArray && this.groupArray.length){
        g = this.groupArray.length
      }else {
        g = group
      }

      const th = () => {
        const arr = []
        if (this.groupArray && this.groupArray.length){
          for (const item of this.groupArray) {
            arr.push(`<th>${item}</th>`)
          }
          return arr.join("")
        }
        for (let i = 0; i < group; i++) {
          arr.push(`<th>${(i+1) * 10}</th>`)
        }
        return arr.join("")
      }
      const datas = [...this.data,/*  ...this.data, ...this.data, ...this.data, ...this.data */]
      const tr = datas.map(item => {
        const arr = []
        for (let i = 0; i < item.scoreList.length; i++) {
          arr.push(`<td>${item.scoreList[i]}</td>`)
        }
        return (
          `<tr>
            <td colspan="2">${item.i}</td>
            <td colspan="2">${item.targetSite}</td>
            <td colspan="2" style="text-align: left">${item.playerName}</td>
            <td colspan="2" style="text-align: left">${item.groupName}</td>
            ${arr.join("")}
            <td colspan="2">${item.stageTotal}</td>
            <td>${item.i<=8?"Q":""}</td>
          </tr>`
        )
      })


      return `
      <style>
        td{text-align: right}
        th{border: 1px solid;}
        @media print {
          @page{
            margin-top: .3cm;
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
        h1,h2,h3,p{
          margin: 0;
          padding: 0;
        }
      </style>
      <div>
        <h1 style="text-align: center">${contestName}</h1>

        <h2 style="text-align: center">
          ${label.projectGroup}${label.projectName}
        </h2>
        <h3 style="text-align: center">资格赛</h3>
        <p style="text-align: center">${contest.location}</p>
        <p style="text-align: center;margin-bottom: 1cm">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
        <table align="center" cellspacing="0" border="0" style="width: 100%;">
          <thead >
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
          <tbody> ${tr.join("")} </tbody>

        </table>
        <div style="position: fixed; bottom: 0;width: 100%">
          <div style="width: 96%;border: 0px solid">
            <div style="width: 96%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px">
              <div style="margin-bottom: 6px">备注</div>
              <div>${this.rank.join("，")}</div>
            </div style="margin-bottom: 6px">
            <div style="height: 60px;display: flex;width: 100%;justify-content: flex-end;align-items: center;margin: 0">
              抗议截止时间:
              <div style='width: 20%'></div>
            </div>
          </div>
        </div>
      </div>`
    },
    // 混团
    groupContent() {
      const contest = this.treeList.filter(item => item.contestId === this.contestId)[0]
      const contestName = this.treeList.filter(item => item.contestId === this.contestId)[0].contestName
      const label = this.list.filter(item => item.value === this.tree)[0]
      const j = this.data.filter(item => item.stageGroup === 1)
      const y = this.data.filter(item => item.stageGroup === 2)
      const project = this.list.filter(item => item.value === this.tree)[0]
      const jtr = () => {
        return j.map((item,k) => {
          return `
            <tr>
              <td>${item.i}</td>
              <td style="text-align: left">${item.groupName}</td>
              <td>${item.stageTotal}</td>
              <td>${item.total}</td>
              <td>${k === 0? '金牌': k === 1? '银牌': '' }</td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player1Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player2Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `
        }).join("")
      }
      const ytr = () => {
        return y.map((item, k) => {
          return `
            <tr>
              <td>${item.i}</td>
              <td style="text-align: left">${item.groupName}</td>
              <td>${item.total}</td>
              <td>${item.stageTotal}</td>
              <td>${k === 0? '铜牌': '' }</td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player1Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td style="text-align: left">${item.player2Name}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `
        }).join("")
      }

      const jdiv = j.length ?  `<h4>金牌赛</h4>
            <table align="center" cellspacing="0" border="0" style="width: 100%;">
              <thead>
                <tr>
                  <th>排名</th>
                  <th style="text-align: left">姓名</th>
                  <th>总分</th>
                  <th>总环数</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                ${jtr()}
              </tbody>

            </table>`: ''
      const ydiv = y.length ? `<h4>铜牌赛</h4>
            <table align="center" cellspacing="0" border="0" style="width: 100%;">
              <thead>
                <tr>
                  <th>排名</th>
                  <th style="text-align: left">姓名</th>
                  <th>总分</th>
                  <th>总环数</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                ${ytr()}
              </tbody>

            </table>`: ''

      // 混团备注
      const beizhu = this.rank.length && (
        `
         <div style="width: 96%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px">
          <div style="margin-bottom: 6px">备注</div>
          <div>${this.rank.join("，")}</div>
        </div style="margin-bottom: 6px">
`
      ) || ""
      return `
        <style>td{text-align: center}th{border: 1px solid;}body{height: 100vh;margin: 0;padding: 0;}</style>
        <div>
          <div style="height: 90vh">
            <h1 style="text-align: center">${contestName}</h1>
            <h2 style="text-align: center">${label.label.split("-").reverse().join('')}</h2>
            <h3 style="text-align: center">奖牌赛</h3>
            <p style="text-align: center">${contest.location}</p>
            <p style="text-align: center;margin-bottom: 1cm">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
            <div>
              ${jdiv}
              <br/>
              ${ydiv}
            </div>
          </div>
          <div style="position: fixed; bottom: 0;width: 100%">
          <div style="width: 96%;border: 0px solid">
            ${beizhu}
<!--            <div style="height: 60px;display: flex;width: 100%;justify-content: flex-end;align-items: center;margin: 0">-->
<!--              抗议截止时间:-->
<!--              <div style='width: 20%'></div>-->
<!--            </div>-->
          </div>
        </div>
        </div>
      `
    },
    // 决赛 || 淘汰赛
    content(){
      const contestName = this.treeList.filter(item => item.contestId === this.contestId)[0].contestName
      const label = this.list.filter(item => item.value === this.tree)[0]
      const group = this.stageArr.filter(item => this.dataTitle.includes(item.stageName))[0].groupCount
      const project = this.list.filter(item => item.value === this.tree)[0]
      let g = 0
      if (this.groupArray && this.groupArray.length){
        g = this.groupArray.length
      }else {
        g = group
      }
      const th = () => {
        const arr = []
        if (this.groupArray && this.groupArray.length){
          for (const item of this.groupArray) {
            arr.push(`<th>${item}</th>`)
          }
          return arr.join("")
        }
        for (let i = 0; i < group; i++) {
          arr.push(`<th>${(i+1) * 10}</th>`)
        }
        return arr.join("")
      }
      const tr = this.data.map(item => {
        const arr = []
        for (let i = 0; i < item.scoreList.length; i++) {
          arr.push(`<td>${item.scoreList[i]}</td>`)
        }
        const list = this.groupArray && this.groupArray.length ? this.groupArray : []
        const array = []
        if (list.length) {
          for (let i = 0; i < list.length; i++){
            if (i === 0){
              array.push({
                value: list[i],
                arr: item.detailScoreList.slice(0, list[i])
              })
            }else {
              array.push({
                value: list[i],
                arr: item.detailScoreList.slice(list[i-1], list[i])
              })
            }
          }
        }
        // 最大多少行
        const trs = Math.max(...array.map(i=>i.arr.length))
        const rows = []
        for (let i = 0; i < trs; i++) {
          const j = []
          for (const k of array) {
            // console.log(k,  k.arr[i] )
            j.push(`<td>${  k.arr[i] ? k.arr[i].score : "" }</td>`)
          }
          // console.log(j)
          rows.push(`
            <tr>
              <td colspan="2"></td>
              <td colspan="2"></td>
              <td colspan="2"></td>
              <td colspan="2"></td>
              ${j.join("")}
              <td colspan="2"></td>
              <td></td>
            </tr>
          `)
        }
        // console.log(rows)
        return (`
          <tr>
            <td colspan="2">${item.i}</td>
            <td colspan="2">${item.targetSite}</td>
            <td colspan="2" style="text-align: right">${item.playerName}</td>
            <td colspan="2" style="text-align: right">${item.groupName}</td>
            ${arr.join("")}
            <td colspan="2">${item.stageTotal}</td>
            <td>${item.i <= 8 ? 'QF' : ''}</td>
          </tr>
          ${rows.join("")}
        `)
      })

      return `
      <style>
        td{text-align: left}
        th{border: 1px solid;}
        @media print {
          @page{
            margin-top: .3cm;
            margin-bottom: 0cm;
          }
        }
      </style>
      <div>
        <h1 style="text-align: center">${contestName}</h1>
        <h2 style="text-align: center">${this.dataTitle}成绩</h2>
        <h3 style="text-align: center">
          ${label.projectGroup.length > 3 ? label.projectGroup.substring(0, 2) : label.projectGroup}
          ${label.projectName}
        </h3>
        <p style="text-align: center;margin: 1cm 0">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
        <table align="center" cellspacing="0" border="0" style="width: 100%;">
          <thead>
            <tr>
              <th rowspan="2" colspan="2">排名</th>
              <th rowspan="2" colspan="2">靶位</th>
              <th rowspan="2" colspan="2">姓名</th>
              <th rowspan="2" colspan="2">代表队</th>
              <th colspan="${g}">组</th>
              <th rowspan="2" colspan="2">总计</th>
              <th rowspan="2">备注</th>
            </tr>
            <tr>${th()}</tr>
          </thead>
          <tbody>${tr.join('')}
          </tbody>
        </table>
        <div style="width: 100%">
          <div style="width: 96%;border: 0px solid">
            <div style="width: 96%;border-color: #333;border-style: solid;border-left: 1px;border-right: 1px;margin: 0;padding-bottom: 8px">
              <div style="margin-bottom: 6px">备注</div>
              <div>${this.rank.join("，")}</div>
            </div style="margin-bottom: 6px">
            <div style="height: 60px;display: flex;width: 100%;justify-content: flex-end;align-items: center;margin: 0">
              抗议截止时间:
              <div style='width: 20%'></div>
            </div>
          </div>
        </div>
      </div>`
    },
    // 打印
    handlePrint () {
      const print = (fn) => {
        /*  const pwin = window.open(); //打开一个新窗口
         pwin.document.write(fn)
         pwin.print(); //调用打印机
         pwin.close() //这个点取消和打印就会关闭新打开的窗口
         pwin.addEventListener('afterprint', () => {
           pwin.close()
         }); */
        const iframe= document.createElement("iframe");
        document.body.appendChild(iframe);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(fn);
        iframe.contentWindow.print()
        iframe.contentWindow.document.close();
        iframe.contentWindow.addEventListener('afterprint', () => {
          iframe.contentWindow.document.close()
          document.body.removeChild(iframe)
        });
        document.body.removeChild(iframe)
      }
      if (this.dataTitle.includes('团体')) {
        print(this.groupContent())
      }else{
        if (this.dataTitle.includes("决赛") || this.dataTitle.includes("淘汰赛")) {
          print(this.content())
        }else{
          // 资格赛
          print(this.bodyContent())
        }
      }
    },
    // 导出
    handleExport () {
      const stage = stageName.filter(item => this.dataTitle.includes(item.value))[0]
      const parser = new DOMParser();
      let htmlDoc;
      switch (stage.id){
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
      const a = this.stageArr.filter(item => item.value === v)[0]
      this.title = a.label
      this.group = a.groupCount
    }
  },
}
</script>

<style scoped lang="less">
@btnHeight: 50px;
.RealTimeView{
  height: 100%;
  overflow-y: hidden;
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
    /deep/.ant-page-header-heading{
      display: flex;
      align-items: center;
    }
  }

  .cards {
    height: calc(100% - @btnHeight - 10px);
  }
}
</style>