<template>
  <div class="RealTimeView">
    <div class="btns">
      <a-select :placeholder="treeList.length && '请选择赛事' || '请先创建赛事'" style="width: 300px" v-model="contestId"
        @change="handleContest">
        <a-select-option v-for="(item, i) in treeList" :key="i" :value="item.contestId">{{ item.contestName
        }}</a-select-option>
      </a-select>
    </div>
    <div class="cards">
      <TreeCard>
        <template slot="tree">
          <a-radio-group v-if="list.length" v-model="tree" @change="handleTreeChange">
            <a-radio :style="style" v-for="item in list" :key="item.value" :value="item.value"> {{ item.label }}
            </a-radio>
          </a-radio-group>
          <a-empty description="当前赛事没有项目, 请到赛事列表中创建项目" v-else />
        </template>
        <template slot="operator">
          <a-space>
            <a-button :disabled="!list.length" @click="handleSubmit" type="primary" icon="search">查询</a-button>
            <a-button :disabled="!list.length" type="primary" @click="handlePrint">成绩打印</a-button>
          </a-space>
        </template>
        <template slot="default">
          <a-table v-show="dataSource.length" :columns="columns" :data-source="dataSource" rowKey="i" :pagination="false"
            @change="handleTableChange" bordered :scroll="{ x: 1400 }">
            <a-table :pagination="false" bordered slot="expandedRowRender" slot-scope="record"
              :columns="record.innerColumns" :data-source="record.innerData" :scroll="{ x: 1400 }"></a-table>
          </a-table>
          <a-empty v-show="!dataSource.length" description="当前项目数据, 暂时无法查询最终成绩" />
        </template>
      </TreeCard>
    </div>
  </div>
</template>

