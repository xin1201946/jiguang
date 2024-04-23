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
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="选择比赛（左）">
          <a-select style="width: 100%" v-model="name1">
            <a-select-option v-for="item in dataScreenList" :key="item.configId" :value="item.configName">
              {{ item.configName }}
            </a-select-option>
          </a-select>
          <span v-if="data != 2" style="color: #FF0000">展示数量为一时默认全屏</span>
        </a-form-model-item>
        <a-form-model-item label="选择比赛（右）" v-if="data == 2">
          <a-select style="width: 100%" v-model="name2">
            <a-select-option v-for="item in dataScreenList" :key="item.configId" :value="item.configName">
              {{ item.configName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <a-button type="primary" style="text-align:center;" @click="updataScreen">更新</a-button>
    </div>
  </div>
</template>

<script>
import {
  getDataScreenList,
  getDataScreenConfigApi,
  getDataScreenConfigUpdataApi,
  getDataScreenCurrentConfigApi,
} from '@/api/competition'
import { fullscreen } from '@/utils'
export default {
  data() {
    return {
      data: 1,
      dataScreenList: [],
      formData: {},
      name1: '',
      name2: '',
      screenId: 0,
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'
  },
  methods: {
    getList() {
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
  width: 500px;
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
</style>