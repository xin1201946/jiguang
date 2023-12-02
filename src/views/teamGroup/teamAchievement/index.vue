<template>
<div class="teamAchievement">
  <TreeCard>
    <template slot="tree">
      <div class="tree">
        <div class="input">
          <a-form-model @keyup.enter.native="search">
            <a-form-model-item>
              <a-input v-model="contestName" allowClear>
                <div slot="addonAfter" style="cursor: pointer" @click="search">
                  <a-icon type="search"/>
                </div>
              </a-input>
            </a-form-model-item>
          </a-form-model>
        </div>
        <div class="radio">
          <a-radio-group v-model="contestId" @change="treeChange">
            <a-radio class="radioStyle" v-for="item in contestList" :value="item.contestId" :key="item.contestId">{{item.contestName}}</a-radio>
          </a-radio-group>
        </div>
      </div>
    </template>
    <template slot="query">
      <QuerySearch  ref="search" @reset="handleSearch" @submit="handleSearch"/>
    </template>
    <template slot="operator"></template>
    <template slot="default">
      <a-table
        :pagination="pagination"
        @change="handleTableChange"
        bordered
        :columns="columns"
        :data-source="data"
      >
<!--        :scroll="{x: 1400}"-->
      </a-table>
    </template>
  </TreeCard>
</div>
</template>

<script>
import TreeCard from '@comp/card/TreeCard.vue'
import { bizContestList } from '@api/competition'
import QuerySearch from '@comp/query/QuerySearch.vue'
import BizMixins from '@views/biz/bizMixins'
import { teamAchievementColumns, teamAchievementSearch } from '@views/teamGroup/teamAchievement/teamAchievement.config'

export default {
  name: 'teamAchievement',
  components: {
    TreeCard,
    QuerySearch
  },
  mixins: [BizMixins],
  data() {
    return {
      contestList: [],
      contestName: '',
      contestId: '',
      query: {},
      columns: teamAchievementColumns,
      data: []
    }
  },
  watch:{
    $route:{
      handler() {
        this.getContest()
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.$refs.search.init(teamAchievementSearch)
    // this.getContest()
  },
  methods: {
    getContest () {
      bizContestList({
        contestName: this.contestName
      }).then(res => {
        this.contestList = res.result
        if (this.contestList.length) {
          const contestId = JSON.parse(JSON.stringify(this.contestId))
          // console.log(contestId)
          let flag = true
          // 列表中如果没有 选中的contestId 赋值
          for (const item of this.contestList) {
            if (item.contestId === contestId) {
              flag = false
            }
          }
          if (flag) {
            // contestId赋值后清空查询组件的参数并重新查询
            this.contestId = res.result[0].contestId
            this.$nextTick(() => {
              this.$refs.search.handleReset()
            })
          }
        }
      })
    },
    search() {
      this.getContest()
    },
    treeChange(e) {
      this.contestId = e.target.value
      this.$nextTick(() => {
        this.$refs.search.handleReset()
      })
    },
    getList() {
      const data = {
        ...this.query,
        contestId: this.contestId,
      }
      this.columns = teamAchievementColumns.map(item => {
        if (item.children) {
          const children = [
            {
              title: '10',
              align: 'center'
            },
            {
              title: '20',
              align: 'center'
            },
            {
              title: '30',
              align: 'center'
            },
          ]
          return {
            ...item,
            children
          }
        }
        return item
      })
      console.log(data)
    }
  }
}
</script>

<style scoped lang="less">
.teamAchievement{
  height: 100%;
  .tree{
    height: 100%;
    overflow: hidden;
    .input{
      height: 50px;
      /deep/.ant-input-group-addon{
        cursor: pointer;
      }
    }
    .radio{
      height: calc(100% - 50px);
      overflow-y: auto;
      overflow-x: hidden;
      .radioStyle{
        width: 180px;
        display: block;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
</style>