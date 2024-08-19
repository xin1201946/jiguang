<template>
  <div class="card">
    <Card>
      <template slot="query">
        <a-form :label-col="{ span: 3 }" :wrapper-col="{ span: 5 }">
          <a-row :gutter="24">
            <a-col>
              <a-form-item label="平板编号">
                <a-input placeholder="请输入平板编号" v-model="formData.pads" />
                <!-- <a-select allowClear mode="multiple" v-model="formData.pads" placeholder="请输入平板编号">
                  <a-select-option v-for="item in dataContList" :key="item.contestId" :value="item.contestId">{{
          item.contestName }}
                  </a-select-option>
                </a-select> -->
              </a-form-item>
            </a-col>
            <a-col>
              <a-form-item label="总组数">
                <a-input placeholder="请输入总组数" v-model="formData.shoots" />
                <span class="text_s">总组数：例如40发就传4 ！！！</span>
              </a-form-item>
            </a-col>
            <a-form-item>
              <a-space class="spce_div">
                <!-- <a-button html-type="submit" type="primary" icon="search" @click="handleCancel">取消</a-button> -->
                <a-button html-type="submit" type="primary" @click="handleSubmit">提交</a-button>
              </a-space>
            </a-form-item>
          </a-row>
        </a-form>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
import { bizSendScoreSend } from '@api/competition'
export default {
  name: 'achievementEquipment',
  components: {
    Card,
  },
  data() {
    return {
      formData: {},
      dataContList: [],
    }
  },
  methods: {
    handleSubmit() {
      // console.log(this.formData)
      // return
      bizSendScoreSend(this.formData).then((res) => {
        if (res.success) {
          this.$message.success('提交成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.card {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.spce_div {
  display: flex;
  justify-content: flex-end;
}

.text_s {
  color: red;
  font-size: 14px;
}
</style>