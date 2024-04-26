<template>
  <div class="tongChengBox">
    <Card>
      <template slot="query">
        <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
          <a-row :gutter="24">
            <a-col :md='24'
                   :lg='12'
                   :xl='6'
                   :xxl='4'>
              <a-form-item label="赛事名称">
                <a-select allowClear v-model="formData.contestId" @change="handleChangePro">
                  <a-select-option v-for="item in dataContList" :key="item.contestId" :value="item.contestId">{{
          item.contestName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md='24'
                   :lg='12'
                   :xl='6'
                   :xxl='4'>
              <a-form-item label="项目名称">
                <a-select allowClear v-model="formData.cproId" @change="handleChangePro1" style="width: 100%;">
                  <a-select-option v-for="item in projectList" :key="item.cproId" :value="item.cproId">{{
          item.projectName
        }}-{{ item.projectGroup }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md='24'
                   :lg='12'
                   :xl='6'
                   :xxl='4'>
              <a-form-item label="阶段">
                <a-select allowClear v-model="formData.cproStageId" @change="handleChangePro2" style="width: 100%">
                  <a-select-option v-for="item in matchList" :key="item.cproStageId" :value="item.cproStageId">{{
          item.stageName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md='24'
                   :lg='12'
                   :xl='6'
                   :xxl='4'>
              <a-form-item label="靶位">
                <a-input placeholder="请输入靶位号" v-model="formData.targetSite" />
              </a-form-item>
            </a-col>
            <a-col :md='24'
                   :lg='12'
                   :xl='6'
                   :xxl='4'>
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
        <div class="gameInfoTables_group" v-if="groupList.length">
            <a-tabs v-model="group" @change="radioChangeHandle">
              <a-tab-pane v-for="item in groupList" :value="item.group" :key="item.group"
                :tab="`${numToCapital(item.group)}组`"></a-tab-pane>
            </a-tabs>
          </div>
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
    <RealTimeViewPrint ref="print"></RealTimeViewPrint>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@/components/query/QuerySearch.vue'
import GameInfoAchievementModal from '@views/Competition/gameInfo/modal/gameInfoAchievementModal.vue'
import RealTimeViewPrint from '@views/Competition/RealTimeView/modal/RealTimeViewPrint.vue'
import { bizContestPageList, bizContestProjectList, bizContestProjectStageList, getStagePlayerGroup, bizPlayerFinalScoreSportsScoresList } from '@api/competition'
import { numToCapital, infoMessage, deleteMessage } from '@/utils'
export default {
  name: 'chengTongScorePage',   // 成统页面
  components: {
    Card,
    QuerySearch,
    GameInfoAchievementModal,
    RealTimeViewPrint,
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
      sNamevisible: true,
      groupList:[],
      group:null,
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
      const arrs = this.matchList.filter((item) => item.cproStageId === re)
      if (arrs[0].stageName.includes("金/铜牌赛")) {
        this.sNamevisible = false
      } else {
        this.sNamevisible = true
      }
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
      // }\
      if (this.sNamevisible === true) {
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
      } else {
        this.columns.push(...arrColumns)
      }
    },
    numToCapital,
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
      event.preventDefault() // 阻止默认的右键菜单
      // 在这里添加你的自定义右键菜单逻辑
      this.$refs.Achievement.edit({ ...record, stageId: this.cproStageId, projectName: this.projectName })
    },
    // 打印的资格赛
    // 打印
    handlePrint(e) {
      bizPlayerFinalScoreSportsScoresList({
        contestId: this.contestId,
        playerId: e.playerId,
        cproId: this.cproId,
        cproStageId: this.cproStageId
      }).then(res => {
        if (res.code === 200) {
          this.$refs.print.init({
            list: res.result,
            stageName: e.project1,   //"10米激光手枪30发" 填写这个词
            stageId: this.cproStageId
          })
        } else {
          this.$message.warning(res.message)
        }
      })
      // const arrs = this.matchList.filter((item) => item.cproStageId === this.cproStageId)
      // if (arrs[0].stageName === '资格赛') {
      //   prints(this.bodyContent)
      // } else {
      //   prints(this.bodyContent2)
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

/deep/.ant-table-tbody .ant-table-row td {
  padding: 5px 0;
}
</style>