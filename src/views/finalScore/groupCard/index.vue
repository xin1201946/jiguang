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
        <template slot="query">
          <a-form layout="inline" :form="form" v-show="stageArr.length">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item colon label="阶段名称">
                  <a-select v-model="query.cproStageId">
                    <a-select-option v-for="value in stageArr" :value="value.value" :key="value.value">{{ value.label }}
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
          <a-space v-show="stageArr.length">
            <a-button :disabled="!data.length" type="primary" @click="handlePrint">成绩打印</a-button>
          </a-space>
        </template>
        <template slot="default">
          <a-table v-show="stageArr.length" :columns="columns" :data-source="data" rowKey="i" :pagination="false"
            @change="handleTableChange" bordered :scroll="{ x: 1400 }">
            <a-table :pagination="false" bordered slot="expandedRowRender" slot-scope="record"
              :columns="record.innerColumns" :data-source="record.innerData" :scroll="{ x: 1400 }"></a-table>
          </a-table>
          <a-empty v-show="!stageArr.length" description="当前项目没有阶段, 暂时无法查询最终成绩" />
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
    bizPlayerFinalScoreTeamSports
  } from '@api/competition'
  import {
    groupCardColumns,
    groupCardInnerColumns
  } from '@views/finalScore/groupCard/groupCard.config'
  import {
    Time
  } from '@/utils'
  export default {
    name: 'groupCard',
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
          cproStageId: ''
        },
        stageArr: [],
        title: '',
        group: 0,
        columns: groupCardColumns,
        scroll: {
          x: 1500
        }
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
          contestId: this.contestId
        }).then(res => {
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
        })
      },
      // 获取项目
      getProjectList() {
        bizContestProjectList({
          contestId: this.contestId
        }).then(res => {
          // console.log(res)
          if (res.code === 200) {
            console.log(res)
            // 查询下拉框
            if (res.result.length) {
              const data = res.result.filter(item => !item.projectName.includes("团体")).map(item => {
                return {
                  ...item,
                  label: `${item.projectName} - ${item.projectGroup}`,
                  value: item.cproId
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
        for (let i = 0; i < total; i++) {
          children.push({
            // title: numToCapital((i + 1) * 10),
            title: (i + 1) * 10,
            align: 'center',
            dataIndex: `teamScoreList${i + 1}`
          })
        }
        // console.log(total)
        this.columns = groupCardColumns.map(item => {
          if (item.children) {
            return {
              ...item,
              children: children
            }
          }
          return item
        })
        console.log(this.columns)
      },
      // 获取列表
      getList() {
        const data = {
          ...this.query,
          contestId: this.contestId,
          cproId: this.tree,
        }
        this.getColumns(this.group)
        bizPlayerFinalScoreTeamSports(data).then(res => {
          if (res.code === 200) {
            console.log(res.result)
            // this.dataTitle = res.result.title
            const list = res.result.map(item => {
              let total = 0
              const obj = {}
              for (let i = 0; i < item.teamScoreList.length; i++) {
                if (!isNaN(Number(item.teamScoreList[i]))) {
                  total += Number(item.teamScoreList[i])
                  obj[`teamScoreList${i + 1}`] = item.teamScoreList[i]
                }
              }
              const t = item.shoots.length ? item.shoots : this.group
              let children = []
              if (Array.isArray(t)) {
                for (let i = 0; i < t.length; i++) {
                  children.push({
                    // title: numToCapital((i + 1) * 10),
                    title: t[i],
                    align: 'center',
                    dataIndex: `teamScoreList${i + 1}`
                  })
                }
              } else {
                for (let i = 0; i < t; i++) {
                  children.push({
                    // title: numToCapital((i + 1) * 10),
                    title: (i + 1) * 10,
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

              return {
                ...item,
                ...obj,
                total,
                innerData: item.finalList.map(value => {
                  const obj = {}
                  let totals = 0
                  for (let i = 0; i < value.scoreList.length; i++) {
                    obj[`teamScoreList${i + 1}`] = value.scoreList[i]
                    if (!isNaN(Number(value.scoreList[i]))) {
                      totals += Number(value.scoreList[i])
                    }
                  }
                  return {
                    ...obj,
                    ...value,
                    total: totals
                  }
                }).map((v, index) => ({
                  ...v,
                  i: index + 1
                })),
                innerColumns
              }
            })
            // this.group
            this.data = list.map((item, i) => {
              return {
                ...item,
                i: i + 1
              }
            })
          }
        })
      },
      // 左侧选中
      handleTreeChange(v) {
        this.getStage()
      },
      // 查询
      handleSubmit() {
        this.getList()
      },
      // 重置
      handleReset() {
        this.query.cproStageId = this.stageArr[0].value
        this.getList()
      },
      // 成绩打印
      bodyContent() {
        const contestName = this.treeList.filter(item => item.contestId === this.contestId)[0].contestName
        const label = this.list.filter(item => item.value === this.tree)[0]
        // todo 没有阶段数组不渲染打印按钮, 如果显示了这里需要修改
        const stageName = this.data[0].finalList[0].stageName
        console.log(this.data[0].finalList[0])
        const project = this.list.filter(item => item.value === this.tree)[0]
        // 父表格合并组数
        console.log(this.data,'12321213213aa')
        let g = 0
        if (this.data[0].shoots.length) {
          g = this.data[0].shoots.length
        } else {
          const arr = []
          for (const item of this.data) {
            arr.push(item.teamScoreList.length)
          }
          g = Math.max(...arr)
        }
        // 父表格头组值
        const th = () => {
          const ths = []
          for (let i = 0; i < g; i++) {
            if (this.data[0].shoots.length) {
              ths.push(`<th>${this.data[0].shoots[i]}</th>`)
            } else {
              ths.push(`<th>${(i + 1) * 10}</th>`)
            }
          }
          return ths.join("")
        }

        // 子表格及父表格数据
        const tr = (i) => {
          console.log(i)
          const rows = this.data.map((item, index) => {
            if (i >= index + 1 && index >= ((i / 6) - 1) * 6) {
              const printTds = []
              for (let i = 0; i < g; i++) {
                printTds.push(
                  `<td style="${item.i + 1 == 10 ? 'border-top: 1px solid #000;background: #ccc;line-height: 30px;' : 'background: #ccc;line-height: 30px;'}">${item.teamScoreList[i]}</td>`
                )
              }

              const trs = []
              for (const value of item.finalList) {
                const tds = []
                let total = 0
                for (const key of value.scoreList) {
                  tds.push(`<td>${key}</td>`)
                  if (!isNaN(Number(key))) {
                    total += Number(key)
                  }
                }
                if (value.integrationMethod === '1' || value.integrationMethod === '2') {
                  trs.push(`
              <tr >
                <td></td>
                <td>${value.playerName}</td>
                ${tds.join("")}
                <td>${total}</td>
              </tr>
            `)
                } else {
                  trs.push(`
              <tr >
                <td></td>
                <td>${value.playerName}</td>
                ${tds.join("")}
                <td>${total.toFixed(1)}</td>
              </tr>
            `)
                }

              }

              return (`
            <tr style="background: #ccc">
              <td style="${item.i + 1 == 10 ? 'border-top: 1px solid #000;background: #ccc' : 'background: #ccc'}" >${item.i}</td>
              <td style="${item.i + 1 == 10 ? 'border-top: 1px solid #000;background: #ccc' : 'background: #ccc'}">${item.groupName}</td>
              ${printTds.join("")}
              <td style="${item.i + 1 == 10 ? 'border-top: 1px solid #000;background: #ccc' : 'background: #ccc'}" >${item.teamStageTotal}</td>
            </tr>
            ${trs.join("")}
          `)
            }
          })

          return rows.join("")
        }
        const imgs = window._CONFIG.printSponsorBottomImgs.map((item, index) => (
          `<img src="${item}" style="width: calc(${(100 / window._CONFIG.printSponsorBottomImgs.length)}% - ${((6 * 2) * window._CONFIG.printSponsorBottomImgs.length)}px); height: 2.5cm;margin: 0 6px"/>`
        ))
        console.log()
        const pages = [`
      <div style="position: relative;overflow: hidden;">
          <img src="${window._CONFIG.zbfLogo}" style="position: absolute;top: 0;left: 0;right: 0;width: 20%" alt="">
          <h1 style="text-align: center;font-size: 24px;margin-top: 100px;">${contestName}</h1>
          <h2 style="text-align: center">
            ${label.projectGroup}${label.projectName}
          </h2>
          <h3 style="text-align: center">${stageName}</h3>

          <h4 style="text-align: center">团体</h4>
          <p style="text-align: center;margin-bottom: 1cm">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
        </div>
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
        <!--<div style="position: fixed;bottom: 0px;width: 100%;height: 100px;left: 0px">
          <div style="height: 90px; width: 96%;border: 1px solid">
            <div>
              备注:
            </div>
          </div>
        </div>-->
        <div style="position: fixed;left: 0;bottom: 0;height: 2.8cm;margin-bottom: .5cm;padding-top: .2cm ;width: 100%;display: flex;justify-content: space-between">
            <img src="${window._CONFIG.printSponsorImg}" style="position: absolute;bottom: 0;left: 0;right: 0;width: 20%" alt="">
        </div>
        `];
        for (let i = 0; i < Number(((this.data.length - 6) / 6).toFixed(1)); i++) {
          pages.push(
            `
          <div style="position: relative;overflow: hidden;">
          <img src="${window._CONFIG.zbfLogo}" style="position: absolute;top: 0;left: 0;right: 0;width: 20%" alt="">
          <h1 style="text-align: center;font-size: 24px;margin-top: 100px;">${contestName}</h1>
          <h2 style="text-align: center">
            ${label.projectGroup}${label.projectName}
          </h2>
          <h3 style="text-align: center">${stageName}</h3>

          <h4 style="text-align: center">团体</h4>
          <p style="text-align: center;margin-bottom: 1cm">${Time(project.projectTimeStart, 'YYYY/MM/DD')}, 开始时间 ${Time(project.projectTimeStart, 'HH:mm')}</p>
        </div>
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
        <!--<div style="position: fixed;bottom: 0px;width: 100%;height: 100px;left: 0px">
          <div style="height: 90px; width: 96%;border: 1px solid">
            <div>
              备注:
            </div>
          </div>
        </div>-->
        <div style="position: fixed;left: 0;bottom: 0;height: 2.8cm;margin-bottom: .5cm;padding-top: .2cm ;width: 100%;display: flex;justify-content: space-between">
          <img src="${window._CONFIG.printSponsorImg}" style="position: absolute;bottom: 0;left: 0;right: 0;width: 20%" alt="">
        </div>
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
        td{text-align: center}.tables>thead>tr>th{border: 1px solid;}
        td:nth-of-type(2){
        text-align: left;
        }
      </style>
      <div>
        ${pages.join("")}
      </div>`
      },

      handlePrint() {
        const iframe = document.createElement("iframe");
        document.body.appendChild(iframe);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(this.bodyContent());
        setTimeout(() => {
          iframe.contentWindow.print()
          iframe.contentWindow.document.close();
          iframe.contentWindow.addEventListener('afterprint', () => {
            iframe.contentWindow.document.close()
            document.body.removeChild(iframe)
          });
          document.body.removeChild(iframe)
        }, 50)
        /* const pwin = window.open(); //打开一个新窗口
        pwin.document.write(this.bodyContent())
        pwin.print(); //调用打印机
        pwin.close() //这个点取消和打印就会关闭新打开的窗口
        pwin.addEventListener('afterprint', () => {
          pwin.close()
        }); */
      }
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