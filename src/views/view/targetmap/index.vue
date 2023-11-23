<template>
  <TreeCard>
    <template slot="tree">
<!--      <h1>-->
<!--        运行中设备-->
<!--        <span>{{equipmentNum}}</span>-->
<!--      </h1>-->
<!--      <a-tree :tree-data="treeData"></a-tree>-->
      <a-radio-group v-model="tree">
        <a-radio
          :style="style"
          v-for="item in treeList"
          :key="item.contestId"
          :value="item.contestId"
        >{{ item.contestName }}
        </a-radio>
      </a-radio-group>
    </template>
    <template slot="query">
      <QuerySearch
        ref="query"
        @reset="handleReset"
        @submit="handleSubmit"
      ></QuerySearch>
    </template>
    <template slot="default">
      <div style="height: 640px; overflow-y: auto">
        <ListEchatCard
          v-for="item in list"
          :key="item.id"
          :option="item.options"
          @click="handleClick"
        ></ListEchatCard>
      </div>
      <div class="pagination">
        <a-pagination
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          :current="pagination.current"
        ></a-pagination>
        <TargetMapModal ref="modal"></TargetMapModal>
      </div>
    </template>
  </TreeCard>
</template>

<script>
import TreeCard from '@comp/card/TreeCard.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import TargetMapModal from '@views/view/targetmap/modules/TargetMapModal.vue'
import ListEchatCard from '@views/view/targetmap/modules/ListEchatCard.vue'
import { bizContestList } from '@api/competition'
export default {
  name: 'targetmap',
  components: {
    TreeCard,
    QuerySearch,
    ListEchatCard,
    TargetMapModal
  },
  data() {
    return {
      equipmentNum: 0,
      pagination: {
        total: 20,
        current: 1,
        pageSize: 6
      },
      style: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
        width: '150px',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      },
      list: [
        {
          id: 1,
          options: {
            title: "女子10米激光手枪-资格赛",
            user: "选手1",
            total: '387',
            data: []
          },
        },
        {
          id: 2,
          options: {
            title: "女子10米激光手枪-资格赛",
            user: "选手1",
            total: '387',
            data: []
          },
        },
        {
          id: 3,
          options: {
            title: "女子10米激光手枪-资格赛",
            user: "选手1",
            total: '387',
            data: []
          },
        },
        {
          id: 4,
          options: {
            title: "女子10米激光手枪-资格赛",
            user: "选手1",
            total: '387',
            data: []
          },
        },
        {
          id: 5,
          options: {
            title: "女子10米激光手枪-资格赛",
            user: "选手1",
            total: '387',
            data: []
          },
        },
        {
          id: 6,
          options: {
            title: "女子10米激光手枪-资格赛",
            user: "选手1",
            total: '387',
            data: []
          },
        }
      ],

      search: [
        {
          type: 'input',
          label: '姓名',
          rules: ['a'],
          placeholder: '请输入姓名'
        },
        {
          type: 'select',
          label: '项目名称',
          rules: ['b'],
          placeholder: '请选择项目',
          data: []
        },
        {
          type: 'input',
          label: '阶段名称',
          rules: ['c'],
          placeholder: '请输入阶段名称'
        },
        {
          type: 'input',
          label: '团体名称',
          rules: ['d'],
          placeholder: '请输入团体名称'
        },
      ],
      treeList: [],
      tree: ''
    }
  },
  mounted() {
    this.getTreeList()
    this.$refs.query.init(this.search)
  },
  methods: {
    getTreeList () {
      bizContestList({}).then(res => {
        this.treeList = res.result
        this.tree = res.result[0].contestId
      })
    },
    handleReset(e) {
      console.log(e)
    },
    handleSubmit (e) {
      console.log(e)
    },
    handleClick(e) {
      console.log(e)
      this.$refs.modal.init(e)
    }
  },
  updated() {
    this.$refs.query.init(this.search)
  }
}
</script>


<style scoped lang="less">
.pagination{
  margin-top: 20px;
  display: flex;
  width: 100%;
  justify-content: end;
}

</style>