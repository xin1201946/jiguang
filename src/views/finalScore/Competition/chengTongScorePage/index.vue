<template>
  <div class="tongChengBox">
    <Card>
      <template slot="query">
        <a-form :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="赛事名称">
                <a-select allowClear v-model="formData.contestId" @change="handleChangePro">
                  <a-select-option v-for="item in dataContList" :key="item.contestId" :value="item.contestId">{{
          item.contestName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item label="项目名称">
                <a-select allowClear v-model="formData.cproId" @change="handleChangePro1" style="width: 100%;">
                  <a-select-option v-for="item in projectList" :key="item.cproId" :value="item.cproId">{{
          item.projectName
        }}-{{ item.projectGroup }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="3">
              <a-form-item label="阶段">
                <a-select allowClear v-model="formData.cproStageId" @change="handleChangePro2" style="width: 100%">
                  <a-select-option v-for="item in matchList" :key="item.cproStageId" :value="item.cproStageId">{{
          item.stageName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item label="靶位">
                <a-input placeholder="请输入靶位号" v-model="formData.targetSite" />
              </a-form-item>
            </a-col>
            <a-col :span="5">
              <a-form-item :labelCol="{ span: 0 }">
                <a-space>
                  <a-button html-type="submit" type="primary" icon="search" @click="handleSubmit">查询</a-button>
                  <a-button @click="handleReset" icon="reload">重置</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <!-- 表格 -->
      <div class="tableClass">
        <a-table :rowSelection="rowSelection" :rowClassName="(r, i) => rowClassName(r, i)" bordered rowKey="playerId"
          :pagination="false" :columns="columns" :dataSource="dataSource" :loading="loading" :scroll="{ x: 1500 }">
          <template v-for="col in strArr" v-slot:[col]="text, record, index">
            <div :key="col" @contextmenu.prevent="handleActionsColumnContextMenu(record, $event, col)">
              <!-- <a-input placeholder="请输入" v-if="record.editable" :value="text"
                @change="e => handleChange(e.target.value, record.serialNumber, col)"
                @blur="handleBlur(record.serialNumber)" /> -->
              <template>
                <!-- 单击 -->
                <a>{{ text }}</a>
              </template>
            </div>
          </template>
          <!-- 操作 -->
          <template slot="operation" slot-scope="text, record">
            <a-space>
              <a-button type="primary" size="small" ghost icon="profile" @click="handlePrint(record)">成绩打印</a-button>
            </a-space>
          </template>
        </a-table>
      </div>
    </Card>
    <!-- 行内成绩详情 -->
    <GameInfoAchievementModal ref="Achievement" @success="getTableList"></GameInfoAchievementModal>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@/components/query/QuerySearch.vue'
import GameInfoAchievementModal from '@views/Competition/gameInfo/modal/gameInfoAchievementModal.vue'
import { bizContestPageList, bizContestProjectList, bizContestProjectStageList, getStagePlayerGroup } from '@api/competition'
export default {
  name: 'chengTongScorePage',   // 成统页面
  components: {
    Card,
    QuerySearch,
    GameInfoAchievementModal,
  },
  data() {
    return {
      dataContList: [],
      projectList: [],
      formData: {},
      matchList: [],
      contestId: '',
      cproId: '',
      cproStageId: '',
      groupActive: false,
      columns: [
        {
          dataIndex: 'serialNumber',
          title: '选手编号',
          align: 'center',
        },
        {
          dataIndex: 'playerName',
          title: '姓名',
          align: 'center',
        },
        // {
        //   dataIndex: 'playerSex',
        //   customRender: (text, record, index) => {
        //     return record.playerSex == '1' ? '男' : '女'
        //   },
        //   title: '性别',
        //   align: 'center',
        // },
        // {
        //   dataIndex: 'idCardNum',
        //   title: '身份证号',
        //   align: 'center',
        // },
        {
          dataIndex: 'groupName',
          title: '代表队',
          align: 'center',
        },
        {
          dataIndex: 'isGroup',
          title: '是否团体排名',
          align: 'center',
        },
        {
          dataIndex: 'targetSite',
          title: '靶位',
          align: 'center',
        },
        {
          dataIndex: 'padCode',
          title: '设备号',
          align: 'center',
        },
        {
          dataIndex: 'totalScore',
          title: '总环数',
          align: 'center',
        }
      ],
      dataSource: [],
      loading: false,

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
      selectedRowKeys: [],
      selectionRows: [],
      // 可编辑参数
      editingKey: '',
      // 每一列的插槽名 - 表格行内编辑用
      strArr: [],
      // 对于某些自动赋值的input框设为 只读
      readonlyArr: [''],
      menuVisible: false,
    }
  },
  computed: {
    rowSelection() {
      let { selectedRowKeys } = this
      return {
        getCheckboxProps: (record) => ({
          props: {
            disabled: record.eliminationStatus == 1, // Column configuration not to be checked
          },
        }),
        onSelect: (record, selected) => {
          selected
            ? this.selectionRows.push(record)
            : this.selectionRows.splice(
              this.selectionRows.findIndex((x) => x.id === record.id),
              1
            )
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          this.selectionRows = selected
            ? this.selectionRows.concat(changeRows)
            : this.selectionRows.filter((x) => !changeRows.find((i) => i.id === x.id))
        },
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.$nextTick(() => {
            this.selectedRowKeys = selectedRowKeys
          })
        },
      }
    },
  },
  mounted() {
    this.getContestPageList()
    // this.getProjectList()
  },
  methods: {
    rowClassName(r, i) {
      if (r.remarkPenalty) {
        return 'red'
      }
      if (r.sameStatus == 1) {
        return 'tongfen'
      }
      if (r.eliminationStatus == 1) {
        return 'taotai'
      }
      if (r.remark) {
        if (r.remark.toUpperCase() === 'DNF') {
          return 'dnf'
        }
        if (r.remark.toUpperCase() === 'DNS') {
          return 'dns'
        }
      }
    },
    // 赛事列表 bizContestPageList
    getContestPageList() {
      const data = {
        pageNum: 1,
        pageSize: 99999,
      }
      bizContestPageList(data).then((res) => {
        if (res.code === 200) {
          this.dataContList = res.result.records
          this.contestId = this.dataContList[0].contestId
          this.formData.contestId = this.dataContList[0].contestId
          this.getProjectList()
        }
      })
    },
    //赛事事件
    handleChangePro(t) {
      this.contestId = t
      this.formData.contestId = t
      this.formData.cproId = undefined
      this.formData.cproStageId = undefined
      this.getProjectList()
    },
    /**
     * 获取数据
     */
    getProjectList() {
      bizContestProjectList({
        contestId: this.contestId,
        // contestId: 4,
      }).then((res) => {
        if (res.success) {
          this.projectList = res.result
          // this.cproId = this.projectList[0].cproId
          // this.formData.cproId = this.projectList[0].cproId
          // this.getListMatch()
        }
      })
    },
    // 选择后事件
    handleChangePro1(Event) {
      this.cproId = Event
      this.formData.cproId = Event
      this.getListMatch()
      this.formData.cproStageId = null
    },
    // 阶段
    getListMatch() {
      const a = {
        // contestId: "4",
        contestId: this.contestId,
        cproId: this.cproId,
      }
      bizContestProjectStageList(a).then((res) => {
        if (res.success) {
          this.matchList = res.result
        }
      })
    },
    // 阶段事件
    handleChangePro2(re) {
      this.cproStageId = re
      this.$forceUpdate()
      // this.$set(this.cproStageId, re)
      this.getTableList()
    },
    /**
     * 获取table数据
     */
    getTableList() {
      this.loading = true
      getStagePlayerGroup({
        contestId: this.contestId, //赛事id
        // contestId: 4, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id
        targetSite: this.formData.targetSite //靶位
      })
        .then((res) => {
          if (res.success) {
            if (res.result[0].group === -1) {
              this.group = null
              this.groupList = []
              // this.groupActive = false
              this.status = ''
              this.dataSource = res.result[0].bizContestPlayerList.map((item, i) => ({
                ...item,
                i,
              }))
            } else {
              if (!this.group) {
                this.group = res.result[0].group
                this.status = res.result[0].status
                this.groupList = res.result
                // this.groupActive = true
                this.radioChangeHandle(res.result[0].group)
              } else {
                this.status = res.result[0].status
                this.groupList = res.result
                // this.groupActive = true
                this.radioChangeHandle(this.group)
              }
            }
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          this.loading = false
          // this.$refs.treeCard.loading = false
        })
    },
    /**
     * 选择组别
     */
    radioChangeHandle(e) {
      let strArr = []
      this.group = e
      this.groupList.forEach((item) => {
        if (item.group == this.group) {
          this.status = item.status
          strArr = item.scoreGroup
          this.strArr = item.scoreGroup
          let Source = item.bizContestPlayerList.map((item, i) => ({
            ...item,
            i,
          }))
          const newSource = Source.map((item) => {
            const newItem = { ...item }
            for (let index = 0; index < strArr.length && index < item.groupScoreList.length; index++) {
              newItem[strArr[index]] = item.groupScoreList[index].gunGroupTotal
              newItem['strArr'] = strArr
            }
            return newItem // 返回新对象
          })
          this.dataSource = [...newSource]
          console.log()
          console.log(this.dataSource,'qweqweqwewqq123123232');
        }
      })
      this.columns = [
        {
          dataIndex: 'serialNumber',
          title: '选手编号',
          align: 'center',
        },
        {
          dataIndex: 'playerName',
          title: '姓名',
          align: 'center',
        },
        // {
        //   dataIndex: 'playerSex',
        //   customRender: (text, record, index) => {
        //     return record.playerSex == '1' ? '男' : '女'
        //   },
        //   title: '性别',
        //   align: 'center',
        // },
        // {
        //   dataIndex: 'idCardNum',
        //   title: '身份证号',
        //   align: 'center',
        // },
        {
          dataIndex: 'groupName',
          title: '代表队',
          align: 'center',
        },
        {
          dataIndex: 'isGroup',
          title: '是否团体排名',
          align: 'center',
        },
        {
          dataIndex: 'targetSite',
          title: '靶位',
          align: 'center',
        },
        {
          dataIndex: 'padCode',
          title: '设备号',
          align: 'center',
        },
        {
          dataIndex: 'totalScore',
          title: '总环数',
          align: 'center',
        }
      ]
      let arrColumns = []
      for (let i = 0; i < strArr.length; i++) {
        arrColumns.push({
          dataIndex: strArr[i],
          title: `${strArr[i]}`,
          align: 'center',
          scopedSlots: {
            customRender: strArr[i]
          },
        })
      }
      // }
      this.columns.push(...arrColumns, {
        title: '操作',
        align: 'center',
        dataIndex: 'operation',
        scopedSlots: {
          customRender: 'operation'
        },
        width: 180,
        fixed: 'right',
      })
    },
    // 查询
    handleSubmit() {
      this.getTableList()
    },
    // 重置
    handleReset() {
      this.formData.targetSite = undefined
      this.getTableList()
    },
    handleActionsColumnContextMenu(record, event, col) {
      console.log(col, record.col)
      event.preventDefault() // 阻止默认的右键菜单  
      // 在这里添加你的自定义右键菜单逻辑  
      console.log('Right-clicked on actions column for record:', record, event, event.target.innerText, 'qaaaaa')
      this.$refs.Achievement.edit({ ...record, stageId: this.cproStageId, projectName: this.projectName })
    },
    // 打印的资格赛
    bodyContent() {
      const list = (arr) => {
        const l = arr.map((item, index) => {
          if ((index + 1) % 10 === 0 && index !== 0) {
            return (`
              <tr style="height: 45px; line-height: 45px">
                <td align="center">${item.shootCode}</td>
                <td align="center">${item.score}</td>
                <td align="center">${item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
                <td align="center">${item.xcoord}</td>
                <td align="center">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center" style="font-weight: 1000;">小计</td>
                <td align="center" style="font-weight: 900;">${this.formData.scoreList[((index + 1) / 10) - 1] || 0}</td>
              </tr>,
            `)
          }
          return (
            `<tr style="height: 45px; line-height: 45px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>,`
          )
        }).filter(item => item.length !== 0).join('').split(',').map(item => item.replace("/\/n/g").trim()).filter(item => item.length !== 0)
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
        console.log(tds)
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
                    <tr><th colspan="5" style="font-size: 22px; text-align: left">${this.formData.dtlDto.title || this.list[0].title}</th></tr>
                    <tr style="height: 50px; line-height: 50px">
                      <th>发序</th>
                      <th>环数</th>
                      <th>时间</th>
                      <th>X</th>
                      <th>Y</th>
                    </tr>
                  </thead>
                  <tbody style="font-family: 宋体;">${tds[i].join("")}</tbody>
                </table>
              </div>
            `)
          } else {
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
                  <tbody style="font-family: 宋体;">${tds[i].join("")}</tbody>
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
      return (`
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
      <div class="print" style="height: auto;">
         ${arr.join("</br>")}
      </div>`)
    },
    // 打印的决赛
    bodyContent2() {
      const list = (arr) => {
        console.log(this.formData)
        const l = arr.map((item, index) => {
          if (index + 1 <= 10 && (index + 1) % 5 === 0) {
            return (`
              <tr style="height: 45px; line-height: 45px">
                <td align="center">${item.shootCode}</td>
                <td align="center">${item.score}</td>
                <td align="center">${item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
                <td align="center">${item.xcoord}</td>
                <td align="center">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center" style="font-weight: 900;">小计</td>
                <td align="center" style="font-weight: 900;">${this.formData.scoreList[((index + 1) / 5) - 1] || 0}</td>
              </tr>,
            `)
          }
          if (index + 1 > 10 && (index + 1) % 2 === 0) {
            return (`
              <tr style="height: 45px; line-height: 45px">
                <td align="center">${item.shootCode}</td>
                <td align="center">${item.score}</td>
                <td align="center">${item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
                <td align="center">${item.xcoord}</td>
                <td align="center">${item.ycoord}</td>
              </tr>,
              <tr>
                <td align="center" style="font-weight: 900;">小计</td>
                <td align="center" style="font-weight: 900;">${this.formData.scoreList[(index + 1 - 10) / 2 + 1]}</td>
              </tr>,
            `)
          }
          return (
            `<tr style="height: 45px; line-height: 45px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>,`
          )
        }).filter(item => item.length !== 0).join('').split(',').map(item => item.replace("/\/n/g").trim()).filter(item => item.length !== 0)
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
        console.log(tds)
        const tables = []
        for (let i = 0; i < tds.length; i++) {
          if (i === 0) {
            tables.push(`
              <div style="box-sizing: border-box;padding: 10px;">
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
                  <tbody style="font-family: 宋体;">${tds[i].join("")}</tbody>
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
                  <tbody style="font-family: 宋体;">${tds[i].join("")}</tbody>
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
      return (`
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
                <td align="center">${item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
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
              <td align="center">${item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
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
                  <tbody style="font-family: 宋体;">${tds[i].join("")}</tbody>
                </table>
              </div>
            `)
          } else {
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
                  <tbody style="font-family: 宋体;">${tds[i].join("")}</tbody>
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
        console.log(this.jt)
        if (this.jt["金牌赛"].length != 0) {
          for (const item of this.jt["金牌赛"]) {
            jtds.push(`<tr style="height: 50px; line-height: 50px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
            <td align="center">${item.xcoord}</td>
            <td align="center">${item.ycoord}</td>
          </tr>`)
          }
        }
        if (this.jt["铜牌赛"].length != 0) {
          for (const item of this.jt["铜牌赛"]) {
            ttds.push(`<tr style="height: 50px; line-height: 50px">
            <td align="center">${item.shootCode}</td>
            <td align="center">${item.score}</td>
            <td align="center">${item.beginTime.length <= 19 ? item.beginTime : item.beginTime.substring(0, item.beginTime.length - 7)}</td>
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

        const table = ttds.length ? (`
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
            ${ttds.join("")}
          </tbody>
        `) :
          `
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
          ${jtds.join("")}
        </tbody>
        `
        return (`
          <div>
            <p style="font-size: 24px"><b>靶位:${this.formData.targetSite}</b></p>
            <p style="font-size: 24px"><b>时间:${this.formData.sgTimeStart}</b></p>
            <p style="font-size: 24px"><b>${this.formData.detailScoreList[0].projectName}</b></p>
            <p style="font-size: 24px"><b>${this.formData.playerName}</b></p>
            <table align="center" cellspacing="0" border="0" style="width: 100%;font-family: 宋体;">
              ${table}
            </table>
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
    // 打印
    handlePrint(e) {
      console.log(e, 'wertqq1')
      // const prints = (fn) => {
      //   const iframe = document.createElement("iframe")
      //   document.body.appendChild(iframe)
      //   iframe.contentWindow.document.open()
      //   // iframe.contentWindow.document.write(this.bodyContent());
      //   iframe.contentWindow.document.write(fn())
      //   iframe.width = '100%'
      //   iframe.height = '800px'
      //   setTimeout(() => {
      //     iframe.contentWindow.print()
      //     iframe.contentWindow.document.close()
      //     iframe.contentWindow.addEventListener('afterprint', () => {
      //       iframe.contentWindow.document.close()
      //       document.body.removeChild(iframe)
      //     })
      //     document.body.removeChild(iframe)
      //   }, 50)
      // }
      // console.log(this.stageName)
      // if (this.stageName.includes('团体')) {
      //   prints(this.groupContent)
      // } else {
      //   if (this.name == '资格赛') {
      //     prints(this.bodyContent)
      //   } else {
      //     prints(this.bodyContent2)
      //   }
      // }
    },
  }

}
</script>

<style lang="less" scoped>
.tongChengBox {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.tableClass {
  margin-top: 10px;
}
</style>