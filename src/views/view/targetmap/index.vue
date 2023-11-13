<template>
  <TreeCard>
    <template slot="tree">
      <h1>
        运行中设备
        <span>{{equipmentNum}}</span>
      </h1>
      <a-tree :tree-data="treeData"></a-tree>
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
const treeData = [
  {
    title: '全部',
    key: '-1',
  },
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },

];
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
      treeData,
      pagination: {
        total: 20,
        current: 1,
        pageSize: 6
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
          type: "input",
          rules: [
            'project',
            { rules: [{ required: false, message: '请输入项目名称' }] },
          ],
          label: '项目名称',
          placehorder: '请输入项目名称'
        },
        {
          type: "select",
          rules: [
            'equipment',
            { rules: [{ required: false, message: '请选择设备类型' }] },
          ],
          label: '设备类型',
          data: [
            {
              value: 0,
              label: '关闭'
            },
            {
              value: 1,
              label: '运行中'
            }
          ],
          placehorder: '请选择设备类型'
        }
      ]
    }
  },
  mounted() {
    this.$refs.query.init(this.search)
  },
  methods: {
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