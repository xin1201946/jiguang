<template>
  <div class="common">
    <!-- <h1 class="preface" v-if="type === '混团赛金铜牌赛'">
      发序: 1
    </h1> -->

    <div class="common-tit">
      <p v-for="(item, index) in TitleList" :key="index" :style="item.width ? `width:${item.width};flex:none` : ''">
        {{ item.name }}
      </p>
    </div>
    <div class="common-list">
      <!-- 个人赛淘汰赛 -->
      <template v-if="type === '个人赛淘汰赛'">
        <div v-for="(item, index) in TableList" :key="index" class="common-list-item" :style="`position: absolute;left: 0; top: ${item.position}px;`">
          <template v-for="(e, v) in TitleList">
            <div v-if="e.name === '排名'" :key="v" :style="e.width ? `width:${e.width};flex:none` : ''">
              {{ item[e.name] }}
            </div>
            <!-- :class="e.name == '排名' ? 'ranking' : ''" -->
            <p v-if="e.name !== '排名'" :style="e.width ? `min-width:${e.width};flex:none` : ''" :key="v">
              {{ item[e.name] }}
            </p>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
    },
    TitleList: {
      type: Array,
    },
    List: {
      type: Array,
    },
  },
  data() {
    return {
      TableList: [],

      data: [],
    }
  },
  watch: {
    List: {
      handler(newList, oldList) {
        if (this.List) {
          this.initialization()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /**
     * 获取列表的
     */
    initialization() {
      if (this.type === '个人赛' || this.type === '个人赛淘汰赛') {
        this.defaultList()
      }
      this.$forceUpdate()
    },
    /**
     * 个人
     */
    defaultList() {
      this.data = []
      this.List.forEach((item, index) => {
        this.data.push({
          ...item,
          position: this.TableList.length === 0 ? (index == 0 ? 0 : index * 50) : '585',
        })
      })
      let idArr = this.TableList.map((item) => item['靶位'])
      let newIdList = this.data.map((item) => item['靶位'])
      if (idArr.length != 0) {
        for (let i in this.data) {
          if (idArr.indexOf(this.data[i]['靶位']) === -1) {
            // console.log('列表中不存在', this.data[i])
            this.TableList.push(this.data[i])
            setTimeout(() => {
              this.data[i].position = i * 50
            }, 100)
            this.TableList.forEach((e, index) => {
              if (newIdList.indexOf(e['靶位']) === -1) {
                e.position = '585'
                let obj = this.TableList[index]
                this.TableList[index] = this.TableList[this.TableList.length - 1]
                this.TableList[this.TableList.length - 1] = obj
                this.TableList = this.TableList.splice(0, this.data.length)
              }
            })
          } else {
            this.TableList.forEach((e, index) => {
              if (this.data[i]['靶位'] === e['靶位']) {
                if (this.data[i]['排名'] == e['排名']) {
                  this.TableList[index] = {
                    ...this.data[i],
                    position: e.position,
                  }
                  // console.log('相同', this.data[i])
                } else {
                  // console.log('列表中存在，但位置改变', this.data, this.data[i], i, i * 55)
                  this.TableList[index] = {
                    ...this.data[i],
                    position: i * 50,
                  }
                }
              }
            })
          }
        }
      } else {
        this.TableList = this.data
      }
    },
  },
}
</script>

<style lang="less" scoped>
p {
  margin: 0;
  padding: 0;
  line-height: 40px;
}
.common {
  color: #fff;

  .preface {
    text-align: center;
    font-weight: bolder;
    color: #fff;
    font-size: 40px;
  }
  &-tit {
    display: flex;
    align-items: center;
    text-align: center;
    border-radius: 8px;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    p {
      flex: 1;
      font-weight: 1000;
      font-size: 24px;
      line-height: 50px;
      margin-bottom: 0;
    }
  }
  &-list {
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
    &-item {
      display: flex;
      text-align: center;
      overflow: hidden;
      transition: 0.5s;
      box-shadow: 0 1px 10px 0 #7ecdfa;
      div {
        flex: 1;
        font-size: 24px;
        line-height: 40px;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-weight: bolder;
        border-bottom: 2px solid rgba(255, 255, 255, 0.3);
        box-sizing: border-box;
        background: linear-gradient(to right, #ff0008, #449dd1);
      }
      p {
        flex: 1;
        font-size: 20px;

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;

        background: #449dd1;
        border-bottom: 2px solid rgba(255, 255, 255, 0.3);
        box-sizing: border-box;
      }
    }
  }
}
</style>