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
    </template>
  </TreeCard>
</template>

<script>
import TreeCard from '@comp/card/TreeCard.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
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
    QuerySearch
  },
  data() {
    return {
      equipmentNum: 0,
      treeData,
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
    }
  },
  updated() {
    this.$refs.query.init(this.search)
  }
}
</script>


<style scoped lang="less">

</style>