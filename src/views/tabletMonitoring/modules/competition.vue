<template>
  <div class="box">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!-- <a-col :xl="5" :lg="5" :md="8" :sm="24">
            <a-form-item label="组别：">
              <a-input v-model="queryParam.tomcatAddress" placeholder="请输入组别" />
            </a-form-item>
          </a-col>
          <a-col :xl="5" :lg="5" :md="8" :sm="24">
            <a-form-item label="赛事：">
              <a-select v-model="queryParam.categoryCode" placeholder="请选择赛事" show-search>
                <a-select-option v-for="province in provinceData" :key="province.categoryCode"
                  :value="province.categoryCode">
                  {{ province.categoryName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="5" :lg="5" :md="8" :sm="24">
            <a-form-item label="项目：">
              <a-select v-model="queryParam.categoryCode" placeholder="请选择项目" show-search>
                <a-select-option v-for="province in provinceData" :key="province.categoryCode"
                  :value="province.categoryCode">
                  {{ province.categoryName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="5" :lg="5" :md="8" :sm="24">
            <a-form-item label="阶段：">
              <a-select v-model="queryParam.categoryCode" placeholder="请选择阶段" show-search>
                <a-select-option v-for="province in provinceData" :key="province.categoryCode"
                  :value="province.categoryCode">
                  {{ province.categoryName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col> -->
          <a-col :xl="8" :lg="8" :md="8" :sm="24">
            <a-form-item label="平板编号：">
              <a-input v-model="params.tabletPcNum" placeholder="请输入平板编号" />
              <!-- <a-select v-model="params.tabletPcNum" placeholder="请选择编号" show-search>
                <a-select-option v-for="province in provinceData" :key="province.tabletPcNum"
                  :value="province.tabletPcNum">
                  {{ province.categoryName }}
                </a-select-option>
              </a-select> -->
            </a-form-item>
          </a-col>
          <a-col :xl="8" :lg="8" :md="8" :sm="24">
            <a-form-item label="打印状态：">
              <a-select v-model="params.printStatus" placeholder="请选择打印状态" show-search>
                <a-select-option value="0">未打印</a-select-option>
                <a-select-option value="1">已打印</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 列表 -->
    <div>
      <a-table ref="table" size="middle" rowKey="id" :rowClassName="(r, i) => rowClassName(r, i)" :columns="columns"
        :pagination="ipagination" :dataSource="dataSource" @change="handleTableChange" :loading="loading">
        <template slot="operation" slot-scope="text, record">
          <a-button type="link" size="small" icon="edit"
            v-if="record.printStatus === '0' && record.shootCode >= record.projectTotal"
            @click="handleModifyprinting(record)">修改打印状态</a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { postAction } from '@/api/manage'
import { numToCapital, infoMessage, deleteMessage } from '@/utils'
export default {
  name: 'competition', //比赛
  components: {
  },
  mixins: [JeecgListMixin],
  data() {
    return {
      title: '正式比赛',
      dataSource: [],
      provinceData: [],
      url: {
        list: '/bizPlayerScore/selectDeviceList',
        statusList: '/bizPlayerScore/updatePrintStatus',
      },
      columns: [
        {
          title: '平板编号',
          align: 'center',
          dataIndex: 'tabletPcNum'
        },
        // {
        //   title: '总发序',
        //   align: 'center',
        //   dataIndex: 'projectTotal'
        // },
        {
          title: '最大发序',
          align: 'center',
          dataIndex: 'shootCode'
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'scoreCount'
        },
        {
          title: '打印状态',
          align: 'center',
          dataIndex: 'printStatus',
          customRender: function (text) {
            if (text === '0') {
              return '未打印'
            } else if (text === '1') {
              return '已打印'
            } else {
              return text
            }
          },
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'operation',
          scopedSlots: {
            customRender: 'operation',
          },
        },
      ],
      visible: false, //判断组件中 created 中是否请求列表的
      params: {},
    }
  },
  // mounted() {
  //   this.loadData()
  // },
  methods: {
    // 背景色
    rowClassName(r, i) {
      if (r.scoreCount !== r.shootCode) {
        return 'red'
      }
      if (r.printStatus === '1') {
        return 'print_btn'
      }
      // if (r.projectTotal === r.shootCode) {
      //   return 'print_btns'
      // }
    },
    init(res) {
      this.params = res
      this.loadData(1)
    },
    loadData(arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      postAction(this.url.list, this.params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records || res.result
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 重置
    searchReset() {
      this.params.tabletPcNum = undefined
      this.params.printStatus = undefined
      this.loadData(1)
    },
    // 修改打印状态
    handleModifyprinting(record) {
      infoMessage('此操作当前靶位的状态修改为已打印！请确认成绩单是否已打印？').then(() => {

        let params = {
          contestId: this.params.contestId, //赛事id
          cproId: this.params.cproId, //赛事项目id
          cproStageId: this.params.cproStageId, //项目阶段id
          stageGroup: this.params.stageGroup, //项目阶段id
          tabletPcNum: record.tabletPcNum, //项目阶段id
        }
        postAction(this.url.statusList, params).then((res) => {
          if (res.success) {
            this.$message.success('修改成功！')
            this.loadData()
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
  }
}
</script>

<style lang="less" scoped>
/deep/.red {
  background: rgba(209, 35, 4, 0.3);
}

/deep/.print_btn {
  background: #519705;
}
</style>