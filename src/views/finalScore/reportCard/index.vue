<template>
  <TreeCard>
    <template slot="tree">
      <div style="height: 100%; overflow-y: auto;overflow-x: hidden; width: 300px">
        <a-tree :tree-data="treeData" v-model="checkedKeys"></a-tree>
      </div>
    </template>
  </TreeCard>
</template>

<script>
import TreeCard from '@comp/card/TreeCard.vue'
import { bizContestList, bizContestProjectList, bizContestProjectStageList } from '@api/competition'

export default {
  name: 'reportCard',
  components: {
    TreeCard
  },
  data() {
    return {
      treeData: [],
      checkedKeys: []
    }
  },
  mounted() {
    this.getContestList()
  },
  methods: {
  //   左侧
    getContestList() {
      // 赛事
      bizContestList().then(res => {
        const arr = res.result.map(async item => {
          // 项目
          const project = await bizContestProjectList({contestId: item.contestId})
          const obj = {
            title: item.contestName,
            key: item.contestId,
            children: this.getProject(project)
          }
          return obj
        })
        Promise.all(arr).then(res => {
          this.treeData = res
          for (const item of res) {
            Promise.all(item.children).then(children => {
              for (const i of this.treeData) {
                if (item.key === i.key) {
                  i.children = children
                }
              }
            })
          }
          this.$nextTick(() => {
            // console.log(this.treeData)
          })
        })
      })
    },
    getProject(project) {
      if (project.result.length) {
        const arr = project.result.map(async item => {
          const obj = {
            title: item.projectName,
            key: item.contestId +"-"+ item.cproId,
          }
          const stage = await bizContestProjectStageList({
            cproId: item.cproId,
            contestId: item.contestId
          })
          if (stage.result.length) {
            obj.children = stage.result.map(item => {
              return {
                title: item.stageName,
                key: item.contestId +"-"+ item.cproId +"-"+ item.cproStageId,
                isLeaf: true
              }
            })
            return obj
          }
          obj.isLeaf = true
          return obj
        })
        return arr
      }
      return Promise.resolve([])
    }


  }
}
</script>

<style scoped lang="less">

</style>