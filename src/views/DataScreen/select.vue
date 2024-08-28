<template>
  <div :dur="20" class="DataScreen container">
    <div class="box">
      <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 14 }" ref="form" :model="formData">
        <a-form-model-item label="展示比赛数量">
          <a-radio-group v-model="data">
            <a-radio :value="1">
              一场
            </a-radio>
            <a-radio :value="2">
              两场
            </a-radio>
            <!-- <a-radio :value="3">
              自定义
            </a-radio> -->
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="选择比赛（左）" v-if="data == 1 || data == 2">
          <a-select style="width: 50%" v-model="name1">
            <a-select-option v-for="item in dataScreenList" :key="item.configId" :value="item.configName">
              {{ item.configName }}
            </a-select-option>
          </a-select>
          <a-button type="primary" style="width: 40%;margin-left: 20px;" @click="toDataScreen('左')">数据大屏（比赛左）</a-button>
          <span style="width: 100%;display: block;color: #FF0000" v-if="data != 2">展示数量为一时默认全屏</span>
        </a-form-model-item>
        <a-form-model-item label="选择比赛（右）" v-if="data == 2">
          <a-select style="width: 50%" v-model="name2">
            <a-select-option v-for="item in dataScreenList" :key="item.configId" :value="item.configName">
              {{ item.configName }}
            </a-select-option>
          </a-select>
          <a-button type="primary" style="width: 40%;margin-left: 20px;" @click="toDataScreen('右')">数据大屏（比赛右）</a-button>
        </a-form-model-item>
      </a-form-model>
      <a-button type="primary" style="text-align:center;" @click="updataScreen"
        v-if="data == 1 || data == 2">更新</a-button>

      <!-- <div v-if="data == 3" class="boxcust">
        <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 17 }" ref="form" :model="formData">
          <span style="width: 100%;display: block;color: #FF0000" v-if="data == 3">自定义设置展示多少大屏！！！</span>
          <a-form-model-item v-for="(competition, index) in formData.competitions" :key="index"
            :label="`选择比赛 ${index + 1}`">
            <a-select style="width: 50%" v-model="competition.configId" placeholder="请选择比赛">
              <a-select-option v-for="item in dataScreenList" :key="item.configId" :value="item.configId">
                {{ item.configName }}
              </a-select-option>
            </a-select>
            <a-button type="primary" style="margin-left: 20px;" @click="toDataScreen(`${index + 1}`)">数据大屏{{ `${index +
    1}` }}</a-button>
            <a-button class="elButtons" @click="addFormItem" icon="plus-circle"></a-button>
            <a-button class="elButtonsjian" @click="removeFormItem" icon="minus-circle"></a-button>
          </a-form-model-item>

          <a-button type="primary" style="text-align:center;margin-left: 20px;"
            @click="handleUpdateCustom">更新</a-button>
        </a-form-model>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  // 默认大屏
  getDataScreenList,
  getDataScreenConfigApi,
  getDataScreenConfigUpdataApi,
  getDataScreenCurrentConfigApi,
  // 自定义配置大屏
  // getDatabizCustomScreenListApi,
  // getDatabizCustomScreenSaveApi,
  // getDatabizCustomScreenUpdateApi,
  // getDatabizCustomScreenDeletesApi,
} from '@/api/competition'
import { fullscreen } from '@/utils'
export default {
  data() {
    return {
      data: 1,
      dataScreenList: [],
      formData: {},
      // formData: {
      //   competitions: [
      //     { configId: undefined }
      //   ]
      // },
      name1: '',
      name2: '',
      screenId: 0,
      // customList: [],
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'
  },
  // watch: {
  //   data(val) {
  //     console.log(val, '63622555---')
  //     if (val == 3) {
  //       this.getCustomList()
  //     }
  //   }
  // },
  methods: {
    toDataScreen(type) {
      let obj = []
      if (type == '左') {
        obj = this.dataScreenList.filter((item) => item.configName == this.name1)
      } else {
        obj = this.dataScreenList.filter((item) => item.configName == this.name2)
      }
      console.log(this.name1)
      console.log(this.name2)
      console.log(this.dataScreenList)
      console.log(obj)
      const router = this.$router
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      window.open(
        router.resolve({ name: 'DataScreen', query: { data: encodeURI(JSON.stringify(obj)) } }).href,
        '_blank',
        `width=${screenWidth}, height=${screenHeight}`
      )
    },
    getList() {
      // this.getCustomList()
      getDataScreenList({}).then((res) => {
        this.dataScreenList = res.result
        // 回显当前选中的
        getDataScreenConfigApi().then((data) => {
          this.data = data.result[0].amount
          this.screenId = data.result[0].screenId
          if (this.data == 1) {
            this.name1 = data.result[0].leftConfigName
          } else if (this.data == 2) {
            this.name1 = data.result[0].leftConfigName
            this.name2 = data.result[0].rightConfigName
          }
        })
      })
    },
    /**
     * 自定义大屏列表
     * */
    // getCustomList() {
    //   getDatabizCustomScreenListApi().then((res) => {
    //     // this.customList = res.result
    //     // console.log(this.customList, '自定义列表')
    //     if (res.code == 200) {
    //       this.formData.competitions = res.result
    //       console.log(this.formData.competitions, '自定义列表')
    //     } else {
    //       this.$message.error(res.message)
    //     }
    //   })
    // },
    updataScreen() {
      // console.log(1)
      if (this.name1 == this.name2) {
        return this.$message.error('选择的两场比赛相同了!')
      }
      // console.log(2)
      if (!this.name1) {
        return this.$message.error('选择比赛!')
      }
      // console.log(3)
      if (this.data == 2 && !this.name2) {
        return this.$message.error('选择比赛!')
      }
      // let arr = this.dataScreenList.filter((item) => item.configName === this.name1 || item.configName === this.name2)
      let arr = []
      if (this.name1) {
        // console.log(4)
        arr[0] = this.dataScreenList.filter((item) => item.configName === this.name1)[0]
      }
      if (this.name2) {
        // console.log(5)
        arr[1] = this.dataScreenList.filter((item) => item.configName === this.name2)[0]
      }
      console.log(arr)
      let data = {
        amount: this.data * 1,
        leftConfigId: arr[0].configId,
        rightConfigId: arr[1] && arr[1].configId,
        screenId: this.screenId,
      }
      if (arr.length == 1) {
        // console.log(6)
        data['leftConfigId'] = arr[0].configId
      } else if (arr.length == 2) {
        // console.log(7)
        data['rightConfigId'] = arr[1].configId
      }
      // console.log(8)
      getDataScreenConfigUpdataApi(data).then((res) => {
        this.$message.success('更新成功！')
        this.getList()
      })
    },

    // //自定义 增加比赛
    // addFormItem() {
    //   this.formData.competitions.push({ configId: '' }) // 添加一个新的比赛选择项  
    // },
    // //自定义 减少比赛
    // removeFormItem() {
    //   if (this.formData.competitions.length > 1) {
    //     this.formData.competitions.pop() // 移除最后一个比赛选择项  
    //   } else {
    //     this.$message.error('至少要选择一个比赛！')
    //   }
    // },
    // // 自定义 表单更新
    // handleUpdateCustom() {
    //   console.log('更新的表单数据:', this.formData)
    //   let arr = []
    //   this.formData.competitions.map((item) => {
    //     return arr.push(item.configId)
    //   }),
    //     console.log(arr, '自定义表单更新', this.formData.competitions)
    //   let obj = {
    //     amount: 3,
    //     configIdList: arr,
    //   }
    //   getDatabizCustomScreenUpdateApi(obj).then((res) => {
    //     // console.log(res, '更新成功')
    //     if (res.code == 200) {
    //       this.$message.success('更新成功！')
    //     } else {
    //       this.$message.error(res.message)
    //     }
    //   }).catch((err) => { })
    // },
  },
}
</script>

<style scoped lang='less'>
@height: 46px;

.container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  color: #fff;
  width: 100%;
}

.box {
  width: 800px;
  height: 500px;
  padding: 30px 30px 10px 30px;
  // border: 2px solid #2174B6;
  margin: 0 auto;
  text-align: center;
}

.title {
  text-align: center;
  font-size: 50px;
  margin-top: 50px;
}

// .boxcust {
//   position: relative;
// }

// .elButtons {
//   width: 32px;
//   height: 32px;
//   color: #1890ff;
//   font-size: 14px;
//   position: absolute;
//   top: -5px;
//   right: -12%;
//   border: 0;

//   /deep/ svg {
//     width: 25px;
//     height: 25px;
//   }
// }

// .elButtonsjian {
//   width: 32px;
//   height: 32px;
//   color: #1890ff;
//   font-size: 14px;
//   position: absolute;
//   top: -5px;
//   right: -22%;
//   border: 0;

//   /deep/ svg {
//     width: 25px;
//     height: 25px;
//   }
// }</style>