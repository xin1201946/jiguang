<template>
  <div class="box">
    <Card>
      <template slot="query">
        <div style='display: flex; align-items: center'>
          <div style='flex: 1'>
            <a-form :form="form" layout="inline">
              <a-row :gutter="24">
                <a-col :xl="4" :lg="6" :md="7" :sm="8" :xs="24">
                  <a-form-item label="平板编号">
                    <!--                <a-date-picker v-model="form.projectTime" :disabled-date="disabledDate" valueFormat="YYYY-MM-DD"-->
                    <!--                  @change="handlePickers"></a-date-picker>-->
                    <a-input v-model='form.tablePc' placeholder="请输入平板编号"></a-input>
                  </a-form-item>
                </a-col>
                <a-col :xl="4" :lg="6" :md="7" :sm="8" :xs="24">
                  <a-form-item label="起止日期">
                    <a-date-picker v-model="form.dataTime" :disabled-date="disabledDate" valueFormat="YYYY-MM-DD"
                                   @change="handlePickers"></a-date-picker>
                  </a-form-item>
                </a-col>
                <a-col :xl="4" :lg="6" :md="7" :sm="8" :xs="24">
                  <a-form-item>
                    <a-space>
                      <a-button type="primary" icon="search" @click="handleSubmit">查询</a-button>
                      <a-button @click="handleReset" icon="reload">重置</a-button>
                    </a-space>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
          <div style='width: 40px; cursor: pointer; height: 40px' >
            <a-icon type="bar-chart" v-show='!tab' @click='handleTabPc' style="font-size: 40px; color: #08c; cursor: pointer" />
<!--            <a-icon type="bars" />-->
            <a-icon type="table" v-show='tab' @click='handleTabPc' style="font-size: 40px; color: #08c; cursor: pointer"/>
          </div>
        </div>
      </template>
      <div>
        <!--表格 -->
        <div class="tableClass" v-if='!tab'>
          <!-- :rowSelection="rowSelection" :rowClassName="(r, i) => rowClassName(r, i)" -->
          <a-table
            bordered
            rowKey="playerId"
            :pagination="pagination"
            :columns="columns"
            :dataSource="dataSource"
            :loading="loading"
            @change="handleTableChange"
          >
            <template slot="directionPointSlots" slot-scope="text,record">
              <!-- 命中区位1上；2下，3左，4右，5右上，6右下 ，7左上，8左下 -->
              <span>{{ text === 1 ? '上' : text === 2 ? '下' : text === 3 ? '左' : text === 4 ? '右' : text === 5 ? '右上' :
          text === 6 ? '右下' : text === 7 ? '左上' : text === 8 ? '左下' : '' }}</span>
            </template>
            <!-- 操作 -->
            <!-- <template slot="operation" slot-scope="text, record">
            <a-space>
              <a-button type="primary" size="small" ghost icon="profile" @click="handleDetails(record)">详情</a-button>
            </a-space>
          </template> -->
          </a-table>
        </div>
        <!-- 图表 -->
        <div class="box" v-if='tab'>
          <div id="main" class="box_E"></div>
        </div>
      </div>
    </Card>
    <PersonalModal ref="personalModalRef"></PersonalModal>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import bizMixins from '@views/biz/bizMixins'
