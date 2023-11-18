<template>
  <div class="tree">
    <a-row>
      <a-col>
        <a-select
          show-search
          style="width: 100%"
          :filter-option="filterOption"
        >

        </a-select>
      </a-col>
    </a-row>
    <a-tree
      :treeData="treeData"
      :loadData="loadData"
      @select="handleSelect"
    ></a-tree>
  </div>
</template>

<script>
import { bizContestList, bizContestProjectList } from '@api/competition'

export default {
  name: 'ParticipantTree',
  data() {
    return {
      treeData: [],
      list: []
    }
  },
  watch: {
    $route: {
      handler(n) {
        if (this.$route.query.id) {
          this.getList()
          this.getProjectList()
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {

  },
  methods: {
    handleSelect(selectedKeys, { node }) {
      this.$emit("change", node.dataRef)
    },
    getList(v) {
      const data = {}
      if (this.$route.query.id) {
        data.contestId = this.$route.query.id
      }
      if (v) {
        data.contestId = v.contestId
      }
      bizContestProjectList(data).then(res => {
        if (res.result.length) {
          if (this.$route.query.id){
            this.treeData = res.result.map(item => {
              return {
                ...item,
                title: item.projectName,
                key: item.cproId,
                isLeaf: true,
              }
            })
          } else {
            v.children = res.result.map(item => {
              return {
                ...item,
                title: item.projectName,
                key: item.cproId + 'cproId',
                isLeaf: true,
              }
            })
          }
        }
      })
    },
    getProjectList() {
      bizContestList({}).then(res => {
        if (res.code === 200) {
          this.list = res.result
        }
      })
    },
    loadData(node) {
      this.getList(node.dataRef)
    },
    filterOption(input, option) {

    }
  }
}
</script>


<style scoped lang="less">
.tree{
  height: 100%;
  overflow-y: hidden;
}
</style>