<script>
import TreeCard from '@comp/card/TreeCard.vue'
import { RealTimeViewTreeStyle } from '@views/Competition/RealTimeView/RealTimeView.config'
import { bizContestList, bizContestProjectList, massingSportsList, } from '@api/competition'
import {
  groupCardColumns,
  groupCardInnerColumns
} from './groupScorePtint.config'
import { Time } from '@/utils'
export default {
  name: "mixedGroupScorePrinting", //混团成绩
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
      form: this.$form.createForm(this, {
        name: 'search'
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
      groupArrayData: [], //打印成绩数组
      title: '',
      dataTitle: '',
      mixParameters: undefined, //左侧选择后需要的参数
      columns: groupCardColumns,
      scroll: {
        x: 1500
      },
      dataSource: [],
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
    },
  },
  created() { },
  methods: {
    // 分页
    handleTableChange(pagination) {
      this.pagination = pagination
      this.getList()
    },
    // 获取比赛信息
    getTreeList() {
      bizContestList({}).then((res) => {
        this.treeList = res.result
        this.contestId = res.result[0].contestId
        // 通过比赛获取左侧项目
        this.getProjectList()
      })
    },
    // 修改赛事
    handleContest() {
      this.getProjectList()
    },
    // 获取项目
    getProjectList() {
      bizContestProjectList({
        contestId: this.contestId,
      }).then((res) => {
        if (res.code === 200) {
          // 查询下拉框
          if (res.result.length && res.result.filter(item => item.projectName.includes("团体")).length) {
            const data = res.result.filter(item => item.projectName.includes("团体")).map((item) => {
              return {
                ...item,
                label: `${item.projectName} - ${item.projectGroup}`,
                value: `${item.projectName} - ${item.projectGroup}`,
              }
            })
            this.tree = data[0].value
            this.mixParameters = data[0].value
            this.list = data
            this.getStageList()
          } else {
            this.tree = ''
            this.list = []
          }
        }
      })
    },
    // 左侧选中
    handleTreeChange(v) {
      this.mixParameters = v.target.value
      this.getStageList();
    },
    // 混团
    groupContent() {
      const contestName = this.treeList.filter(item => item.contestId === this.contestId)[0].contestName
      const label = this.list.filter(item => item.value === this.tree)[0]
      const project = this.list.filter(item => item.value === this.tree)[0]
      // // 父表格合并组数
      let g = 0
      if (this.groupArrayData[0].groupList.length) {
        g = this.groupArrayData[0].groupList.length
      } else {
        // const arr = []
        // for (const item of this.data) {
        //   arr.push(item.teamScoreList.length)
        // }
        // g = Math.max(...arr)
      }
      // 父表格头组值
      const th = () => {
        const ths = []
        for (let i = 0; i < g; i++) {
          // if (this.groupArrayData[0].groupList.length) {
          //   // ths.push(`<th>${this.groupArrayData[0].groupList[i]}</th>`)
          // } else {
          ths.push(`<th>${(i + 1) * 10}</th>`)
          // }
        }
        return ths.join("")
      }
      // // 子表格及父表格数据
      const tr = (i) => {
        const rows = this.groupArrayData.map((item, index) => {
          // if (i >= index + 1) {
          const printTds = []
          console.log(g, 'g')
          for (let i = 0; i < g; i++) {
            printTds.push(
              `<td style="${item.i + 1 == 10 ? 'border-top: 1px solid #000;background: #ccc;line-height: 30px;' : 'background: #ccc;line-height: 30px;'}">${item.groupList[i]}</td>`
            )
          }
          console.log(printTds)

          const trs = []
          const tdsboy = []
          const tdsgril = []
          for (const boy of item.boyList) {
            tdsboy.push(`<td>${boy.gunGroupTotalStr}</td>`)
          }
          for (const gril of item.grilList) {
            tdsgril.push(`<td>${gril.gunGroupTotalStr}</td>`)
          }
          trs.push(`
            <tr >
              <td></td>
              <td>${item.grilList[0].playerName}</td>
              ${tdsgril.join("")}
              <td>${item.grilList[0].stageTotal}</td>
            </tr>
            <tr >
              <td></td>
              <td>${item.boyList[0].playerName}</td>
              ${tdsboy.join("")}
              <td>${item.boyList[0].stageTotal}</td>
            </tr>`)

          return (`
            <tr style="background: #ccc">
              <td style="${item.i + 1 == 10 ? 'border-top: 1px solid #000;background: #ccc' : 'background: #ccc'}" >${index + 1}</td>
              <td style="${item.i + 1 == 10 ? 'border-top: 1px solid #000;background: #ccc' : 'background: #ccc'}">${item.groupName}</td>
              ${printTds.join("")}
              <td style="${item.i + 1 == 10 ? 'border-top: 1px solid #000;background: #ccc' : 'background: #ccc'}" >${item.score}</td>
              ${trs.join("")}
            </tr>
          `)
          // }
        })

        return rows.join("")
      }
      // const imgs = window._CONFIG.printSponsorBottomImgs.map((item, index) => (
      //   `<img src="../${item}" style="width: calc(${(100 / window._CONFIG.printSponsorBottomImgs.length)}% - ${((6 * 2) * window._CONFIG.printSponsorBottomImgs.length)}px); height: 2.5cm;margin: 0 6px"/>`
      // ))
      const pages = [`
      <div style="position: relative;overflow: hidden;">
          <h1 style="text-align: center;font-size: 24px;margin-top: 100px;">${contestName}</h1>
          <h2 style="text-align: center">
            ${label.projectGroup}${label.projectName}
          </h2>
          <h3 style="text-align: center">资格赛</h3>
          <p style="text-align: center;margin-bottom: 1cm">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
        </div>
       <div>
       <table class="tables" align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
          <thead>
            <tr>
              <th rowspan="2">排名</th>
              <th rowspan="2">姓名</th>
              <th colspan="${g}">组</th>
              <th rowspan="2">总计</th>
            </tr>
            <tr>
              ${th()}
            </tr>
          </thead>
          <tbody>
            ${tr(6)}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="${6 + g}">
                <div style="height: 2.8cm"></div>
              </td>
            </tr>
          </tfoot>
        </table>
</div>
        <!--<div style="position: fixed;bottom: 0px;width: 100%;height: 100px;left: 0px">
          <div style="height: 90px; width: 96%;border: 1px solid">
            <div>
              备注:
            </div>
          </div>
        </div>
        <div style="position: fixed;left: 0;bottom: 0;height: 2.8cm;margin-bottom: .5cm;padding-top: .2cm ;width: 100%;display: flex;justify-content: space-between">
            <img src="../../${window._CONFIG.printSponsorImg}" style="position: absolute;bottom: 0;left: 0;right: 0;width: 20%" alt="">
        </div>-->
        `]
      for (let i = 0; i < ((this.data.length - 6) / 6).toFixed(0); i++) {
        //
        pages.push(
          `
          <div style="position: relative;overflow: hidden;">
          <h1 style="text-align: center;font-size: 24px;margin-top: 100px;">${contestName}</h1>
          <h2 style="text-align: center">
            ${label.projectGroup}${label.projectName}
          </h2>
          <h3 style="text-align: center">资格赛</h3>
          <p style="text-align: center;margin-bottom: 1cm">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
        </div>
       <div>
        <table class="tables" align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
          <thead>
            <tr>
              <th rowspan="2">排名</th>
              <th rowspan="2">姓名</th>
              <th colspan="${g}">组</th>
              <th rowspan="2">总计</th>
            </tr>
            <tr>
              ${th()}
            </tr>
          </thead>
          <tbody>
            ${tr((i + 2) * 6)}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="${6 + g}">
                <div style="height: 2.8cm"></div>
              </td>
            </tr>
          </tfoot>
        </table>
</div>
        <!--<div style="position: fixed;bottom: 0px;width: 100%;height: 100px;left: 0px">
          <div style="height: 90px; width: 96%;border: 1px solid">
            <div>
              备注:
            </div>
          </div>
        </div>
        <div style="position: fixed;left: 0;bottom: 0;height: 2.8cm;margin-bottom: .5cm;padding-top: .2cm ;width: 100%;display: flex;justify-content: space-between">
          <img src="${ process.env.NODE_ENV === 'electron' ? window._CONFIG.printSponsorImg : '../' + window._CONFIG.printSponsorImg}" style="position: absolute;bottom: 0;left: 0;right: 0;width: 20%" alt="">
        </div>-->
        `
        )
      }
      console.log(pages)
      return `
      <style>
      @page{
        margin-top: 2cm;
      }
        h1,h2,h3,h4,p{
          margin: 0;
          padding: 0;
        }
        .tables{
          width: 100%;
        }
        td{text-align: center}.tables>thead>tr>th{border: 1px solid;}
        td:nth-of-type(2){
        text-align: left;
        }
      </style>
      <div>
        ${pages.join("")}
      </div>`
    },
    // 打印弹窗
    handlePrint() {
      const print = (fn) => {
        const title = this.mixParameters
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
            // 显示
            if (pageCount === 1) { }
            // 隐藏 追加
            else {
              const footer = iframe.contentDocument.querySelector('.footer')
              const newfooter = iframe.contentDocument.createElement('div')
              newfooter.innerHTML = footer.innerHTML
              if (title.includes('决赛')) {
                // 判断低图是否有
                if (window._CONFIG.printSponsorBottomImgs.length) {
                  newfooter.style.marginTop =
                    totalHeight * pageCount - (body + foot.scrollHeight + foot.scrollHeight + foot
                      .scrollHeight) + 'px'
                  newfooter.style.marginBottom = foot.scrollHeight / 2 + 'px'
                } else {
                  newfooter.style.marginTop =
                    totalHeight * pageCount -
                    (body + foot.scrollHeight + foot.scrollHeight + foot.scrollHeight + 20) +
                    'px'
                  // newfooter.style.marginBottom = foot.scrollHeight / 2 + 'px'
                }
              }
              // 资格赛
              else {
                if (window._CONFIG.printSponsorBottomImgs.length) {
                  newfooter.style.marginTop =
                    totalHeight * pageCount -
                    (body + foot.scrollHeight + foot.scrollHeight + foot.scrollHeight / 2) +
                    'px'
                  newfooter.style.marginBottom = foot.scrollHeight / 2 + 'px'
                } else {
                  newfooter.style.marginTop =
                    totalHeight * pageCount -
                    (body + foot.scrollHeight + foot.scrollHeight + foot.scrollHeight + 100) +
                    'px'
                  // newfooter.style.marginBottom = foot.scrollHeight + 'px'
                }
              }
              footer.style.visibility = 'hidden'
              iframe.contentDocument.body.append(newfooter)
            }
          }
          if (!title.includes('团体')) {
            getNumberOfPages()
          }
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
      print(this.groupContent())
    },
    // 打印
    // 成绩打印调用接口
    getStageList() {
      this.data = []
      // 类型
      var index = this.mixParameters.indexOf('枪') // 获取"枪"的索引位置
      if (index !== -1) {
        var resultType = this.mixParameters.slice(index - 1, index) // 截取"枪"的前一个字符
      }
      // 组别
      let nameGroup = this.mixParameters.slice(-2)
      const arr = {
        contestId: this.contestId,
        projectGroup: nameGroup,
        type: resultType + '枪',
      }
      massingSportsList(arr).then((res) => {
        if (res.code === 200) {
          this.groupArrayData = res.result
          this.getColumns(this.groupArrayData[0].groupList)
          const list = res.result.map(item => {
            let total = 0
            const obj = {}
            for (let i = 0; i < item.groupList.length; i++) {
              if (!isNaN(Number(item.groupList[i]))) {
                total += Number(item.groupList[i])
                obj[`teamScoreList${i + 1}`] = item.groupList[i]
              }
            }
            const t = item.groupList.length
            let children = []
            if (Array.isArray(t)) {
              for (let i = 0; i < t.length; i++) {
                children.push({
                  title: t[i],
                  width: 100,
                  align: 'center',
                  dataIndex: `teamScoreList${i + 1}`
                })
              }
            } else {
              for (let i = 0; i < t; i++) {
                children.push({
                  title: (i + 1) * 10,
                  width: 100,
                  align: 'center',
                  dataIndex: `teamScoreList${i + 1}`
                })
              }
            }
            const innerColumns = groupCardInnerColumns.map(i => {
              if (i.children) {
                return {
                  ...i,
                  children: children
                }
              }
              return i
            })
            // 队员名字分数 拼组
            var objboy = {}
            var objgril = {}
            for (let i = 0; i < item.boyList.length; i++) {
              objboy.playerName = item.boyList[1].playerName
              objboy.stageTotal = item.boyList[1].stageTotal
              objboy[`teamScoreList${i + 1}`] = item.boyList[i].gunGroupTotalStr
            }
            for (let i = 0; i < item.grilList.length; i++) {
              objgril.playerName = item.grilList[1].playerName
              objgril.stageTotal = item.grilList[1].stageTotal
              objgril[`teamScoreList${i + 1}`] = item.grilList[i].gunGroupTotalStr
            }
            return {
              ...item,
              ...obj,
              total,
              // 队员名字分数
              innerColumns,
              innerData: [
                { ...objgril },
                { ...objboy }
              ]
            }
          })
          this.dataSource = list
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 获取比赛成绩表头
    getColumns(total) {
      let children = []
      for (let i = 0; i < total.length; i++) {
        children.push({
          // title: numToCapital((i + 1) * 10),
          title: (i + 1) * 10,
          align: 'center',
          width: 100,
          dataIndex: `teamScoreList${i + 1}`
        })
      }
      this.columns = groupCardColumns.map(item => {
        if (item.children) {
          return {
            ...item,
            children: children
          }
        }
        return item
      })
    },
    // 查询
    handleSubmit() {
      this.getStageList()
    },
  },
}
</script>

<style scoped lang="less">
@btnHeight: 50px;

.RealTimeView {
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