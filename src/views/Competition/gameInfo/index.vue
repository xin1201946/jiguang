<template>
  <div class="gameInfo">
    <div class="btns">
      <a-page-header
        @back="handleBack"
        title="2023年中小学生激光设计比赛"
      ></a-page-header>
    </div>
    <div class="cards">
      <TreeCard :width="true">
        <template slot="tree">
          <a-directory-tree
            multiple
            default-expand-all
            @select="onSelect"
            @expand="onExpand"
          >
            <a-tree-node
              v-for="item in treeList"
              :key="item.projectId + item.projectGroup"
              :title="item.projectName + ' - ' + item.projectGroup"
            >
              <a-tree-node
                v-for="i in item.children"
                is-leaf
                :slots="{title: 'title'}"
                :key="i.cproStageId"
              >
                <template slot="title">
                  <div class="title">
                    <span>{{i.stageName}}</span>
                    <a-space>
                      <a-button @click="handleZhunbei(i)" size="small">准备</a-button>
                      <a-button @click="handleShishe(i)" size="small">试射</a-button>
                      <a-button @click="handleBisai(i)" size="small">比赛</a-button>
                    </a-space>
                  </div>
                </template>
              </a-tree-node>
            </a-tree-node>
          </a-directory-tree>
        </template>
        <template slot="query">
          <QuerySearch ref="query"></QuerySearch>
        </template>
        <template slot="operator">
          <a-space v-show="cproStageId !== null">
            <a-button type="primary">导入参赛人员</a-button>
            <a-button type="primary" @click="handleGroup">分组</a-button>
            <a-button v-show="group !== null" type="primary" @click="handleDraw">抽签</a-button>
<!--            选中组别-->
            <a-button v-show="group !== null && draw" type="primary">推送大屏</a-button>
            <a-button v-show="group !== null && draw" type="primary">推送平板</a-button>
          </a-space>
        </template>
        <div class="gameInfoTables" v-show="groupActive">
          <div class="gameInfoTables_group">
            <a-radio-group v-model="group">
              <a-radio
                style="display: block;height: 30px;line-height: 30px;"
                v-for="item in 5"
                :value="item"
                :key="item"
              >{{ numToCapital(item) }}组</a-radio>
            </a-radio-group>
          </div>
          <div class="gameInfoTables_table">
            <a-table
              :columns="columns"
            ></a-table>
          </div>
        </div>
        <a-table
          v-show="!groupActive"
          :columns="columns"
        ></a-table>
        <gameInfoDrawModal ref="draw" @list="drawList"></gameInfoDrawModal>
        <gameInfoTargetModal></gameInfoTargetModal>
        <GameInfoGroupModal ref="group" @list="groupList"></GameInfoGroupModal>
      </TreeCard>
    </div>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { gameInfoColumns, gameInfoQuery } from '@views/Competition/gameInfo/gameInfo.config'
import gameInfoTargetModal from '@views/Competition/gameInfo/modal/gameInfoTargetModal.vue'
import gameInfoDrawModal from '@views/Competition/gameInfo/modal/gameInfoDrawModal.vue'
import GameInfoGroupModal from '@views/Competition/gameInfo/modal/gameInfoGroupModal.vue'
import TreeCard from '@comp/card/TreeCard.vue'
import { bizContestProjectList, bizContestProjectStageList } from '@api/competition'
import { numToCapital } from '@/utils'

export default {
  name: 'gameInfo',
  components: {
    TreeCard,
    Card,
    QuerySearch,
    gameInfoTargetModal,
    gameInfoDrawModal,
    GameInfoGroupModal
  },
  inject: ["closeCurrent"],
  data() {
    return {
      title: '项目名称',
      contestId: '6',
      treeList: [],
      cproStageId: null,
      columns: gameInfoColumns,
      group: null,
      groupActive: false,
      draw: false
    }
  },
  methods: {
    numToCapital,
    /**
     * 头部返回
     */
    handleBack() {
      this.$nextTick(() => {
        // this.$router.push('/competition/game')
        this.closeCurrent()
      })
    },
    /**
     * 主表单按钮功能
     */
    handleDraw() {
      this.$refs.draw.init()
    },
    handleGroup () {
      this.$refs.group.init()
    },
    /**
     * 获取数据
     */
    getProjectList() {
      bizContestProjectList({
        contestId: this.contestId
      }).then(res => {
        const arr = res.result.map(async (item) => {
          const stage = await bizContestProjectStageList({
            contestId: item.contestId,
            cproId: item.cproId
          })
          return {
            ...item,
            children: stage.result.length ? stage.result : []
          }
        })
        this.getTree(arr)
      })
    },
    getTree(arr) {
      Promise.all(arr).then(res => {
        this.treeList = res
      })
    },
    /**
     * 左侧功能
     */
    onSelect(keys, event) {
      // isLeaf 为true时是最底层
      // keys 阶段id
      if (event.node.isLeaf) {
        this.cproStageId = keys[0]
        this.draw = false
        this.group = null
        this.groupActive = false
      }else {
        this.cproStageId = null
        this.draw = false
        this.group = null
        this.groupActive = false
      }
    },
    onExpand() {},
    handleZhunbei(row) {
      console.log('zhunbei')
    },
    handleShishe(row) {
      console.log('shishe')
    },
    handleBisai(row) {
      console.log('bisai')
    },
    /**
     * 弹窗回调
     */
    drawList() {
      this.draw = true
    },
    groupList() {
      this.groupActive = true
    }
  },
  mounted() {
    this.$refs.query.init(gameInfoQuery)
    this.getProjectList()
  }
}
</script>

<style scoped lang="less">
@btnHeight: 50px;
.gameInfo{
  height: 100%;
  overflow: hidden;
  .btns {
    height: @btnHeight;
    background: #fff;
    margin-bottom: 10px;
    line-height: @btnHeight;
    overflow: hidden;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    justify-content: space-between;
  }

  .cards {
    height: calc(100% - @btnHeight - 10px);
    /deep/.ant-tree-child-tree.ant-tree-child-tree-open{
      //选中后设置背景色及高度
      .ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-normal.ant-tree-node-selected::before{
        height: 30px
      }

      li{
        display: flex;
      }
      .ant-tree-treenode-selected{

      }
      .ant-tree-node-content-wrapper.ant-tree-node-content-wrapper-normal{
        display: flex;
        align-items: center;
      }
    }
    .title{
      display: flex;
      width: 300px;
      justify-content: space-between;
      //height: 50px;
      align-items: center;
    }
  }
  .gameInfoTables{
    height: 100%;
    overflow: hidden;
    display: flex;
    &_group{
      min-width: 100px;
      height: 100%;
      overflow: auto;
    }
    &_table{
      flex: 1;
      height: 100%;
      overflow: auto;
    }
  }
}
.query{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tables{
  overflow: hidden;
  max-height: 640px;
  &_top{
    margin-bottom: 20px;
    width: 100%;
    height: 340px;
  }
  &_buttom{
    height: 300px;
  }
}
</style>