import { bizTrainScoreQueryScoreList } from '@/api/biz'
import PersonalModal from './modal/personalModal.vue'
import * as echarts from 'echarts'
import moment from 'moment'
export default {
  name: 'personalAchievements',  //个人成绩
  components: {
    Card,
    PersonalModal,
  },
  mixins: [bizMixins],
  data() {
    return {
      form: {
        dataTime: '',
        tablePc: ''
      },
      loading: false,
      tab: false,
      columns: [
        {
          dataIndex: 'userAccount',
          title: '用户账号',
          align: 'center',
        },
        {
          dataIndex: 'tablePc',
          title: '平板编号',
          align: 'center',
        },
        {
          dataIndex: 'groupCount',
          title: '组数',
          align: 'center',
        },
        {
          dataIndex: 'shootCode',
          title: '序号',
          align: 'center',
        },
        {
          dataIndex: 'score',
          title: '环数',
          align: 'center',
        },
        {
          dataIndex: 'dataTime',
          title: '射击时间',
          align: 'center',
        },
        {
          dataIndex: 'directionPoint',
          title: '区位',
          align: 'center',
          scopedSlots: {
            customRender: 'directionPointSlots',
          },
          // 命中区位1上；2下，3左，4右，5右上，6右下 ，7左上，8左下
        },
        {
          dataIndex: 'tabletPcModel',
          title: '模式',
          align: 'center',
          customRender: (text, record, index) => {
            return record.tabletPcModel == '1' ? '比赛中' : record.tabletPcModel == '-1' ? '等待中' : '试射'
          },
          // -1等待中0试射 1比赛中
        },
        // {
        //   title: '操作',
        //   dataIndex: 'deviceId',
        //   align: 'center',
        //   scopedSlots: {
        //     customRender: 'operation'
        //   },
        //   fixed: 'right',
        //   width: 200
        // }
      ],
      dataSource: [],
      selectedRowKeys: [],
      selectionRows: [],
      names: undefined,
      arr: [],
      arrData: []
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
    // this.getList()
    this.form.dataTime = moment().format('YYYY-MM-DD')
  },
  methods: {
    handleTabPc() {
      this.tab = !this.tab
      if (this.tab) {
        this.arr = []
        this.arrData = []
        bizTrainScoreQueryScoreList({
          ...this.form,
          column: 'createTime',
          order: 'asc',
          pageNo: 1,
          pageSize: 9999,
        }).then((res) => {
            res.result.records.filter((item) => item.dataTime).map((item) => {
            // console.log(item)
            this.arr.push(item.dataTime)
            this.arrData.push(item.score)
          })
          this.$nextTick(() => {
            this.handleEcharts(this.arr, this.arrData)
          })
        })
      }else {
        this.getList()
      }
    },
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    getList() {
      this.loading = true
      this.dataSource = []
      // let arr = []
      // let arrData = []
      // this.arr = []
      // this.arrData = []
      bizTrainScoreQueryScoreList({
        ...this.form,
        // order: {
        //   createTime: "desc"
        // },
        column: 'createTime',
        order: 'desc',
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
      }).then((res) => {
        if (res.success) {
          if (res.result.records.length) {
            this.dataSource = res.result.records
            this.names = this.dataSource[0].userAccount
            this.pagination.total = res.result.total
            this.pagination.current = res.result.current
            this.pagination.pageSize = res.result.size
            // this.dataSource.map((item) => {
            //   this.arr.push(item.shootCode)
            //   this.arrData.push(item.score)
            // })
            // this.$nextTick(() => {
            //   this.handleEcharts(this.arr, this.arrData)
            // })
            // this.loading = false
          }
        } else {
          this.$message.error(res.message)

        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleEcharts(arr, arrData) {
      var chartDom = document.getElementById('main')
      var myChart = echarts.init(chartDom)
      var option
      option = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var relVal = params[0].name
            // console.log(params)
            for (var i = 0; i < params.length; i++) {
              relVal += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value + '环'
            }
            return relVal
          }
        },
        xAxis: {
          type: 'category',
          data: arr
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: arrData,
            type: 'line',
            smooth: true,
            name: this.names,
          }
        ]
      }
      option && myChart.setOption(option)
    },
    // 选择日期
    handlePickers(date) {
      console.log(date,)
      this.form.dataTime = date
      this.$forceUpdate()
    },
    // 查询
    handleSubmit() {
      this.pagination.current = 1
      this.pagination.pageSize = 10
      if (this.tab) {
        this.arr = []
        this.arrData = []
        bizTrainScoreQueryScoreList({
          ...this.form,
          column: 'createTime',
          order: 'asc',
          pageNo: 1,
          pageSize: 9999,
        }).then((res) => {
          res.result.records.filter((item) => item.dataTime).map((item) => {
            // console.log(item)
            this.arr.push(item.dataTime)
            this.arrData.push(item.score)
          })
          this.$nextTick(() => {
            this.handleEcharts(this.arr, this.arrData)
          })
        })
      }else {
        this.getList()
      }
    },
    handleReset() {
      this.form.tablePc = ""
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.form.dataTime = moment().format('YYYY-MM-DD')
      if (this.tab) {
        this.arr = []
        this.arrData = []
        bizTrainScoreQueryScoreList({
          ...this.form,
          column: 'createTime',
          order: 'asc',
          pageNo: 1,
          pageSize: 9999,
        }).then((res) => {
          res.result.records.filter((item) => item.dataTime).map((item) => {
            // console.log(item)
            this.arr.push(item.dataTime)
            this.arrData.push(item.score)
          })
          this.$nextTick(() => {
            this.handleEcharts(this.arr, this.arrData)
          })
        })
      }else {
        this.getList()
      }
    },
  }
}
</script>

<style lang="less" scoped>
.tableClass {
  height: 300px;
  margin-bottom: 50px;
}

.box {
  width: 100%;
  height: 100%;

  .box_E {
    width: 100%;
    height: 66vh;
  }
}

/deep/.ant-table-body::-webkit-scrollbar {
  width: 8px !important;
}
</style>>