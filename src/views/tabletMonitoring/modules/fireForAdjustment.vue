<template>
  <div>
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="7" :lg="8" :md="8" :sm="24">
            <a-form-item label="平板编号：">
              <a-input v-model="params.tabletPcNum" placeholder="请输入平板编号" />
            </a-form-item>
          </a-col>
          <a-col :xl="7" :lg="8" :md="8" :sm="24">
            <a-form-item label="分数：">
              <a-input v-model="params.score" placeholder="请输入分数" />
            </a-form-item>
          </a-col>
          <a-col :xl="8" :lg="8" :md="8" :sm="24">
            <a-form-item label="开始时间：">
              <a-date-picker show-time placeholder="请选择开始时间" :allowClear="false" value-format="YYYY-MM-DD HH:mm:ss"
              v-model="params.beginTime" @change="selectOver" :disabled-date="disabledStartDate" format="YYYY-MM-DD HH:mm:ss" />
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
    <a-table ref="table" size="middle" rowKey="id" :columns="columns" :pagination="ipagination" :dataSource="dataSource"
      @change="handleTableChange" :loading="loading">
    </a-table>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { postAction } from '@/api/manage'
import monuntDate from 'moment' //引入moment插件
export default {
  name: 'fireForAdjustment', //试射
  mixins: [JeecgListMixin],
  data() {
    return {
      title: '试射',
      dataSource: [],
      provinceData: [],
      url: {
        list: '/bizDeviceScore/selectDeviceList',
      },
      columns: [
        {
          title: '平板编号',
          align: 'center',
          dataIndex: 'tabletPcNum'
        },
        {
          title: '总数量',
          align: 'center',
          dataIndex: 'scoreCount'
        },
      ],
      visible: false, //判断组件中 created 中是否请求列表的
      params: {},
    }
  },
  methods: {
    init(res) {
      this.params = res
      this.$nextTick(() => {
        this.loadData(1)
      })
    },
    loadData(arg) {
      console.log(arg)
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
    // 选择时间
    selectOver(e){
      this.params.beginTime = e
    },
    // 时间禁用
    disabledStartDate(current) {
      return current && current > monuntDate().endOf('day')
    },
    searchReset(){
      this.params.tabletPcNum = undefined
      this.params.score = undefined
      this.params.beginTime = undefined
      this.loadData(1)
    },
  }
}
</script>

<style lang="less" scoped></style>