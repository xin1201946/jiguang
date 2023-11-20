<template>
  <div class="tree">
    <!-- <a-row>
      <a-col>
        <a-select show-search style="width: 100%" :filter-option="filterOption" @change="changeClick" placeholder="请选择赛事"
          v-model="id">
          <a-select-option v-for="item in list" :key="item.contestId" :value="item.contestId">{{ item.contestName }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row> -->
    <a-form>
      <a-form-item>
        <a-radio-group
          v-model="treeKes"
          @change="handleSelect"
        >
          <a-radio
            :style="radioStyle"
            :value="item.key"
            v-for="item in treeData"
          >{{item.projectName ? `${item.projectName} - ${item.projectGroup}` : '全部'}}
          </a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { bizContestList, bizContestProjectList } from '@api/competition'

export default {
  name: 'ParticipantTree',
  data() {
    return {
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      treeData: [
        /* {
          title: '全部',
          key: null,
          isLeaf: true,
        } */
      ],
      list: [],
      id: '',
      treeKes: "-1"
    }
  },
  watch: {
    $route: {
      handler(n) {
        if (this.$route.query.id) {
          this.id = Number(this.$route.query.id)
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
    handleSelect(e) {
      console.log(e.target.value)
      const key = this.treeData.filter(item => item.key === e.target.value)
      console.log(key)
      this.$emit("change", key[0])
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
          if (this.$route.query.id) {
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
        this.treeData.unshift({
          title: '全部',
          key: '-1',
          isLeaf: true,
        })
        this.$emit("treeList", res.result)
        this.treeKes = "-1"
        this.$emit("change", {
          title: '全部',
          key: '-1',
          isLeaf: true,
        })
      })
    },
    getProjectList() {
      bizContestList({}).then(res => {
        if (res.code === 200) {
          this.list = res.result
          console.log(this.list, '123')
        }
      })
    },
    changeClick(event) {
      let a = {
        contestId: event
      }
      this.treeKes = []
      this.getList(a)
      this.$emit('contest', event)
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
.tree {
  height: 100%;
  overflow-y: hidden;
}
</style>