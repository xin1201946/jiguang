<template>
  <div :dur="20" class="DataScreen container">
    <h1 class="title">河北省中学生射击锦标赛</h1>
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
              {{item.configName}}
            </a-select-option>
          </a-select>
          <span v-if="data != 2" style="color: #FF0000">展示数量为一时默认全屏</span>
        </a-form-model-item>
        <a-form-model-item label="选择比赛（右）" v-if="data == 2">
          <a-select style="width: 100%" v-model="name2">
            <a-select-option v-for="item in dataScreenList" :key="item.configId" :value="item.configName">
              {{item.configName}}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
      <a-button type="primary" style="text-align:center;" @click="handleFullscreen()">进入大屏</a-button>
    </div>
  </div>
</template>

<script>
import { getDataScreenList } from '@/api/competition'
import { fullscreen } from '@/utils'
export default {
  data() {
    return {
      data: 1,
      dataScreenList: [],
      formData: {},
      name1: '',
      name2: '',
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'
    getDataScreenList({}).then((res) => {
      this.dataScreenList = res.result
      console.log(res)
    })
  },
  methods: {
    handleFullscreen() {
      if (this.name1 == this.name2) {
        return this.$message.error('选择的两场比赛相同了!')
      }
      let arr = this.dataScreenList.filter((item) => item.configName === this.name1 || item.configName === this.name2)

      this.$router.replace({
        path: '/DataScreen/index',
        query: {
          arr: JSON.stringify(arr),
        },
      })
      fullscreen()
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