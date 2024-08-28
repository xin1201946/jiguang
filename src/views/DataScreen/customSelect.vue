<template>
  <div :dur="20" class="DataScreen container">
    <div class="box">
      <div class="boxcust">
        <a-form-model :labelCol="{ span: 6 }" :wrapperCol="{ span: 17 }" ref="form" :model="formData">
          <span style="width: 100%;display: block;color: #FF0000;margin-bottom: 20px;">自定义设置展示多少大屏！！！</span>
          <a-form-model-item v-for="(competition, index) in formData.competitions" :key="index"
            :label="`选择比赛 ${index + 1}`">
            <a-select style="width: 50%" v-model="competition.configId" placeholder="请选择比赛">
              <a-select-option v-for="item in dataScreenList" :key="item.configId" :value="item.configId">
                {{ item.configName }}
              </a-select-option>
            </a-select>
            <a-button type="primary" style="margin-left: 20px;" @click="toDataScreen(competition.configId)">数据大屏{{
    `${index + 1}` }}</a-button>
            <a-button class="elButtonsjian" @click="removeFormItem(index)" icon="minus-circle"></a-button>
            <template v-if="index === formData.competitions.length - 1">
              <a-button class="elButtons" @click="addFormItem" icon="plus-circle"></a-button>
            </template>
          </a-form-model-item>
          <a-button type="primary" style="text-align:center;margin-left: 20px;"
            @click="handleUpdateCustom">更新</a-button>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import {
  // 默认大屏
  getDataScreenList,
  // 自定义配置大屏
  getDatabizCustomScreenListApi,
  getDatabizCustomScreenUpdateApi,
} from '@/api/competition'
import { fullscreen } from '@/utils'
export default {
  data() {
    return {
      data: 1,
      dataScreenList: [],
      formData: {
        competitions: [
          { configId: undefined }
        ]
      },
      name1: '',
      name2: '',
      screenId: 0,
      customList: [],
    }
  },
  mounted() {
    document.body.style.overflow = 'hidden'
  },
  methods: {
    toDataScreen(datas) {
      let obj = []
      if (datas) {
        obj = this.dataScreenList.filter((item) => item.configId == datas)
      }
      // // console.log(this.dataScreenList)
      const router = this.$router
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      // console.log(obj, '63622555---')
      window.open(
        router.resolve({ name: 'DataScreen', query: { data: encodeURI(JSON.stringify(obj)) } }).href,
        '_blank',
        `width=${screenWidth}, height=${screenHeight}`
      )
    },
    getList() {
      getDataScreenList({}).then((res) => {
        this.dataScreenList = res.result
        // 回显当前选中的
        getDatabizCustomScreenListApi().then((res) => {
          if (res.code == 200) {
            this.formData.competitions = res.result
            // console.log(this.formData.competitions, '自定义列表')
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },

    //自定义 增加比赛
    addFormItem() {
      this.formData.competitions.push({ configId: '' }) // 添加一个新的比赛选择项  
    },
    //自定义 减少比赛
    removeFormItem(index) {
      if (this.formData.competitions.length > 1) {
        this.formData.competitions.splice(index, 1);   // 移除比赛选择项  
      } else {
        this.$message.error('至少要选择一个比赛！')
      }
    },
    // 自定义 表单更新
    handleUpdateCustom() {
      // console.log('更新的表单数据:', this.formData)
      let arr = []
      let hasDuplicate = false // 用来标记是否有重复项
      this.formData.competitions.map((item) => {
        // return arr.push(item.configId)
        if (arr.includes(item.configId)) {
          hasDuplicate = true
          this.$message.error('选择的两场比赛相同了!')
          arr = []
        } else {
          arr.push(item.configId)
        }
      })
      if (hasDuplicate) {
        // console.log('数组已清空，因为存在重复的比赛选择')
      } else {
        this.getCustomUpdateApi(arr)
      }
    },
    // 自定义 表单更新 接口
    getCustomUpdateApi(arr) {
      getDatabizCustomScreenUpdateApi({ configIdList: arr }).then((res) => {
        if (res.code == 200) {
          this.$message.success('更新成功！')
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => { })
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

.boxcust {
  position: relative;
}

.elButtons {
  width: 32px;
  height: 32px;
  color: #1890ff;
  font-size: 14px;
  position: absolute;
  top: -5px;
  right: -12%;
  border: 0;

  /deep/ svg {
    width: 25px;
    height: 25px;
  }
}

.elButtonsjian {
  width: 32px;
  height: 32px;
  color: #1890ff;
  font-size: 14px;
  position: absolute;
  top: -5px;
  right: -22%;
  border: 0;

  /deep/ svg {
    width: 25px;
    height: 25px;
  }
}
</style>