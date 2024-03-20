<template>
  <div class="tongChengBox">
    <Card>
      <template slot="query">
        <!-- <div style="display: flex;justify-content: space-between;"> -->
        <QuerySearch ref="query"></QuerySearch>
        <!-- <a-button type="primary" @click="handlePrint">成绩打印</a-button> -->
        <!-- </div> -->
      </template>
      <div>
        <a-form :form="formData" layout="inline">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="赛事名称">
                <a-select allowClear v-model="formData.contestId" @change="handleChangePro">
                  <a-select-option v-for="item in dataContList" :key="item.contestId" :value="item.contestId">{{
          item.contestName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="项目名称">
                <a-select allowClear v-model="formData.cproId" @change="handleChangePro1" style="width: 16vw;">
                  <a-select-option v-for="item in projectList" :key="item.cproId" :value="item.cproId">{{
          item.projectName
        }}-{{ item.projectGroup }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="7" :lg="7" :md="8" :sm="24">
              <a-form-item label="阶段" style="width: 100%;">
                <a-select allowClear v-model="formData.cproStageId" @change="handleChangePro2" style="width: 150px">
                  <a-select-option v-for="item in matchList" :key="item.cproStageId" :value="item.cproStageId">{{
          item.stageName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 表格 -->
      <div class="tableClass">
        <a-table :rowSelection="rowSelection" :rowClassName="(r, i) => rowClassName(r, i)" bordered rowKey="playerId"
          :pagination="false" :columns="columns" :dataSource="dataSource" :loading="loading" :scroll="{ x: 1500 }">
          <template v-for="col in customRenderList" v-slot:[col]="text, record, index">
            <div :key="col" @contextmenu.prevent="handleActionsColumnContextMenu(record, $event, col)">
              <a-input placeholder="请输入" v-if="record.editable" :value="text"
                @change="e => handleChange(e.target.value, record.serialNumber, col)"
                @blur="handleBlur(record.serialNumber)" />
              <template v-else>
                <!-- 单击 -->
                <a @click="editAchievement(record.serialNumber)">{{ text }}---*</a>
              </template>
            </div>
          </template>
        </a-table>
      </div>
    </Card>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@/components/query/QuerySearch.vue'
import { bizContestPageList, bizContestProjectList, bizContestProjectStageList, getStagePlayerGroup } from '@api/competition'
import { chengTongListQuery } from '@views/Competition/chengTongScorePage/chengTongList.config.js'
export default {
  name: 'chengTongScorePage',   // 成统页面
  components: {
    Card,
    QuerySearch,
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
      customRenderList: ['qaz1', 'qaz2', 'qaz3'],
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
    this.$refs.query.init(chengTongListQuery)
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
          this.getListMatch()
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
        contestId: "4",
        cproId: this.cproId,
      }
      bizContestProjectStageList(a).then((res) => {
        console.log(res, 'www')
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
        // contestId: this.data.contestId, //赛事id
        contestId: 4, //赛事id
        cproId: this.cproId, //赛事项目id
        stageId: this.cproStageId, //项目阶段id
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
          this.dataSource = item.bizContestPlayerList.map((item, i) => ({
            ...item,
            i,
          }))
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
      for (let i = 1; i <= strArr.length; i++) {
        arrColumns.push({
          dataIndex: `qaz${i}`,
          title: `${i}0组`,
          align: 'center',
          scopedSlots: {
            customRender: `qaz${i}`
          },
        })
      }
      // }
      this.columns.push(...arrColumns)
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